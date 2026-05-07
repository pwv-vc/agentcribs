export interface TarEntry {
  name: string;
  data: Uint8Array;
}

const BLOCK = 512;
const encoder = new TextEncoder();

function padBlock(data: Uint8Array): Uint8Array {
  const remainder = data.length % BLOCK;
  if (remainder === 0) return data;
  const padded = new Uint8Array(data.length + (BLOCK - remainder));
  padded.set(data);
  return padded;
}

function octal(n: number, len: number): string {
  return n.toString(8).padStart(len, "0").slice(0, len);
}

function checksum(header: Uint8Array): number {
  let sum = 0;
  for (let i = 0; i < BLOCK; i++) {
    sum += i >= 148 && i < 156 ? 32 : header[i];
  }
  return sum;
}

function tarHeader(filename: string, size: number): Uint8Array {
  const header = new Uint8Array(BLOCK);
  const name = encoder.encode(filename);
  header.set(name.slice(0, 100), 0);

  const mode = encoder.encode(octal(0o644, 7));
  header.set(mode, 100);

  const uid = encoder.encode(octal(0, 7));
  header.set(uid, 108);

  const gid = encoder.encode(octal(0, 7));
  header.set(gid, 116);

  const sz = encoder.encode(octal(size, 11));
  header.set(sz, 124);

  const now = Math.floor(Date.now() / 1_000);
  const mtime = encoder.encode(octal(now, 11));
  header.set(mtime, 136);

  header[156] = 48;

  const magic = encoder.encode("ustar\u000000");
  header.set(magic, 257);

  const owner = encoder.encode("admin");
  header.set(owner.slice(0, 32), 265);

  const group = encoder.encode("admin");
  header.set(group.slice(0, 32), 297);

  const csum = checksum(header);
  const csumStr = encoder.encode(octal(csum, 6) + "\u0000 ");
  header.set(csumStr, 148);

  return header;
}

export function createTar(entries: TarEntry[]): Uint8Array {
  const parts: Uint8Array[] = [];

  for (const entry of entries) {
    const header = tarHeader(entry.name, entry.data.length);
    parts.push(header);
    parts.push(padBlock(entry.data));
  }

  const eof = new Uint8Array(BLOCK * 2);
  parts.push(eof);

  const totalLen = parts.reduce((sum, p) => sum + p.length, 0);
  const result = new Uint8Array(totalLen);
  let offset = 0;
  for (const p of parts) {
    result.set(p, offset);
    offset += p.length;
  }
  return result;
}
