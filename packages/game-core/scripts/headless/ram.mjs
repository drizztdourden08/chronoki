/* @layer tooling-scripts @kind logic */
const WRAM_BASE = 0x7e0000;

const ramReader = (core) => {
  const byte = (address) => core.HEAPU8[core._CkWramPtr() + address - WRAM_BASE];
  const word = (address) => byte(address) | (byte(address + 1) << 8);
  const write = (address, value) => { core.HEAPU8[core._CkWramPtr() + address - WRAM_BASE] = value; };
  const bytes = (address, count) => Array.from({ length: count }, (_, i) => byte(address + i));
  return { byte, word, bytes, write };
};

const hex = (value, width = 2) => `0x${value.toString(16).toUpperCase().padStart(width, '0')}`;

export { hex, ramReader };
