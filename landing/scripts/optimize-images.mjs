/**
 * Compress product images under public/images and update data/products.json paths.
 * Run: npm run optimize:images
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public", "images");
const PRODUCTS_PATH = path.join(ROOT, "data", "products.json");

const MAX_WIDTH = 1800;
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 82;

const pathMap = new Map();

async function optimizeFile(absPath) {
  const ext = path.extname(absPath);
  if (!/\.(jpe?g|png|webp)$/i.test(ext)) return;

  const before = await fs.readFile(absPath);
  const base = sharp(before, { failOn: "none" }).rotate();
  const meta = await base.metadata();
  let pipeline =
    meta.width && meta.width > MAX_WIDTH
      ? base.resize(MAX_WIDTH, null, { withoutEnlargement: true })
      : base;

  let outExt = ext.toLowerCase();
  let buffer;

  if (outExt === ".webp") {
    buffer = await pipeline.webp({ quality: WEBP_QUALITY, effort: 4 }).toBuffer();
  } else if (outExt === ".jpg" || outExt === ".jpeg") {
    buffer = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
    outExt = ".jpg";
  } else if (outExt === ".png") {
    if (!meta.hasAlpha) {
      buffer = await pipeline.webp({ quality: WEBP_QUALITY, effort: 4 }).toBuffer();
      outExt = ".webp";
    } else {
      buffer = await pipeline.png({ compressionLevel: 9, palette: true }).toBuffer();
    }
  } else {
    return;
  }

  const relFromPublic = "/" + path.relative(path.join(ROOT, "public"), absPath).split(path.sep).join("/");
  const outAbs = absPath.replace(/\.(jpe?g|png|webp)$/i, outExt);

  if (buffer.length >= before.length && outAbs === absPath) return;

  if (outAbs !== absPath) {
    await fs.writeFile(outAbs, buffer);
    await fs.unlink(absPath).catch(() => undefined);
    const relOut = "/" + path.relative(path.join(ROOT, "public"), outAbs).split(path.sep).join("/");
    pathMap.set(relFromPublic, relOut);
  } else {
    await fs.writeFile(absPath, buffer);
  }

  const saved = before.length - buffer.length;
  if (saved > 0) {
    console.log(`  ${path.basename(absPath)}  −${(saved / 1024).toFixed(0)} KB`);
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(abs);
    else await optimizeFile(abs);
  }
}

async function updateProductsJson() {
  if (pathMap.size === 0) return;
  const raw = await fs.readFile(PRODUCTS_PATH, "utf-8");
  let next = raw;
  for (const [from, to] of pathMap) {
    next = next.split(from).join(to);
  }
  if (next !== raw) {
    await fs.writeFile(PRODUCTS_PATH, next);
    console.log(`Updated ${pathMap.size} path(s) in data/products.json`);
  }
}

const beforeSize = await fs
  .readdir(IMAGES_DIR, { recursive: true })
  .then(async (files) => {
    let total = 0;
    for (const f of files) {
      const p = path.join(IMAGES_DIR, f);
      try {
        const s = await fs.stat(p);
        if (s.isFile()) total += s.size;
      } catch {
        /* skip */
      }
    }
    return total;
  });

console.log("Optimizing public/images …");
await walk(IMAGES_DIR);
await updateProductsJson();

const afterSize = await fs
  .readdir(IMAGES_DIR, { recursive: true })
  .then(async (files) => {
    let total = 0;
    for (const f of files) {
      const p = path.join(IMAGES_DIR, f);
      try {
        const s = await fs.stat(p);
        if (s.isFile()) total += s.size;
      } catch {
        /* skip */
      }
    }
    return total;
  });

console.log(
  `Done. ${(beforeSize / 1024 / 1024).toFixed(1)} MB → ${(afterSize / 1024 / 1024).toFixed(1)} MB (−${(((beforeSize - afterSize) / beforeSize) * 100).toFixed(0)}%)`,
);
