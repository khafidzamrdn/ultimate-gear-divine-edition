const fs = require('fs');
const zlib = require('zlib');

function generatePNG(filePath) {
  const width = 256;
  const height = 256;
  
  // IHDR data
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type (RGBA)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // filter 0
    for (let x = 0; x < width; x++) {
      const idx = rowOffset + 1 + x * 4;
      
      const cx = x - 128;
      const cy = y - 128;
      const dist = Math.sqrt(cx * cx + cy * cy);

      // Enchanted Book Pack Icon (Deep purple cover, gold spine, glowing cyan/gold runes)
      let r = 0x18, g = 0x08, b = 0x28, a = 0xff; // background dark

      // Book body (rounded rectangle)
      if (x >= 48 && x <= 208 && y >= 40 && y <= 216) {
        // Cover color: Deep Enchanted Purple (#4a154b or #5c1d61)
        r = 0x5c; g = 0x1d; b = 0x61;
        
        // Spine (left side around x = 48-64)
        if (x >= 48 && x <= 64) {
          r = 0x2c; g = 0x0c; b = 0x33;
        }
        
        // Pages edge (right side around x = 196-208)
        if (x >= 196 && x <= 208) {
          r = 0xf0; g = 0xeb; b = 0xd8; // paper color
        }
        
        // Golden Book Corners & Center Emblem
        if ((x >= 52 && x <= 72 && (y <= 56 || y >= 200)) ||
            (x >= 184 && x <= 204 && (y <= 56 || y >= 200)) ||
            (Math.abs(x - 128) < 12 && Math.abs(y - 128) < 12)) {
          r = 0xff; g = 0xd7; b = 0x00; // Gold
        }

        // Magical Glowing Runes / Sparkles (Cyan / Magenta)
        if ((x + y) % 32 < 6 && (x * y) % 7 === 0) {
          r = 0x00; g = 0xff; b = 0xff; // Cyan glow
        }
      } else {
        // Radial background fade
        if (dist < 110) {
          const f = 1 - (dist / 110);
          r = Math.floor(0x18 + (0x4a - 0x18) * f);
          g = Math.floor(0x08 + (0x15 - 0x08) * f);
          b = Math.floor(0x28 + (0x60 - 0x28) * f);
        }
      }

      rawData[idx] = r;
      rawData[idx + 1] = g;
      rawData[idx + 2] = b;
      rawData[idx + 3] = a;
    }
  }

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
  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  const pngBuffer = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(filePath, pngBuffer);
  console.log(`Generated pack icon: ${filePath}`);
}

generatePNG('behavior_pack/pack_icon.png');
generatePNG('resource_pack/pack_icon.png');
