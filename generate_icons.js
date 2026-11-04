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
      
      // Divine Fantasy gradient: Dark Purple (#20063b) to Gold (#ffd700) with White glow (#ffffff)
      let r = 0x20, g = 0x06, b = 0x3b, a = 0xff;
      
      if (dist < 90) {
        const f = 1 - (dist / 90);
        r = Math.floor(0x20 + (0xd4 - 0x20) * f);
        g = Math.floor(0x06 + (0xaf - 0x06) * f);
        b = Math.floor(0x3b + (0x37 - 0x3b) * f);
      }
      
      if (dist < 35) {
        const f = 1 - (dist / 35);
        r = Math.floor(r + (0xff - r) * f);
        g = Math.floor(g + (0xff - g) * f);
        b = Math.floor(b + (0xff - b) * f);
      }

      // Sword / Cross divine symbol geometry
      if (Math.abs(x - 128) < 8 || Math.abs(y - 128) < 8 || Math.abs(x - y) < 10 || Math.abs(x + y - 256) < 10) {
        r = 0xff; g = 0xf0; b = 0x1f; // Bright Gold/White
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
