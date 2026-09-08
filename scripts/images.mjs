// Emits responsive WebP variants for every photo in public/photos into
// public/photos/w/. Run manually (`npm run images`) and commit the output —
// deterministic, keeps the Netlify build fast, and reviewers see the bytes.
import sharp from "sharp";
import { readdir, stat, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public/photos");
const out = path.join(src, "w");
await mkdir(out, { recursive: true });

const WIDTHS = [480, 960];
const HERO_WIDTHS = [...WIDTHS, 1600, 2400];
const PORTRAIT_WIDTHS = [320, 640, 960];
const PORTRAIT = "antoinette-ferry";

const { listings } = JSON.parse(await readFile(path.join(root, "src/data/listings.json"), "utf8"));
const heroes = new Set(
  listings.map((l) => l.photos?.[0]?.src ?? "").filter((s) => /\.jpe?g$/i.test(s)).map((s) => path.basename(s).replace(/\.jpe?g$/i, ""))
);

const files = (await readdir(src)).filter((f) => /\.jpe?g$/i.test(f));
let written = 0;
for (const f of files) {
  const base = f.replace(/\.jpe?g$/i, "");
  const input = path.join(src, f);
  const inStat = await stat(input);
  const widths = base === PORTRAIT ? PORTRAIT_WIDTHS : heroes.has(base) ? HERO_WIDTHS : WIDTHS;
  for (const w of widths) {
    const target = path.join(out, `${base}-${w}.webp`);
    const fresh = await stat(target).then((s) => s.mtimeMs >= inStat.mtimeMs).catch(() => false);
    if (fresh) continue;
    await sharp(input).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(target);
    written++;
  }
}
console.log(`images: ${files.length} sources, ${written} variants written to public/photos/w/`);
