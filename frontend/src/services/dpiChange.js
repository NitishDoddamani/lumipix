const MAX_INPUT_BYTES = 25 * 1024 * 1024;

const SUPPORTED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png"]);

const MAX_DPI = 2400;

const DEFAULT_DPI = 96;

export async function changeDpi(file, targetDpi) {
  validateFile(file);

  const dpi = Number(targetDpi);

  if (!dpi || dpi <= 0) {
    throw new Error("Enter a valid DPI value.");
  }

    if (dpi > MAX_DPI) {
    throw new Error(`DPI cannot exceed ${MAX_DPI}.`);
  }

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const outBytes =
    file.type === "image/png" ? setPngDpi(bytes, dpi) : setJpegDpi(bytes, dpi);

  const outFile = new File([outBytes], file.name, {
    type: file.type,
    lastModified: Date.now(),
  });

  return {
    file: outFile,

    url: URL.createObjectURL(outFile),

    name: outFile.name,

    size: outFile.size,

    originalSize: file.size,

    dpi,

    format: file.type.replace("image/", "").toUpperCase(),
  };
}

export async function readDpi(file) {
  if (!SUPPORTED_TYPES.has(file.type)) return null;

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  return file.type === "image/png" ? readPngDpi(bytes) : readJpegDpi(bytes);
}

function validateFile(file) {
  if (!file) throw new Error("No image selected.");

  if (!SUPPORTED_TYPES.has(file.type)) {
    throw new Error("DPI can only be changed for JPEG and PNG images.");
  }

  if (file.size === 0) throw new Error("Selected image is empty.");

  if (file.size > MAX_INPUT_BYTES) {
    throw new Error(
      `Image is too large to process in-browser (max ${
        MAX_INPUT_BYTES / (1024 * 1024)
      } MB).`
    );
  }
}

/* ======================================================
   JPEG — DPI can live in EITHER (or both) of:
     - the EXIF APP1 segment's IFD0 (XResolution/YResolution)
       -> this is what phone cameras, WhatsApp, and Windows
          Explorer/Photos actually read
     - the JFIF APP0 segment (Xdensity/Ydensity)
       -> older convention, used by some editors/exporters

   We read EXIF first (most real-world photos), fall back to
   JFIF. On write, we patch whichever segment(s) already exist,
   and only insert a fresh JFIF segment if neither is present.
====================================================== */

function readJpegDpi(bytes) {
  const app1 = findJpegApp1Exif(bytes);

  if (app1) {
    const exifDpi = readExifResolution(bytes, app1);
    if (exifDpi) return { dpi: exifDpi, detected: true };
  }

  const app0 = findJpegApp0(bytes);

  if (app0 !== null) {
    const units = bytes[app0 + 11];
    const xDensity = (bytes[app0 + 12] << 8) | bytes[app0 + 13];

    // units 1 = pixels/inch, units 2 = pixels/cm — both are real
    // resolution data. units 0 means "aspect ratio only, no real
    // resolution" and is almost always paired with a 1:1 placeholder,
    // not an actual DPI — so it's deliberately not trusted here.
    if (units === 1 && xDensity > 0) {
      return { dpi: xDensity, detected: true };
    }

    if (units === 2 && xDensity > 0) {
      return { dpi: Math.round(xDensity * 2.54), detected: true };
    }
  }

  return { dpi: DEFAULT_DPI, detected: false };
}

function setJpegDpi(bytes, dpi) {
  let out = bytes;

  const app1 = findJpegApp1Exif(out);

  let wroteExif = false;

  if (app1) {
    const result = setExifResolution(out, app1, dpi);
    out = result.bytes;
    wroteExif = result.wrote;
  }

  const app0 = findJpegApp0(out);

  if (app0 !== null) {
    out = out.slice();

    out[app0 + 11] = 1;
    out[app0 + 12] = (dpi >> 8) & 0xff;
    out[app0 + 13] = dpi & 0xff;
    out[app0 + 14] = (dpi >> 8) & 0xff;
    out[app0 + 15] = dpi & 0xff;
  } else if (!wroteExif) {
    // Neither a usable EXIF resolution tag nor a JFIF segment —
    // insert a fresh JFIF segment so the DPI actually lands somewhere.
    const segment = buildJfifApp0(dpi);

    const inserted = new Uint8Array(out.length + segment.length);
    inserted.set(out.slice(0, 2), 0);
    inserted.set(segment, 2);
    inserted.set(out.slice(2), 2 + segment.length);

    out = inserted;
  }

  return out;
}

