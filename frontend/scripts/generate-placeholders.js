/**
 * Generate placeholder PNG icons and cup images for the PWA.
 * Pure Node.js — no external dependencies required.
 *
 * Run: node scripts/generate-placeholders.js
 */

const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// ==================== MINIMAL PNG GENERATOR ====================

function crc32(buf) {
  let crc = 0xffffffff;
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createSolidPNG(width, height, r, g, b, a = 255) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // IDAT (image data)
  // Each row: filter byte (0) + RGBA pixels
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // filter: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // IEND
  const iend = Buffer.alloc(0);

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', iend),
  ]);
}

// ==================== ICON COLORS ====================
// Blue primary color icons with a cup emoji pattern
const ICONS = [
  { file: 'icon-192.png', size: 192, r: 37, g: 99, b: 235 },
  { file: 'icon-512.png', size: 512, r: 37, g: 99, b: 235 },
];

// ==================== CUP COLORS ====================
const CUPS = [
  { file: 'cup1.png', r: 232, g: 232, b: 232 },   // Simple White
  { file: 'cup2.png', r: 45, g: 55, b: 72 },       // Ink Wash
  { file: 'cup3.png', r: 251, g: 182, b: 206 },    // Cherry Pink
  { file: 'cup4.png', r: 26, g: 54, b: 93 },       // Star Blue
  { file: 'cup5.png', r: 39, g: 103, b: 73 },       // Bamboo Green
];

// QR placeholder colors
const QR = [
  { file: 'alipay.png', r: 22, g: 119, b: 255 },   // Alipay blue
  { file: 'wechat.png', r: 7, g: 193, b: 96 },     // WeChat green
];

// ==================== GENERATE ====================
const frontendDir = path.resolve(__dirname, '..');

// Icons
const iconsDir = path.join(frontendDir, 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

ICONS.forEach(({ file, size, r, g, b }) => {
  const png = createSolidPNG(size, size, r, g, b);
  fs.writeFileSync(path.join(iconsDir, file), png);
  console.log(`✓ Generated icons/${file} (${size}x${size})`);
});

// Cups
const cupsDir = path.join(frontendDir, 'cups');
if (!fs.existsSync(cupsDir)) fs.mkdirSync(cupsDir, { recursive: true });

CUPS.forEach(({ file, r, g, b }) => {
  const png = createSolidPNG(200, 200, r, g, b);
  fs.writeFileSync(path.join(cupsDir, file), png);
  console.log(`✓ Generated cups/${file}`);
});

// QR placeholders
const qrDir = path.join(frontendDir, 'qr');
if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });

QR.forEach(({ file, r, g, b }) => {
  const png = createSolidPNG(300, 300, r, g, b);
  fs.writeFileSync(path.join(qrDir, file), png);
  console.log(`✓ Generated qr/${file}`);
});

console.log('\n✅ All placeholder images generated!');
console.log('📝 Place real cup images in cups/ and real QR codes in qr/');
