/* @layer bridge-wasm @kind logic */
const parseRatio = (text: string): number => {
  const [w, h] = text.split(':').map(Number);
  return w && h && w > 0 && h > 0 ? w / h : 0;
};

export { parseRatio };
