/* @layer shared-asset-extraction @kind logic */
const FNV_OFFSET = 0xcbf29ce484222325n;
const FNV_PRIME = 0x100000001b3n;
const encoder = new TextEncoder();

/** FNV-1a 64 over the UTF-8 of a layout string (pack_tables.py fnv64). */
const fnv64 = (text: string): bigint => {
  let h = FNV_OFFSET;
  for (const c of encoder.encode(text)) h = BigInt.asUintN(64, (h ^ BigInt(c)) * FNV_PRIME);
  return h;
};

export { fnv64 };
