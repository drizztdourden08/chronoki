// $7E:xxxx is WRAM offset xxxx, $7F:xxxx is 0x10000 + xxxx; a full address 0x7Fxxxx maps to offset - 0x7E0000.
const WRAM_BASE = 0x7e0000;

const ramReader = (core) => {
  const byte = (address) => core.HEAPU8[core._CkWramPtr() + address - WRAM_BASE];
  const word = (address) => byte(address) | (byte(address + 1) << 8);
  const bytes = (address, count) => Array.from({ length: count }, (_, i) => byte(address + i));
  return { byte, word, bytes };
};

const hex = (value, width = 2) => `0x${value.toString(16).toUpperCase().padStart(width, '0')}`;

export { hex, ramReader };
