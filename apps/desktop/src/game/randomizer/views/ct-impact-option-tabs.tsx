/* @layer renderer-components @kind logic */
import type { ComponentType } from 'react';
import type { OptionTab, OptionTabProps } from '@drizztdourden08/brock-randomizer';
import { ctOptionTabs } from '../options/ct-option-tabs';
import { CtImpactTabBody } from './CtImpactTabBody';

const impactBodyOf = (tab: OptionTab): ComponentType<OptionTabProps> => {
  const ImpactBody = (props: OptionTabProps) => <CtImpactTabBody tab={tab} {...props} />;
  return ImpactBody;
};

const ctImpactOptionTabs = (): readonly OptionTab[] =>
  ctOptionTabs().map((tab) => (tab.Body === undefined ? { ...tab, Body: impactBodyOf(tab) } : tab));

export { ctImpactOptionTabs };
