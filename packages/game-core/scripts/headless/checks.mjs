/* @layer tooling-scripts @kind logic */
import { hex } from './ram.mjs';

const ROSTER = 0x7e2980;
const ROSTER_SLOTS = 7;
const MASK = 0x7e29af;
const EMPTY_SLOT = 0x80;
const GOLD = 0x7e2c53;
const HARD_GOLD = 10000;

const check = (name, ok, detail) => ({ name, ok, detail });

const rosterCheck = (ram, ids) => {
  const want = Array.from({ length: ROSTER_SLOTS }, (_, i) => ids[i] ?? EMPTY_SLOT);
  const got = ram.bytes(ROSTER, ROSTER_SLOTS);
  return check('roster 7E2980..86', want.every((v, i) => v === got[i]), `want ${want.map((v) => hex(v)).join(' ')} got ${got.map((v) => hex(v)).join(' ')}`);
};

const maskCheck = (ram, ids) => {
  const want = ids.reduce((bits, id) => bits | (0x80 >> id), 0);
  return check('joined mask 7E29AF', ram.byte(MASK) === want, `want ${hex(want)} got ${hex(ram.byte(MASK))}`);
};

const flagChecks = (ram, flags) => flags.map((flag) => {
  const got = ram.byte(flag.at);
  return check(`start flag ${hex(flag.at, 6)} bits ${hex(flag.bits)}`, (got & flag.bits) === flag.bits, `got ${hex(got)}`);
});

const goldCheck = (ram, hard, granted) => {
  const gold = ram.byte(GOLD) | (ram.byte(GOLD + 1) << 8) | (ram.byte(GOLD + 2) << 16);
  if (!hard) return check('gold (not hard, informational)', true, `${gold}`);
  return check('gold hard grant', granted && gold === HARD_GOLD, `want ${HARD_GOLD} got ${gold} granted ${granted}`);
};

const notBlackCheck = (luma) => check('not black', luma > 5, `luma ${luma.toFixed(2)}`);

export { check, flagChecks, goldCheck, maskCheck, notBlackCheck, rosterCheck };
