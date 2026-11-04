/* @layer shared-asset-extraction @kind logic @source Python maps.parse_props */
const parseProps = (data: Uint8Array, off: number, n: number): [boolean[], boolean[]] => {
  const l1: boolean[] = [];
  const l2: boolean[] = [];
  let i = off;
  while (l1.length < n && i + 2 < data.length) {
    const b0 = data[i]!;
    i += 3;
    const a1 = (b0 & 1) !== 0;
    const a2 = (b0 & 2) !== 0;
    let rep = 1;
    if ((b0 & 0x80) !== 0) {
      rep = i < data.length ? data[i]! : 0;
      i += 1;
      rep = rep || 256;
    }
    for (let k = 0; k < rep; k += 1) {
      l1.push(a1);
      l2.push(a2);
    }
  }
  while (l1.length < n) {
    l1.push(false);
    l2.push(false);
  }
  return [l1, l2];
};

export { parseProps };
