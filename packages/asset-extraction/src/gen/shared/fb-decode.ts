/* @layer shared-asset-extraction @kind logic */
const cgramOf = (oam: Uint8Array): Uint8Array => oam.slice(1056, 1056 + 512);

export { cgramOf };
