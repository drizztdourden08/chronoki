/* @layer tooling-scripts @kind logic */
// A reactive battle pad: the queue head's command window ($95D5) gets its cursor ($95DC + seat) moved to Tech (row 1)
// until that seat has confirmed a tech, else to Attack (row 0); A confirms the row, the first list entry and the target.
const PAD_A = 256;
const PAD_UP = 16;
const PAD_DOWN = 32;
const PRESS_EVERY = 8;
const PRESS_HELD = 3;
const ROW_ATTACK = 0;
const ROW_TECH = 1;
const FIRST_PC_ACTION = 0x75;

const createBattlePad = (wantTech) => {
  const techDone = [false, false, false];
  const inTech = [false, false, false];
  const casts = [];
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
    const want = wantTech(seat) && !techDone[seat] ? ROW_TECH : ROW_ATTACK;
    const cursor = ram.byte(0x7e95dc + seat);
    const atCommand = ram.byte(0x7e9609) === 0 && !inTech[seat];
    if (atCommand && cursor !== want) return cursor < want ? PAD_DOWN : PAD_UP;
    if (atCommand && want === ROW_TECH) inTech[seat] = true;
    return PAD_A;
  };
  return { observe, input, casts };
};

export { createBattlePad };
