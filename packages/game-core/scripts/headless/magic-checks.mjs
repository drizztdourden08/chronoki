import { check } from './checks.mjs';
import { hex } from './ram.mjs';

const GATE = 0x7f01e0;
const GATE_VALUE = 0x5f;
const LEVEL_AT = 0x7e2830;
const LEARNED_AT = 0x7e2837;
const LEARNED_BITS = 0xe0;
const SHEET_TP_NEXT = 0x7e262d;
const TP_NEXT = 0x03a0;
const TAUGHT = [0, 1, 2, 4];

const grantedChecks = (ram) => [
  check('magic gate 7F01E0', ram.byte(GATE) === GATE_VALUE, `got ${hex(ram.byte(GATE))}`),
  check('tech levels 7E2830/31/32/34 == 3', TAUGHT.every((id) => ram.byte(LEVEL_AT + id) === 3), TAUGHT.map((id) => hex(ram.byte(LEVEL_AT + id))).join(' ')),
  check('learned bits 7E2837/38/39/3B have 0xE0', TAUGHT.every((id) => (ram.byte(LEARNED_AT + id) & LEARNED_BITS) === LEARNED_BITS), TAUGHT.map((id) => hex(ram.byte(LEARNED_AT + id))).join(' ')),
  check('Crono TP-next word 7E262D', ram.word(SHEET_TP_NEXT) === TP_NEXT, `got ${hex(ram.word(SHEET_TP_NEXT), 4)}`),
];

const vanillaChecks = (ram) => [
  check('magic not granted: gate 7F01E0 != 0x5F', ram.byte(GATE) !== GATE_VALUE, `got ${hex(ram.byte(GATE))}`),
  check('magic not granted: learned 7E2837 lacks 0xE0', (ram.byte(LEARNED_AT) & LEARNED_BITS) !== LEARNED_BITS,
    `7E2830 ${hex(ram.byte(LEVEL_AT))} 7E2837 ${hex(ram.byte(LEARNED_AT))} 7E262D ${hex(ram.word(SHEET_TP_NEXT), 4)}`),
];

const magicChecks = (ram, on) => (on ? grantedChecks(ram) : vanillaChecks(ram));

export { magicChecks };
