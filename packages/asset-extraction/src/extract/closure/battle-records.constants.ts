/* @layer shared-asset-extraction @kind verbatim @source the ROM table labels of Belthasar's rom_closure_battle.py, written into the table pack */

const CC = 0x0c0000;
const FD = 0x3d0000;
const ENEMY_SCRIPT_POINTERS_LABEL = 'enemy AI pointers ($CC:8B08)';
const ENEMY_SCRIPT_LABEL = 'enemy AI script ';
const ACTION_LENGTHS_LABEL = 'AI action lengths ($FD:BA4A, the op)';
const TARGET_RESOLVERS_LABEL = 'AI target resolvers ($C1:B8BB, 24 words)';

export { CC, FD, ENEMY_SCRIPT_POINTERS_LABEL, ENEMY_SCRIPT_LABEL, ACTION_LENGTHS_LABEL, TARGET_RESOLVERS_LABEL };
