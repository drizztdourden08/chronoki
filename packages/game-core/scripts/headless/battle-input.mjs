/* @layer tooling-scripts @kind logic */
const PAD_A = 256;
const PAD_UP = 16;
const PAD_DOWN = 32;
const PRESS_EVERY = 8;
const PRESS_HELD = 3;
const ROW_ATTACK = 0;
const ROW_TECH = 1;
const FIRST_PC_ACTION = 0x75;

const cursorKey = (cursor, want) => (cursor < want ? PAD_DOWN : PAD_UP);

const createBattlePad = (wantTech) => {
  const techDone = [false, false, false];
  const inTech = [false, false, false];
  const casts = [];
  const wantedRow = (seat) => (wantTech(seat) && !techDone[seat] ? ROW_TECH : ROW_ATTACK);
  const observe = (ram, frame) => {
    const action = ram.byte(0x7eb18c), seat = ram.byte(0x7eb3f4);
    if (action === 0 || action >= FIRST_PC_ACTION || seat > 2 || techDone[seat]) return;
    techDone[seat] = true;
    inTech[seat] = false;
    casts.push({ frame, seat, tech: action });
  };
  const input = (ram, frame) => {
    if (frame % PRESS_EVERY >= PRESS_HELD) return 0;
    const seat = ram.byte(0x7e95d5);
    if (seat > 2) return PAD_A;
    const want = wantedRow(seat);
    const atCommand = ram.byte(0x7e9609) === 0 && !inTech[seat];
    if (atCommand && ram.byte(0x7e95dc + seat) !== want) return cursorKey(ram.byte(0x7e95dc + seat), want);
    if (atCommand && want === ROW_TECH) inTech[seat] = true;
    return PAD_A;
  };
  return { observe, input, casts };
};

export { createBattlePad };
