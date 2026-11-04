const fs = require('fs');
const zlib = require('zlib');

function writePNG(filePath, width, height, rawData) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const compressed = zlib.deflateSync(rawData);

  function createChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const crcBuf = Buffer.alloc(4);
    const crcInput = Buffer.concat([typeBuf, data]);
    const crc = zlib.crc32(crcInput);
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const pngBuffer = Buffer.concat([
    signature,
    createChunk('IHDR', ihdr),
    createChunk('IDAT', compressed),
    createChunk('IEND', Buffer.alloc(0))
  ]);
  fs.writeFileSync(filePath, pngBuffer);
  console.log(`Generated PNG: ${filePath} (${width}x${height})`);
}

function generatePackIcon(filePath) {
  const width = 256;
  const height = 256;
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const idx = rowOffset + 1 + x * 4;
      const cx = x - 128;
      const cy = y - 128;
      const dist = Math.sqrt(cx * cx + cy * cy);

      let r = 0x18, g = 0x08, b = 0x28, a = 0xff;

      if (x >= 48 && x <= 208 && y >= 40 && y <= 216) {
        r = 0x5c; g = 0x1d; b = 0x61;
        if (x >= 48 && x <= 64) {
          r = 0x2c; g = 0x0c; b = 0x33;
        }
        if (x >= 196 && x <= 208) {
          r = 0xf0; g = 0xeb; b = 0xd8;
        }
        if ((x >= 52 && x <= 72 && (y <= 56 || y >= 200)) ||
            (x >= 184 && x <= 204 && (y <= 56 || y >= 200)) ||
            (Math.abs(x - 128) < 12 && Math.abs(y - 128) < 12)) {
          r = 0xff; g = 0xd7; b = 0x00;
        }
        if ((x + y) % 32 < 6 && (x * y) % 7 === 0) {
          r = 0x00; g = 0xff; b = 0xff;
        }
      } else if (dist < 110) {
        const f = 1 - (dist / 110);
        r = Math.floor(0x18 + (0x4a - 0x18) * f);
        g = Math.floor(0x08 + (0x15 - 0x08) * f);
        b = Math.floor(0x28 + (0x60 - 0x28) * f);
      }

      rawData[idx] = r;
      rawData[idx + 1] = g;
      rawData[idx + 2] = b;
      rawData[idx + 3] = a;
    }
  }

  writePNG(filePath, width, height, rawData);
}

function generateBookTexture(filePath) {
  const size = 16;
  const rowSize = size * 4 + 1;
  const rawData = Buffer.alloc(rowSize * size);

  const pixels = new Uint8Array(size * size * 4);

  const set = (x, y, r, g, b, a = 255) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    pixels[i] = r; pixels[i + 1] = g; pixels[i + 2] = b; pixels[i + 3] = a;
  };

  const rect = (x0, y0, x1, y1, r, g, b, a = 255) => {
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) set(x, y, r, g, b, a);
    }
  };

  // Dark outline / spine
  rect(2, 1, 13, 14, 43, 15, 58);
  // Purple cover
  rect(3, 2, 12, 13, 107, 45, 145);
  // Darker spine on the left
  rect(3, 2, 4, 13, 61, 20, 82);
  // Paper page edge on the right
  rect(12, 2, 12, 13, 247, 241, 217);
  // Gold trim (top & bottom)
  rect(5, 2, 11, 2, 242, 201, 76);
  rect(5, 13, 11, 13, 242, 201, 76);
  // Inner parchment
  rect(5, 3, 11, 12, 247, 241, 217);
  // Gold frame around the parchment
  rect(5, 3, 11, 3, 242, 201, 76);
  rect(5, 12, 11, 12, 242, 201, 76);
  // Glowing magical runes (cyan / magenta)
  set(8, 5, 95, 251, 241);
  set(7, 6, 95, 251, 241);
  set(9, 6, 95, 251, 241);
  set(8, 7, 255, 215, 0);
  set(6, 8, 224, 95, 255);
  set(10, 8, 224, 95, 255);
  set(8, 9, 95, 251, 241);
  set(7, 10, 95, 251, 241);
  set(9, 10, 95, 251, 241);
  // Gold center emblem
  set(8, 8, 255, 215, 0);
  // Sparkles on the cover
  set(5, 5, 95, 251, 241);
  set(11, 11, 224, 95, 255);
  set(11, 5, 95, 251, 241);
  set(5, 11, 224, 95, 255);

  for (let y = 0; y < size; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0;
    for (let x = 0; x < size; x++) {
      const src = (y * size + x) * 4;
      const dst = rowOffset + 1 + x * 4;
      rawData[dst] = pixels[src];
      rawData[dst + 1] = pixels[src + 1];
      rawData[dst + 2] = pixels[src + 2];
      rawData[dst + 3] = pixels[src + 3];
    }
  }

  writePNG(filePath, size, size, rawData);
}

generatePackIcon('behavior_pack/pack_icon.png');
generatePackIcon('resource_pack/pack_icon.png');
generateBookTexture('resource_pack/textures/items/divine_book.png');
