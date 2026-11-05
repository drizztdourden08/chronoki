/* @layer renderer-components @kind component */
import { OptionTabBody } from '@drizztdourden08/brock-randomizer/renderer';
import type { OptionTabBodyProps } from '@drizztdourden08/brock-randomizer/renderer';
import { useCtPoolImpacts } from './useCtPoolImpacts';

const CtImpactTabBody = (props: OptionTabBodyProps) => {
  const { cellOf } = useCtPoolImpacts(props.values, props.seed, props.romFile);

  return <OptionTabBody {...props} cellOf={cellOf} />;
};

export { CtImpactTabBody };
