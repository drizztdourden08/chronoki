/* @layer renderer-lib @kind logic */
import { ASSETS_DIR } from '@app/profiles/storage';
import { PENDULUM_FILE_SUFFIX } from './title-pendulum.constants';

const pendulumFile = (romFile: string): string => `${ASSETS_DIR}/${romFile}${PENDULUM_FILE_SUFFIX}`;

export { pendulumFile };
