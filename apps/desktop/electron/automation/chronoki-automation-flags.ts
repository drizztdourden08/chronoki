/* @layer electron-main @kind logic */
import { createAutomationFlags } from '@drizztdourden08/brock-core';
import { CHRONOKI_AUTOMATION_FLAGS } from './automation-flags.constants';

const chronokiAutomationFlags = createAutomationFlags(CHRONOKI_AUTOMATION_FLAGS);

export { chronokiAutomationFlags };
