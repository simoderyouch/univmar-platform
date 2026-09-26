/**
 * Scrape application images from Moroccan stone supplier websites.
 * Only fills products that do not already have applicationImages.
 * Run: node scripts/scrape-application-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PRODUCTS_PATH = path.join(ROOT, "data/products.json");

const WC_SOURCES = [
  { id: "saharamarbre.com", base: "https://saharamarbre.com" },
  { id: "marbreriedumaroc.com", base: "https://marbreriedumaroc.com" },
  { id: "zerkamarbre.com", base: "https://www.zerkamarbre.com" },
  { id: "piedrataza.com", base: "https://piedrataza.com" },
];

const NAME_ALIASES = {
  "noir khenifra": "noir khnifra",
  "eclate noir khenifra": "noir khnifra",
  "eclate noir azilal": "noir azilal",
  "gris tiflet": "marbre gris tiflet",
  "gris de taza": "gris taza polli",
  "noir azilal": "noir de taza",
  "volubilis": "travertin volubilis",
  "zola vieille": "gris itrane vieilli",
  "jaune bejaad": "marbre bejaad",
  "rouge agadir": "rouge agadir",
  "pierre volcanique": "noir volcano",
  "bir jdid": "beige luna",
  "ardoise verdatre": "ardoise vert foret",
  "ardoise gris benikhirane": "ardoise bronze",
  "ardoise violet fonce": "ardoise noir volcan",
  "pierre naturelle": "pierre de bali poli",
};

const FINISH_WORDS = new Set([
  "polli",
  "polie",
  "poli",
  "bouchardé",
  "boucharde",
  "boucharde",
  "boucharche",
  "vieille",
  "vieilli",
  "vieilli",
  "brut",
  "veinage",
  "vinage",
  "strié",
  "strie",
  "sablé",
  "sable",
  "eclate",
  "eclaté",
  "clate",
  "naturelle",
  "naturel",
  "pierre",
  "de",
  "marbre",
  "granit",
  "tranche",
  "taille",
  "bloc",
  "saturne",
  "cm",
]);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function cleanCatalogName(name) {
  return String(name || "")
    .replace(/^\[[^\]]+\]\s*/g, "")
    .replace(/^Pïerre/i, "Pierre")
    .replace(/&rsquo;/g, "'")
    .trim();
}