function findJpegApp0(bytes) {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    throw new Error("Not a valid JPEG file.");
  }

  let offset = 2;

  while (offset < bytes.length - 4) {
    if (bytes[offset] !== 0xff) break;

    const marker = bytes[offset + 1];

    if (marker === 0xda) break; // start of scan data — stop searching

    if (marker === 0xe0) {
      const isJfif =
        bytes[offset + 4] === 0x4a && // J
        bytes[offset + 5] === 0x46 && // F
        bytes[offset + 6] === 0x49 && // I
        bytes[offset + 7] === 0x46; // F

      if (isJfif) return offset;
    }

    const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
    offset += 2 + length;
  }

  return null;
}

function buildJfifApp0(dpi) {
  const segment = new Uint8Array(18);

  segment.set([0xff, 0xe0], 0); // APP0 marker
  segment.set([0x00, 0x10], 2); // segment length = 16
  segment.set([0x4a, 0x46, 0x49, 0x46, 0x00], 4); // "JFIF\0"
  segment.set([0x01, 0x02], 9); // version 1.2
  segment[11] = 1; // units = pixels per inch
  segment[12] = (dpi >> 8) & 0xff;
  segment[13] = dpi & 0xff;
  segment[14] = (dpi >> 8) & 0xff;
  segment[15] = dpi & 0xff;
  segment[16] = 0; // thumbnail width
  segment[17] = 0; // thumbnail height

  return segment;
}

/* ---------- EXIF (APP1) — TIFF/IFD0 resolution tags ---------- */

function findJpegApp1Exif(bytes) {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    throw new Error("Not a valid JPEG file.");
  }

  let offset = 2;

  while (offset < bytes.length - 4) {
    if (bytes[offset] !== 0xff) break;

    const marker = bytes[offset + 1];

    if (marker === 0xda) break; // start of scan data — stop searching

    if (marker === 0xe1) {
      const isExif =
        bytes[offset + 4] === 0x45 && // E
        bytes[offset + 5] === 0x78 && // x
        bytes[offset + 6] === 0x69 && // i
        bytes[offset + 7] === 0x66 && // f
        bytes[offset + 8] === 0x00 &&
        bytes[offset + 9] === 0x00;

      // TIFF header starts right after the 6-byte "Exif\0\0" identifier.
      if (isExif) return { offset, tiffStart: offset + 10 };
    }

    const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
    offset += 2 + length;
  }

  return null;
}

function readExifResolution(bytes, app1) {
  const { tiffStart } = app1;

  const little = bytes[tiffStart] === 0x49 && bytes[tiffStart + 1] === 0x49; // "II"

  const view = new DataView(bytes.buffer, bytes.byteOffset);

  const ifd0Offset = view.getUint32(tiffStart + 4, little);
  const ifd0Start = tiffStart + ifd0Offset;

  const entryCount = view.getUint16(ifd0Start, little);

  let xRes = null;
  let resUnit = 2; // default: inches

  for (let i = 0; i < entryCount; i++) {
    const entryOffset = ifd0Start + 2 + i * 12;

    const tag = view.getUint16(entryOffset, little);
    const type = view.getUint16(entryOffset + 2, little);
    const valueOffset = entryOffset + 8;

    if (tag === 0x011a && type === 5) {
      // XResolution — RATIONAL (numerator/denominator), stored at an offset.
      const dataPtr = tiffStart + view.getUint32(valueOffset, little);
      const num = view.getUint32(dataPtr, little);
      const den = view.getUint32(dataPtr + 4, little);
      xRes = den !== 0 ? num / den : null;
    }

    if (tag === 0x0128 && type === 3) {
      // ResolutionUnit — SHORT, stored inline (1 = none, 2 = inches, 3 = cm).
      resUnit = view.getUint16(valueOffset, little);
    }
  }

  if (xRes === null) return null;
  if (resUnit === 3) return Math.round(xRes * 2.54); // cm -> inch

  return Math.round(xRes);
}

function setExifResolution(bytes, app1, dpi) {
  const out = bytes.slice();
  const { tiffStart } = app1;

  const little = out[tiffStart] === 0x49 && out[tiffStart + 1] === 0x49;

  const view = new DataView(out.buffer, out.byteOffset);

  const ifd0Offset = view.getUint32(tiffStart + 4, little);
  const ifd0Start = tiffStart + ifd0Offset;

  const entryCount = view.getUint16(ifd0Start, little);

  let wrote = false;

  for (let i = 0; i < entryCount; i++) {
    const entryOffset = ifd0Start + 2 + i * 12;

    const tag = view.getUint16(entryOffset, little);
    const type = view.getUint16(entryOffset + 2, little);
    const valueOffset = entryOffset + 8;

    if ((tag === 0x011a || tag === 0x011b) && type === 5) {
      const dataPtr = tiffStart + view.getUint32(valueOffset, little);
      view.setUint32(dataPtr, dpi, little);
      view.setUint32(dataPtr + 4, 1, little);

      wrote = true;
    }

    if (tag === 0x0128 && type === 3) {
      view.setUint16(valueOffset, 2, little);
    }
  }

  return { bytes: out, wrote };
}

