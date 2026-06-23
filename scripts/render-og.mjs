import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = join(__dirname, "..", "src", "app");

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1a73e8"/>
      <stop offset="100%" stop-color="#4285f4"/>
    </linearGradient>
    <linearGradient id="topBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f46f25"/>
      <stop offset="100%" stop-color="#ff8c42"/>
    </linearGradient>
    <linearGradient id="bottomBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1a73e8"/>
      <stop offset="100%" stop-color="#4285f4"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect x="0" y="0" width="1200" height="14" fill="url(#topBar)"/>
  <rect x="0" y="616" width="1200" height="14" fill="url(#bottomBar)"/>
  <g text-anchor="middle">
    <text x="600" y="330" font-family="Montserrat, 'Segoe UI', Arial, sans-serif" font-size="120" font-weight="800" letter-spacing="3" fill="url(#textGradient)">BORIWALA<tspan fill="#f46f25">.COM</tspan></text>
    <text x="600" y="400" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="600" letter-spacing="6" fill="#64748b">B2B TRADING &#183; INDUSTRIAL PACKAGING</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg), { density: 144 })
  .png()
  .toFile(join(appDir, "opengraph-image.png"));
console.log("Wrote opengraph-image.png (1200x630)");
