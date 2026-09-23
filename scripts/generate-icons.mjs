// Renders the PWA icons and favicon from public/icon.svg with headless Chromium.
// Run after changing the icon: `npm run generate-icons`.
import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const SOURCE = new URL("../public/icon.svg", import.meta.url);
const OUT_DIR = new URL("../public/", import.meta.url);

const PNG_ICONS = [
  ["pwa-64x64.png", 64],
  ["pwa-192x192.png", 192],
  ["pwa-512x512.png", 512],
  // The artwork has a full-bleed background and stays inside the 80% safe zone.
  ["maskable-icon-512x512.png", 512],
  ["apple-touch-icon-180x180.png", 180],
];
const FAVICON_SIZE = 32;

/** Wraps a PNG in a single-image .ico container (PNG-in-ICO is supported everywhere). */
const pngToIco = (png, size) => {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  header.writeUInt8(size, 6); // width
  header.writeUInt8(size, 7); // height
  header.writeUInt8(0, 8); // palette size
  header.writeUInt8(0, 9); // reserved
  header.writeUInt16LE(1, 10); // color planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png.length, 14); // image size
  header.writeUInt32LE(22, 18); // image offset
  return Buffer.concat([header, png]);
};

const svg = await readFile(SOURCE, "utf8");
const browser = await chromium.launch();
const page = await browser.newPage();

const render = (size) =>
  page.evaluate(
    async ({ svg, size }) => {
      const image = new Image();
      image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      canvas.getContext("2d").drawImage(image, 0, 0, size, size);
      return canvas.toDataURL("image/png").split(",")[1];
    },
    { svg, size },
  );

for (const [name, size] of PNG_ICONS) {
  await writeFile(new URL(name, OUT_DIR), Buffer.from(await render(size), "base64"));
  console.log(`✔ ${name}`);
}
const favicon = Buffer.from(await render(FAVICON_SIZE), "base64");
await writeFile(new URL("favicon.ico", OUT_DIR), pngToIco(favicon, FAVICON_SIZE));
console.log("✔ favicon.ico");

await browser.close();
