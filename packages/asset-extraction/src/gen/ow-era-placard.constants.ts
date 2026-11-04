/* @layer shared-asset-extraction @kind constants */
const SOURCES: [string, number, number | null][] = [
  ['saves/ow_w0.state', 0x75, null],
  ['saves/com_jogo_salvo.state', 0x76, null],
  ['saves/ow_w3.live', 0x78, 3],
  ['saves/ow_w4.live', 0x79, 4],
  ['saves/ow_w7.live', 0x7a, 7],
  ['saves/ow_w1.live', 0x7b, 1],
];
const PLACARD_Y = 192;
const ROW0 = PLACARD_Y + 8;

export { SOURCES, PLACARD_Y, ROW0 };
