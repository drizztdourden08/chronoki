/* @layer bridge-wasm @kind logic */
import type { LocalDelivery } from './local-delivery.type';

const isLocalDelivery = (action: unknown): action is LocalDelivery =>
  typeof action === 'object' && action !== null && 'apply' in action && typeof action.apply === 'function';

export { isLocalDelivery };
