/* @layer bridge-wasm @kind logic */
import { CT_KIT } from '../ct-kit.constants';
import type { CtRule } from '../ct-region-spec.type';

const { all, has } = CT_KIT;

const withJetsRule = (rule: CtRule | undefined): CtRule =>
  (rule === undefined ? has('jets-of-time') : all(has('jets-of-time'), rule));

export { withJetsRule };
