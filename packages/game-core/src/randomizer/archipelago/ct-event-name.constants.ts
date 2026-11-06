/* @layer bridge-wasm @kind constants */
const CT_EVENT_NAME_PREFIX = 'Event - ';

const CT_EVENT_NAMES: Readonly<Record<string, string>> = {
  'ck-goal': 'Goal reached',
  'beat-lavos': 'Beat Lavos',
  'beat-ozzie': 'Beat Ozzie',
  'cyrus-done': 'Cyrus avenged',
  'beat-giga-gaia': 'Beat Giga Gaia',
  'kings-trial-done': "King's Trial done",
  masamune: 'Masamune forged',
  magus: 'Magus recruited',
};

export { CT_EVENT_NAME_PREFIX, CT_EVENT_NAMES };
