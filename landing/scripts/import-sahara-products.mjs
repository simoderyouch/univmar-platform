/**
 * Import non-local products from saharamarbre.com WooCommerce store API.
 * Run: node scripts/import-sahara-products.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const API = "https://saharamarbre.com/wp-json/wc/store/products";

const CATEGORY_DEFS = [
  { id: 45, name: "Marbre local", order: 1, local: true },
  { id: 70, name: "Pierre Naturelle&Tahejart", order: 2, local: true },
  { id: 1, name: "Granit", order: 3 },
  { id: 18, name: "Marbre", order: 4 },
  { id: 85, name: "Onyx", order: 5 },
  { id: 86, name: "Quartz", order: 6 },
  { id: 87, name: "Pierre naturelle", order: 7 },
];

const PARENT_MAP = {
  Granit: 1,
  Marbre: 18,
  Onyx: 85,
  Quartz: 86,
  "Pierre naturelle": 87,
};

const GRANIT_IDS = new Set([103, 116, 118, 117]);
const MARBRE_IDS = new Set([102, 114, 109, 111, 110, 113, 112, 115]);
const QUARTZ_IDS = new Set([106, 126, 127]);
const ONYX_IDS = new Set([107]);
const PIERRE_IDS = new Set([104, 120]);
const LOCAL_IDS = new Set([129, 119, 124]);
const TRAVERTIN_IDS = new Set([105, 121, 122, 123, 125]);

function slugifyFile(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 80);
}

function getParentType(categoryIds) {
  if (categoryIds.some((id) => GRANIT_IDS.has(id))) return "Granit";
  if (categoryIds.some((id) => QUARTZ_IDS.has(id))) return "Quartz";
  if (categoryIds.some((id) => ONYX_IDS.has(id))) return "Onyx";
  if (categoryIds.some((id) => PIERRE_IDS.has(id))) return "Pierre naturelle";
  if (categoryIds.some((id) => MARBRE_IDS.has(id))) return "Marbre";
  return null;
}

function shouldExclude(categoryIds) {
  if (categoryIds.some((id) => LOCAL_IDS.has(id))) return "local";
  if (categoryIds.some((id) => TRAVERTIN_IDS.has(id))) return "travertin";
  if (!categoryIds.length || categoryIds.includes(16)) return "uncategorized";
  return null;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url, retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (!res.ok) throw new Error(`API ${res.status}`);
      return await res.json();
    } catch (e) {
      if (attempt === retries) throw e;
      await sleep(1000 * attempt);
    }
  }
}

async function fetchAllProducts() {
  const items = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await fetchJson(`${API}?per_page=100&page=${page}`);
    if (!batch.length) break;
    items.push(...batch);
    if (batch.length < 100) break;
  }
  return items;
}

async function fetchProductDetail(slug) {
  return fetchJson(`${API}/${slug}`);
}

async function downloadImage(url, destPath) {
  const dir = path.dirname(destPath);
  fs.mkdirSync(dir, { recursive: true });
  if (fs.existsSync(destPath)) return;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (!res.ok) throw new Error(`Image ${res.status}: ${url}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(destPath, buf);
      return;
    } catch (e) {
      if (attempt === 4) throw e;
      await sleep(1000 * attempt);
    }
  }
}

async function main() {
  const existing = JSON.parse(fs.readFileSync(path.join(ROOT, "data/products.json"), "utf8"));
  const localProducts = existing
    .filter((p) => p.categoryId === 45 || p.categoryId === 70)
    .map((p) => ({
      ...p,
      applicationImages: p.applicationImages ?? [],
    }));

  console.log(`Keeping ${localProducts.length} local products`);
  const remote = await fetchAllProducts();
  console.log(`Fetched ${remote.length} products from Sahara Marbre`);

  const imported = [];
  const skipped = {};
  let nextId = 5000;

  for (const p of remote) {
    const catIds = (p.categories || []).map((c) => c.id);
    const reason = shouldExclude(catIds);
    if (reason) {
      skipped[reason] = (skipped[reason] || 0) + 1;
      continue;
    }

    const parentType = getParentType(catIds);
    if (!parentType) {
      skipped["no-parent"] = (skipped["no-parent"] || 0) + 1;
      console.warn("Skip (no parent):", p.name, (p.categories || []).map((c) => c.name));
      continue;
    }

    let detail;
    try {
      detail = await fetchProductDetail(p.slug);
      await sleep(150);
    } catch (e) {
      console.warn("Detail fetch failed:", p.name, e.message);
      skipped["detail-error"] = (skipped["detail-error"] || 0) + 1;
      continue;
    }

    const gallery = detail.images ?? p.images ?? [];
    const imageUrl = gallery[0]?.src;
    if (!imageUrl) {
      skipped["no-image"] = (skipped["no-image"] || 0) + 1;
      continue;
    }

    const categoryId = PARENT_MAP[parentType];
    const baseName = slugifyFile(p.name);
    const imageDir = `/images/${parentType}/images`;
    const ext = path.extname(new URL(imageUrl).pathname) || ".jpg";
    const fileName = `${baseName}${ext}`;
    const relPath = `${imageDir}/${fileName}`;
    const absPath = path.join(ROOT, "public", relPath.replace(/^\//, ""));

    const applicationImages = [];

    try {
      await downloadImage(imageUrl, absPath);

      for (let i = 1; i < gallery.length; i++) {
        const appUrl = gallery[i]?.src;
        if (!appUrl) continue;
        const appExt = path.extname(new URL(appUrl).pathname) || ".jpg";
        const appFileName = `${baseName}_application_${i}${appExt}`;
        const appRelPath = `${imageDir}/${appFileName}`;
        const appAbsPath = path.join(ROOT, "public", appRelPath.replace(/^\//, ""));
        await downloadImage(appUrl, appAbsPath);
        applicationImages.push(appRelPath);
      }
    } catch (e) {
      console.warn("Image failed:", p.name, e.message);
      skipped["image-error"] = (skipped["image-error"] || 0) + 1;
      continue;
    }

    const now = new Date().toISOString();
    imported.push({
      id: nextId++,
      name: p.name.trim(),
      regularPrice: null,
      images: relPath,
      applicationImages,
      categoryId,
      type: "simple",
      published: true,
      visibility: "visible",
      inStock: true,
      createdAt: now,
      updatedAt: now,
      category: {
        id: categoryId,
        name: parentType,
        order: CATEGORY_DEFS.find((c) => c.id === categoryId)?.order ?? 99,
      },
      source: "saharamarbre.com",
    });
  }

  const categories = CATEGORY_DEFS.filter((c) => {
    if (c.local) return true;
    return imported.some((p) => p.categoryId === c.id);
  });

  const products = [...localProducts, ...imported];
  fs.writeFileSync(
    path.join(ROOT, "data/categories.json"),
    JSON.stringify(categories, null, 2) + "\n",
  );
  fs.writeFileSync(
    path.join(ROOT, "data/products.json"),
    JSON.stringify(products, null, 2) + "\n",
  );

  const byCat = {};
  for (const p of imported) byCat[p.category.name] = (byCat[p.category.name] || 0) + 1;

  console.log("Imported:", imported.length, byCat);
  console.log("Skipped:", skipped);
  console.log("Total products:", products.length);
  console.log("Categories:", categories.map((c) => c.name).join(", "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
