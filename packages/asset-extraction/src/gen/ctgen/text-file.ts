/* @layer shared-asset-extraction @kind logic */
/** Python's open(path, 'w', newline='\r\n') and (on Windows) the default text mode: every "\n" written is "\r\n". */
const crlf = (text: string): string => text.replaceAll('\n', '\r\n');

/** Python's "%02X" and friends: upper-case hex, zero-padded. */
const hx = (value: number, digits: number): string => value.toString(16).toUpperCase().padStart(digits, '0');

/** `values` cut into rows of `per`. */
const chunks = <T>(values: readonly T[], per: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < values.length; i += per) out.push(values.slice(i, i + per));
  return out;
};

/** The error a Python generator's sys.exit(msg) becomes. */
const refuse = (message: string): Error => new Error(message);

export { chunks, crlf, hx, refuse };
