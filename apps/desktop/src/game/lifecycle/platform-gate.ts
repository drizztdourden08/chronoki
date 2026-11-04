/* @layer bridge-wasm @kind logic */
import { Capacitor } from '@capacitor/core';

const isNativeMobile = (): boolean => Capacitor.isNativePlatform();

const isAndroidWebView = (): boolean => isNativeMobile() && Capacitor.getPlatform() === 'android';

const canRunGameCore = (): boolean => !isAndroidWebView();

export { canRunGameCore, isNativeMobile };
