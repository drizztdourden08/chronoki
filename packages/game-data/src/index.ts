/* @layer shared-placeholder @kind barrel */
import type { PackagePlaceholder } from './placeholder.type';

const PLACEHOLDER: PackagePlaceholder = { name: '@chronoki/game-data', ready: false };

export * from './msu';
export { PLACEHOLDER };
export type { PackagePlaceholder };
