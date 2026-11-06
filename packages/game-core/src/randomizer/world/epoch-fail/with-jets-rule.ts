/* @layer bridge-wasm @kind logic */
import { CT_KIT } from '../ct-kit.constants';
import type { CtRule } from '../ct-region-spec.type';

const { all, has, option, when } = CT_KIT;

const jetsRule = (): CtRule => when(option('epochFail', true), has('jets-of-time'), all());

const withJetsRule = (rule: CtRule | undefined): CtRule =>
  (rule === undefined ? jetsRule() : all(jetsRule(), rule));

export { withJetsRule };
