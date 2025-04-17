import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sizes = [16, 48, 128];
const inputPath = path.join(__dirname, "../src/assets/icon.svg");
const outputDir = path.join(__dirname, "../src/assets");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate icons for each size
for (const size of sizes) {
  try {
    await sharp(inputPath)
      .resize(size, size)
      .toFile(path.join(outputDir, `icon${size}.png`));
    console.log(`Generated icon${size}.png`);
  } catch (err) {
    console.error(`Error generating icon${size}.png:`, err);
  }
}
