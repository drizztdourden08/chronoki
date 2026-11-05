/* @layer bridge-wasm @kind constants @source Belthasar battle.c (CC/213F attack records, CC/1BEB tech controls, battleComputeTechDamage) */
const TECH_DAMAGE_STREAM = ':tech-damage';
const ATTACK_RECORD_ROM = 0x0c213f;
const ATTACK_RECORD_BYTES = 12;
const ATTACK_TYPE_AT = 5;
const ATTACK_POWER_AT = 9;
const DAMAGE_TYPES: ReadonlySet<number> = new Set([1, 3, 5, 6]);
const LAST_CONTROLLED_TECH_ID = 0x74;
const CONTROL_FIRST_EFFECT_AT = 5;
const CONTROL_EFFECT_COUNT = 3;

export {
  ATTACK_POWER_AT, ATTACK_RECORD_BYTES, ATTACK_RECORD_ROM, ATTACK_TYPE_AT, CONTROL_EFFECT_COUNT, CONTROL_FIRST_EFFECT_AT,
  DAMAGE_TYPES, LAST_CONTROLLED_TECH_ID, TECH_DAMAGE_STREAM,
};
