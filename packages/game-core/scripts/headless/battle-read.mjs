/* @layer tooling-scripts @kind logic */
// Battle WRAM readers: seats $AEFF (slots), the battle blocks $5E2D + seat * 0x80 (+0 = kind), the per-seat tech lists
// $94D0 + seat * 0x14 (count $A02A + seat), the character -> seat map $B1BE, the current action $B18C / $B2C8 / $B3F4.
const SEATS = 3;
const LIST_STRIDE = 0x14;
const NONE = 0xff;
const hexList = (values) => values.map((v) => v.toString(16).padStart(2, '0')).join(' ');

const sheetAt = (slot) => 0x7e2600 + slot * 0x50;

const sheetOf = (ram, slot) => {
  const b = sheetAt(slot);
  return {
    slot, kind: ram.byte(b), level: ram.byte(b + 0x12), maxHp: ram.word(b + 5), mp: ram.word(b + 7), maxMp: ram.word(b + 9),
    power: ram.byte(b + 0x0b), xpNext: ram.word(b + 0x2b), tpOwed: ram.word(b + 0x2d),
    techLevel: ram.byte(0x7e2830 + slot), learned: ram.byte(0x7e2837 + slot),
  };
};

const seatOf = (ram, seat) => {
  const count = ram.byte(0x7ea02a + seat);
  return {
    seat, slot: ram.byte(0x7eaeff + seat), kind: ram.byte(0x7e5e2d + seat * 0x80),
    techs: ram.bytes(0x7e94d0 + seat * LIST_STRIDE, count), mp: ram.word(0x7e5e2d + seat * 0x80 + 7),
  };
};

const seatsOf = (ram) => Array.from({ length: SEATS }, (_, seat) => seatOf(ram, seat)).filter((s) => s.slot !== NONE);

const actionOf = (ram) => ({
  seat: ram.byte(0x7eb18e) & 3, action: ram.byte(0x7eb18c), record: ram.byte(0x7eb2c8), commander: ram.byte(0x7eb3f4),
  alive: ram.bytes(0x7eaf02, 3), enemyHp: [0, 1, 2].map((k) => ram.word(0x7e5fad + k * 0x80 + 3)),
});

const sheetText = (s) => `slot${s.slot} kind=${s.kind} lv=${s.level} maxHp=${s.maxHp} mp=${s.mp}/${s.maxMp} pow=${s.power} xpNext=${s.xpNext} tpOwed=${s.tpOwed} techLv=${s.techLevel} learned=${s.learned.toString(16)}`;

const seatText = (s) => `seat${s.seat} slot=${s.slot} kind=${s.kind} mp=${s.mp} techs=[${hexList(s.techs)}]`;

const actionText = (a) => `seat${a.seat} act=${hexList([a.action])} rec=${hexList([a.record])} cmd=${a.commander} alive=[${hexList(a.alive)}] eHp=${a.enemyHp.join('/')}`;

export { actionOf, actionText, hexList, seatsOf, seatText, sheetAt, sheetOf, sheetText };
