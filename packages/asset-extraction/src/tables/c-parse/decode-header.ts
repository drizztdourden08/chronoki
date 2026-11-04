/* @layer shared-asset-extraction @kind logic */

const decodeHeader = (bytes: Uint8Array): string => {
  let text = '';
  for (let i = 0; i < bytes.length; i += 4096) text += String.fromCharCode(...bytes.subarray(i, i + 4096));
  return text.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
};

export { decodeHeader };
