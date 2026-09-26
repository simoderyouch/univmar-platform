import sharp from "sharp";

const MAX_WIDTH = 1800;
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 82;

export type OptimizeResult = {
  buffer: Buffer;
  ext: string;
};

export async function optimizeImageBuffer(
  input: Buffer,
  ext: string,
): Promise<OptimizeResult> {
  const normalized = ext.toLowerCase();
  const base = sharp(input, { failOn: "none" }).rotate();
  const meta = await base.metadata();

  let pipeline =
    meta.width && meta.width > MAX_WIDTH
      ? base.resize(MAX_WIDTH, null, { withoutEnlargement: true })
      : base;

  if (normalized === ".webp") {
    return {
      buffer: await pipeline.webp({ quality: WEBP_QUALITY, effort: 4 }).toBuffer(),
      ext: ".webp",
    };
  }

  if (normalized === ".jpg" || normalized === ".jpeg") {
    return {
      buffer: await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer(),
      ext: ".jpg",
    };
  }

  if (normalized === ".png") {
    if (!meta.hasAlpha) {
      return {
        buffer: await pipeline.webp({ quality: WEBP_QUALITY, effort: 4 }).toBuffer(),
        ext: ".webp",
      };
    }
    return {
      buffer: await pipeline.png({ compressionLevel: 9, palette: true }).toBuffer(),
      ext: ".png",
    };
  }

  return { buffer: input, ext: normalized || ".jpg" };
}

export async function optimizeImageFile(absPath: string): Promise<{ outPath: string; saved: number } | null> {
  const fs = await import("fs/promises");
  const path = await import("path");

  const ext = path.extname(absPath);
  if (!/\.(jpe?g|png|webp)$/i.test(ext)) return null;

  const before = await fs.readFile(absPath);
  const { buffer, ext: outExt } = await optimizeImageBuffer(before, ext);
  const outPath = absPath.replace(/\.(jpe?g|png|webp)$/i, outExt);

  if (buffer.length >= before.length && outPath === absPath) {
    return null;
  }

  if (outPath !== absPath) {
    await fs.writeFile(outPath, buffer);
    await fs.unlink(absPath).catch(() => undefined);
  } else {
    await fs.writeFile(absPath, buffer);
  }

  return { outPath, saved: before.length - buffer.length };
}
