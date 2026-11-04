/* @layer shared-asset-extraction @kind logic */
const crlf = (text: string): string => text.replaceAll('\n', '\r\n');

const hx = (value: number, digits: number): string => value.toString(16).toUpperCase().padStart(digits, '0');

const chunks = <T>(values: readonly T[], per: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < values.length; i += per) out.push(values.slice(i, i + per));
  return out;
};

const refuse = (message: string): Error => new Error(message);

export { chunks, crlf, hx, refuse };
