// Renders public/og.png (1200×630) from an inline SVG via sharp, compositing
// the real BHHS Heymann Williams Commercial lockup and the portrait.
// Run once (`npm run og`) and commit the PNG.
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const F = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#F8F5EF"/>
  <text x="80" y="360" font-family="${F}" font-size="34" font-weight="600" fill="#1B1714">Antoinette Ferry</text>
  <text x="80" y="398" font-family="${F}" font-size="22" fill="#5C554E">Director of Commercial Sales &amp; Leasing</text>
  <rect x="80" y="430" width="48" height="3" fill="#670038"/>
  <text x="80" y="468" font-family="${F}" font-size="18" fill="#726A62">Nassau County commercial real estate</text>
  <text x="80" y="560" font-family="${F}" font-size="16" fill="#8b8177">ferrycre.com</text>
</svg>`;

const logo = await sharp(path.join(root, "public/brand/hw-commercial-lockup-cab.svg"))
  .resize({ width: 460 })
  .toBuffer();
const portrait = await sharp(path.join(root, "public/photos/antoinette-ferry.jpg")).resize(540, 630, { fit: "cover" }).toBuffer();

await sharp(Buffer.from(svg))
  .composite([
    { input: logo, left: 80, top: 90 },
    { input: portrait, left: 660, top: 0 },
  ])
  .png()
  .toFile(path.join(root, "public/og.png"));
console.log("Wrote public/og.png");
