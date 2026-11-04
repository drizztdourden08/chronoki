/* @layer shared-asset-extraction @kind constants */
const BRK = 0x006;
const MARLE_HOME = [164, 63];
const MARLE_KF: [string, number][] = [
  ['MA1_aim', 905],
  ['MA2_raise', 918],
  ['MA3_fire', 930],
  ['MA4_recover', 948],
];
const SPARK_KF: [string, number][] = [
  ['E0_spark', 924],
  ['E1_ring0', 932],
  ['E2_ring1', 934],
  ['E3_ring2', 936],
];
const MASH = Array<string>(42).fill('100:16,0:16').join(',');
const MONITOR_LINE = /^\s*f(\d+)\s+000700=([0-9A-Fa-f]+)\s+000900=([0-9A-Fa-f]+)/;

export { BRK, MARLE_HOME, MARLE_KF, SPARK_KF, MASH, MONITOR_LINE };
