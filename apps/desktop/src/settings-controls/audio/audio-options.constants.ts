/* @layer renderer-app @kind constants */
const CONFIG_MODE_OPTIONS = [
  { value: 'auto', label: 'Auto', hint: 'Reads the assigned pack and sets the format for you.' },
  { value: 'manual', label: 'Manual', hint: 'Lets you set the format by hand.' },
];

const PACK_FORMAT_OPTIONS = [
  { value: 'false', label: 'Off' },
  { value: 'msu1', label: 'MSU-1' },
  { value: 'opuz', label: 'OPUZ' },
  { value: 'layered', label: 'Layered' },
];

export { CONFIG_MODE_OPTIONS, PACK_FORMAT_OPTIONS };
