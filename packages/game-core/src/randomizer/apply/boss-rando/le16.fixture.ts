/* @layer bridge-wasm @kind fixture */
const le16 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff];

export { le16 };
