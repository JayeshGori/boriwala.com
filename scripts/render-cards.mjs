import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const sides = [
  { svg: "card-front.svg", png: "card-front.png" },
  { svg: "card-back.svg", png: "card-back.png" },
];

for (const { svg, png } of sides) {
  const inPath = join(publicDir, svg);
  const outPath = join(publicDir, png);
  await sharp(inPath, { density: 300 })
    .png()
    .toFile(outPath);
  console.log(`Rendered ${png}`);
}

console.log("Done. PNGs are 1050x600 px (3.5in x 2in @ 300 DPI).");
