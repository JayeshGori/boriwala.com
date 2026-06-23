import sharp from "sharp";
import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const printDir = join(__dirname, "..", "public", "print");

// Bleed card = 3.75in x 2.25in (3.5x2 + 0.125in bleed each side)
// 600 DPI -> 2250 x 1350 px.  SVG nominal is 1125x675 (=300dpi at density 72),
// so density 144 doubles it to 600 DPI.
const DENSITY = 144;
const sides = [
  { svg: "card-front-print.svg", png: "card-front-print.png" },
  { svg: "card-back-print.svg", png: "card-back-print.png" },
];

for (const { svg, png } of sides) {
  await sharp(join(printDir, svg), { density: DENSITY })
    .png()
    .toFile(join(printDir, png));
  const meta = await sharp(join(printDir, png)).metadata();
  console.log(`Rendered ${png} (${meta.width}x${meta.height} px, 600 DPI)`);
}

// Build 2-page print PDF at exact bleed size: 3.75in x 2.25in = 270pt x 162pt
const PAGE_W = 3.75 * 72; // 270
const PAGE_H = 2.25 * 72; // 162
const pdfPath = join(printDir, "boriwala-business-card-print.pdf");
const doc = new PDFDocument({ size: [PAGE_W, PAGE_H], margin: 0, autoFirstPage: false });
doc.pipe(createWriteStream(pdfPath));

for (const { png } of sides) {
  doc.addPage({ size: [PAGE_W, PAGE_H], margin: 0 });
  doc.image(join(printDir, png), 0, 0, { width: PAGE_W, height: PAGE_H });
}
doc.end();

console.log(`\nBuilt ${pdfPath}`);
console.log("PDF: 3.75in x 2.25in per page (3.5x2 trim + 0.125in bleed).");
