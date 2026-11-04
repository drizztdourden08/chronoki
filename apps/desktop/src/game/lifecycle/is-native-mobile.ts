/* @layer bridge-wasm @kind logic */
import { Capacitor } from '@capacitor/core';

const isNativeMobile = (): boolean => Capacitor.isNativePlatform();

export { isNativeMobile };
