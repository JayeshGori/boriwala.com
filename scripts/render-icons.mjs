import sharp from "sharp";
import pngToIco from "png-to-ico";
import { writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = join(__dirname, "..", "src", "app");
const iconSvg = join(appDir, "icon.svg");

const render = (size) =>
  sharp(iconSvg, { density: 384 }).resize(size, size).png().toBuffer();

// Apple touch icon (180x180) and standard icon (512) for PWA/links
await writeFile(join(appDir, "apple-icon.png"), await render(180));
await writeFile(join(appDir, "icon.png"), await render(512));
console.log("Wrote apple-icon.png (180) and icon.png (512)");

// favicon.ico (multi-resolution: 16, 32, 48)
const icoBuffers = await Promise.all([16, 32, 48].map(render));
const ico = await pngToIco(icoBuffers);
await writeFile(join(appDir, "favicon.ico"), ico);
console.log("Wrote favicon.ico (16/32/48)");
