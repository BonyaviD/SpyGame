// Writes assets/img/spy-qrcode.svg: a framed QR code ("Scan me!") shown on the desktop page.
// Usage: `npm run generate-qr` (defaults to the production URL) or `npm run generate-qr -- <url>`.
import { writeFile } from "node:fs/promises";
import QRCode from "qrcode";

const url = process.argv[2] ?? "https://spying.netlify.app/";
const OUT = new URL("../assets/img/spy-qrcode.svg", import.meta.url);

const WIDTH = 1000;
const HEIGHT = 1300;
const FRAME = 40; // frame stroke width
const QR_SIZE = 720;
const QR_TOP = 140;

const { modules } = QRCode.create(url, { errorCorrectionLevel: "M" });
const count = modules.size;
const cell = QR_SIZE / count;
const left = (WIDTH - QR_SIZE) / 2;

// One path for all dark modules keeps the file small.
let path = "";
for (let row = 0; row < count; row++) {
  for (let col = 0; col < count; col++) {
    if (modules.get(row, col)) {
      const x = +(left + col * cell).toFixed(2);
      const y = +(QR_TOP + row * cell).toFixed(2);
      const size = +cell.toFixed(2);
      path += `M${x} ${y}h${size}v${size}h-${size}z`;
    }
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
<rect x="${FRAME / 2}" y="${FRAME / 2}" width="${WIDTH - FRAME}" height="${HEIGHT - FRAME}" rx="24" fill="none" stroke="#000" stroke-width="${FRAME}"/>
<path fill="#000" d="${path}"/>
<text x="50%" y="1080" fill="#000" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="90" font-weight="600">Scan me!</text>
</svg>
`;

await writeFile(OUT, svg);
console.log(`✔ QR code for ${url} (${count}×${count} modules) → assets/img/spy-qrcode.svg`);
