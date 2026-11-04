/* @layer shared-asset-extraction @kind logic */
const mashScript = (F: number, aOn = 16, aOff = 16): string => {
  const seq: string[] = [];
  let n = 0;
  while (n < F) {
    const on = Math.min(aOn, F - n);
    if (on > 0) {
      seq.push(`100:${on}`);
      n += on;
    }
    if (n >= F) break;
    const off = Math.min(aOff, F - n);
    if (off > 0) {
      seq.push(`0:${off}`);
      n += off;
    }
  }
  return seq.length ? seq.join(',') : `0:${F}`;
};

export { mashScript };