/* ======================================================
   PNG — DPI lives in the pHYs chunk (pixels per meter)
====================================================== */

function readPngDpi(bytes) {
  const phys = findPngChunk(bytes, "pHYs");

  if (!phys) return { dpi: DEFAULT_DPI, detected: false };

  const view = new DataView(bytes.buffer, bytes.byteOffset + phys.dataOffset, 9);
  const ppuX = view.getUint32(0);
  const unit = view.getUint8(8);

  if (unit !== 1) return { dpi: DEFAULT_DPI, detected: false };

  return { dpi: Math.round(ppuX * 0.0254), detected: true };
}

function setPngDpi(bytes, dpi) {
  const ppu = Math.round(dpi / 0.0254); // pixels per meter

  const data = new Uint8Array(9);
  const view = new DataView(data.buffer);

  view.setUint32(0, ppu);
  view.setUint32(4, ppu);
  data[8] = 1; // unit specifier: 1 = meters

  const existing = findPngChunk(bytes, "pHYs");

  if (existing) {
    return replacePngChunkData(bytes, existing, data);
  }

  return insertPngChunkAfterIHDR(bytes, "pHYs", data);
}

function findPngChunk(bytes, type) {
  const isPng =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a;

  if (!isPng) throw new Error("Not a valid PNG file.");

  let offset = 8;

  while (offset < bytes.length) {
    const length =
      (bytes[offset] << 24) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3];

    const chunkType = String.fromCharCode(
      bytes[offset + 4],
      bytes[offset + 5],
      bytes[offset + 6],
      bytes[offset + 7]
    );

    if (chunkType === type) {
      return { offset, length, dataOffset: offset + 8 };
    }

    // pHYs must appear before IDAT — no point scanning past it.
    if (chunkType === "IDAT" || chunkType === "IEND") break;

    offset += 12 + length; // length(4) + type(4) + data + crc(4)
  }

  return null;
}

function replacePngChunkData(bytes, chunk, newData) {
  const out = bytes.slice();
  out.set(newData, chunk.dataOffset);

  const crc = crc32(out.slice(chunk.offset + 4, chunk.offset + 8 + newData.length));

  const crcOffset = chunk.dataOffset + newData.length;
  out[crcOffset] = (crc >>> 24) & 0xff;
  out[crcOffset + 1] = (crc >>> 16) & 0xff;
  out[crcOffset + 2] = (crc >>> 8) & 0xff;
  out[crcOffset + 3] = crc & 0xff;

  return out;
}

function insertPngChunkAfterIHDR(bytes, type, data) {
  // IHDR is always the very first chunk, right after the 8-byte signature.
  const ihdrLength =
    (bytes[8] << 24) | (bytes[9] << 16) | (bytes[10] << 8) | bytes[11];

  const insertAt = 8 + 12 + ihdrLength; // signature + IHDR (len+type+data+crc)

  const chunk = new Uint8Array(12 + data.length);
  const view = new DataView(chunk.buffer);

  view.setUint32(0, data.length);
  chunk.set(
    [type.charCodeAt(0), type.charCodeAt(1), type.charCodeAt(2), type.charCodeAt(3)],
    4
  );
  chunk.set(data, 8);

  const crc = crc32(chunk.slice(4, 8 + data.length));
  view.setUint32(8 + data.length, crc);

  const out = new Uint8Array(bytes.length + chunk.length);
  out.set(bytes.slice(0, insertAt), 0);
  out.set(chunk, insertAt);
  out.set(bytes.slice(insertAt), insertAt + chunk.length);

  return out;
}

/* ======================================================
   CRC32 — required for valid PNG chunk checksums
====================================================== */

let crcTable = null;

function getCrcTable() {
  if (crcTable) return crcTable;

  crcTable = new Uint32Array(256);

  for (let n = 0; n < 256; n++) {
    let c = n;

    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }

    crcTable[n] = c;
  }

  return crcTable;
}

function crc32(bytes) {
  const table = getCrcTable();
  let crc = 0xffffffff;

  for (let i = 0; i < bytes.length; i++) {
    crc = table[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}