function normalizeName(name) {
  return cleanCatalogName(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugifyFile(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 80);
}

function coreTokens(name) {
  return normalizeName(name)
    .split(" ")
    .filter((token) => token.length > 2 && !FINISH_WORDS.has(token));
}

function matchScore(productName, catalogName) {
  const a = new Set(coreTokens(productName));
  const b = new Set(coreTokens(catalogName));
  if (!a.size || !b.size) return 0;

  let hits = 0;
  for (const token of a) {
    if (b.has(token)) hits += 1;
  }

  return hits / Math.max(a.size, b.size);
}

function cleanImageUrl(url) {
  return url
    .replace(/&amp;/g, "&")
    .replace(/-\d+x\d+(?=\.(jpg|jpeg|png|webp))/i, "");
}

function imagesFromHtml(html) {
  if (!html) return [];
  const matches = html.match(/https?:\/\/[^"'\s>]+\.(?:jpg|jpeg|png|webp)/gi) ?? [];
  return [...new Set(matches.map(cleanImageUrl))];
}

function isDecorativeImage(url) {
  const lower = url.toLowerCase();
  return (
    lower.includes("cropped-") ||
    lower.includes("/logo") ||
    lower.includes("favicon") ||
    lower.includes("-180x180") ||
    lower.includes("-192x192") ||
    lower.includes("-32x32") ||
    lower.includes("-270x270")
  );
}

async function fetchText(url, retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (error) {
      if (attempt === retries) throw error;
      await sleep(1000 * attempt);
    }
  }
}

async function fetchJson(url, retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (error) {
      if (attempt === retries) throw error;
      await sleep(1000 * attempt);
    }
  }
}

function wcSlug(product) {
  if (product.slug) return product.slug;
  const permalink = product.permalink ?? "";
  return permalink.replace(/\/$/, "").split("/").pop() ?? "";
}

function addCatalogEntry(catalog, entry) {
  const norm = normalizeName(entry.name);
  if (!norm) return;

  const existing = catalog.get(norm);
  if (!existing || entry.applicationUrls.length > existing.applicationUrls.length) {
    catalog.set(norm, entry);
  }

  for (const [alias, target] of Object.entries(NAME_ALIASES)) {
    if (norm === target || norm.includes(target)) {
      const aliasEntry = { ...entry, name: alias };
      const ex = catalog.get(alias);
      if (!ex || aliasEntry.applicationUrls.length > ex.applicationUrls.length) {
        catalog.set(alias, aliasEntry);
      }
    }
  }
}

async function fetchWooCatalog(source) {
  const catalog = new Map();
  const list = [];

  for (let page = 1; page <= 10; page++) {
    try {
      const batch = await fetchJson(`${source.base}/wp-json/wc/store/products?per_page=100&page=${page}`);
      if (!batch?.length) break;
      list.push(...batch);
      if (batch.length < 100) break;
    } catch {
      break;
    }
  }

  for (const item of list) {
    let detail = item;

    if (source.id !== "zerkamarbre.com") {
      const slug = wcSlug(item);
      if (slug) {
        try {
          detail = await fetchJson(`${source.base}/wp-json/wc/store/products/${slug}`);
          await sleep(100);
        } catch {
          detail = item;
        }
      }
    }

    const gallery = (detail.images ?? []).map((img) => cleanImageUrl(img.src)).filter(Boolean);
    const descriptionImages = imagesFromHtml(detail.description);
    const applicationUrls = [
      ...gallery.slice(1),
      ...descriptionImages.filter((url) => !gallery.includes(url)),
    ];

    addCatalogEntry(catalog, {
      name: cleanCatalogName(detail.name),
      source: source.id,
      gallery,
      applicationUrls: [...new Set(applicationUrls)],
    });
  }

  console.log(`[${source.id}] ${catalog.size} indexed products`);
  return catalog;
}

async function fetchItraneCatalog() {
  const catalog = new Map();
  const html = await fetchText("https://www.itranemarbre.com/produits/");
  const linkMatches = [
    ...html.matchAll(/href="(https:\/\/www\.itranemarbre\.com\/portfolio_page\/[^"]+)"/gi),
  ];
  const urls = [...new Set(linkMatches.map((match) => match[1].replace(/&amp;/g, "&")))];

  for (const pageUrl of urls) {
    try {
      const pageHtml = await fetchText(pageUrl);
      await sleep(120);

      const titleMatch =
        pageHtml.match(/<h1[^>]*>([^<]+)</i) ??
        pageHtml.match(/property="og:title"\s+content="([^"]+)"/i) ??
        pageHtml.match(/<title>([^<]+)<\/title>/i);
      const name =
        titleMatch?.[1]
          ?.replace(/&#8211;.*$/, "")
          .replace(/\s*-\s*Itrane Marbre.*$/i, "")
          .replace(/&nbsp;/g, " ")
          .trim() ?? pageUrl.split("/").filter(Boolean).pop();
      const rawImages = [
        ...(pageHtml.match(/https:\/\/www\.itranemarbre\.com\/wp-content\/uploads\/[^"'\s>]+\.(?:jpg|jpeg|png|webp)/gi) ??
          []),
      ]
        .map(cleanImageUrl)
        .filter((url) => !isDecorativeImage(url));

      const uniqueImages = [...new Set(rawImages)];
      const applicationUrls = uniqueImages.length > 1 ? uniqueImages.slice(1) : uniqueImages.slice(0, 1);

      addCatalogEntry(catalog, {
        name,
        source: "itranemarbre.com",
        gallery: uniqueImages,
        applicationUrls,
      });
    } catch (error) {
      console.warn("[itranemarbre.com] skip page:", pageUrl, error.message);
    }
  }

  console.log(`[itranemarbre.com] ${catalog.size} indexed portfolio pages`);
  return catalog;
}

async function fetchPiedratazaGalleryCatalog() {
  const catalog = new Map();
  try {
    const html = await fetchText("https://piedrataza.com/");
    const images = [
      ...(html.match(/https:\/\/piedrataza\.com\/wp-content\/uploads\/[^"'\s>]+\.(?:jpg|jpeg|png|webp)/gi) ??
        []),
    ]
      .map(cleanImageUrl)
      .filter((url) => !isDecorativeImage(url));

    const byFolder = new Map();
    for (const url of [...new Set(images)]) {
      const lower = url.toLowerCase();
      let key = null;
      if (lower.includes("beige") || lower.includes("biege")) key = "beige taza";
      else if (lower.includes("gris")) key = "gris taza";
      else if (lower.includes("volubilis") || lower.includes("boulibilis")) key = "volubilis";
      else if (lower.includes("khnifra") || lower.includes("khenifra")) key = "noir khenifra";
      else if (lower.includes("ardoise")) key = "ardoise";
      else if (lower.includes("rouge")) key = "rouge agadir";

      if (!key) continue;
      if (!byFolder.has(key)) byFolder.set(key, []);
      byFolder.get(key).push(url);
    }

    for (const [key, urls] of byFolder) {
      addCatalogEntry(catalog, {
        name: key,
        source: "piedrataza.com",
        gallery: urls,
        applicationUrls: urls.slice(0, 3),
      });
    }
  } catch (error) {
    console.warn("[piedrataza.com] gallery scrape failed:", error.message);
  }

  console.log(`[piedrataza.com] ${catalog.size} gallery groups`);
  return catalog;
}

function mergeCatalogs(catalogs) {
  const merged = new Map();
  for (const catalog of catalogs) {
    for (const [key, entry] of catalog) {
      const existing = merged.get(key);
      if (!existing || entry.applicationUrls.length > existing.applicationUrls.length) {
        merged.set(key, entry);
      }
    }
  }
  return merged;
}

function resolveProduct(productName, catalog) {
  const candidates = [
    normalizeName(productName),
    normalizeName(productName).replace(/^eclate\s+/, ""),
  ];

  for (const candidate of candidates) {
    if (catalog.has(candidate)) return catalog.get(candidate);
    const alias = NAME_ALIASES[candidate];
    if (alias && catalog.has(alias)) return catalog.get(alias);
  }

  let best = null;
  let bestScore = 0;

  for (const entry of catalog.values()) {
    const score = matchScore(productName, entry.name);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (bestScore >= 0.45) return best;

  const loneTokens = coreTokens(productName);
  if (loneTokens.length === 1) {
    const token = loneTokens[0];
    let tokenBest = null;
    let tokenBestScore = 0;
    for (const entry of catalog.values()) {
      const entryTokens = coreTokens(entry.name);
      if (!entryTokens.includes(token)) continue;
      const score = entry.applicationUrls.length / 10 + entryTokens.length * 0.01;
      if (score > tokenBestScore) {
        tokenBestScore = score;
        tokenBest = entry;
      }
    }
    if (tokenBest) return tokenBest;
  }

  return null;
}

async function downloadImage(url, destPath) {
  const dir = path.dirname(destPath);
  fs.mkdirSync(dir, { recursive: true });

  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (!res.ok) throw new Error(`Image ${res.status}`);
      fs.writeFileSync(destPath, Buffer.from(await res.arrayBuffer()));
      return;
    } catch (error) {
      if (attempt === 4) throw error;
      await sleep(1000 * attempt);
    }
  }
}

async function main() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf8"));
  const targets = products.filter((p) => !(p.applicationImages?.length > 0));

  console.log(`Building catalogs for ${targets.length} products without application images…`);

  const catalogs = await Promise.all([
    ...WC_SOURCES.map((source) => fetchWooCatalog(source)),
    fetchItraneCatalog(),
    fetchPiedratazaGalleryCatalog(),
  ]);

  const catalog = mergeCatalogs(catalogs);
  console.log(`Merged catalog: ${catalog.size} entries`);

  const stats = { updated: 0, noMatch: 0, noApp: 0, failed: 0, skipped: products.length - targets.length };
  const bySource = {};

  const updatedProducts = products.map((product) => ({ ...product }));

  for (const product of targets) {
    const match = resolveProduct(product.name, catalog);

    if (!match) {
      stats.noMatch += 1;
      continue;
    }

    if (!match.applicationUrls.length) {
      stats.noApp += 1;
      continue;
    }

    const categoryName = product.category?.name ?? "Autre";
    const imageDir = `/images/${categoryName}/images`;
    const baseName = slugifyFile(product.name);
    const applicationImages = [];

    try {
      for (let i = 0; i < match.applicationUrls.length; i++) {
        const appUrl = match.applicationUrls[i];
        const appExt = path.extname(new URL(appUrl).pathname) || ".jpg";
        const appFileName = `${baseName}_application_${i + 1}${appExt}`;
        const appRelPath = `${imageDir}/${appFileName}`;
        const appAbsPath = path.join(ROOT, "public", appRelPath.replace(/^\//, ""));

        try {
          await downloadImage(appUrl, appAbsPath);
          applicationImages.push(appRelPath);
        } catch (error) {
          console.warn(`  ! image ${i + 1} failed for ${product.name}:`, error.message);
        }
      }

      if (!applicationImages.length) {
        stats.failed += 1;
        continue;
      }

      const index = updatedProducts.findIndex((p) => p.id === product.id);
      updatedProducts[index] = {
        ...product,
        applicationImages,
        applicationImageSource: match.source,
        updatedAt: new Date().toISOString(),
      };

      stats.updated += 1;
      bySource[match.source] = (bySource[match.source] || 0) + 1;
      console.log(`✓ ${product.name} ← ${match.name} [${match.source}] (${applicationImages.length})`);
    } catch (error) {
      stats.failed += 1;
      console.warn(`✗ ${product.name}:`, error.message);
    }
  }

  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(updatedProducts, null, 2) + "\n");

  const withApp = updatedProducts.filter((p) => p.applicationImages?.length).length;
  console.log("\nDone.");
  console.log("Updated:", stats.updated, bySource);
  console.log("No match:", stats.noMatch);
  console.log("No application on source:", stats.noApp);
  console.log("Failed:", stats.failed);
  console.log("Already had images (skipped):", stats.skipped);
  console.log("Products with applicationImages:", withApp, "/", updatedProducts.length);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
