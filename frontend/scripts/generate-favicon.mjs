/**
 * Builds app/favicon.ico from public/logo.svg so Next.js uses your mark
 * instead of the default placeholder favicon.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const svgPath = path.join(root, "public", "logo.svg");
const outPath = path.join(root, "app", "favicon.ico");

const sizes = [16, 32, 48];
const pngs = await Promise.all(
  sizes.map((s) => sharp(svgPath).resize(s, s).png().toBuffer()),
);
const ico = await toIco(pngs);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, ico);
console.log("Wrote", path.relative(root, outPath));
