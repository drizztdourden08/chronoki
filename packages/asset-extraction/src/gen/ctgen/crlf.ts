/* @layer shared-asset-extraction @kind logic */
const crlf = (text: string): string => text.replaceAll('\n', '\r\n');

export { crlf };
