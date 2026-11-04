/* @layer bridge-wasm @kind logic */
import { Capacitor } from '@capacitor/core';
import { isNativeMobile } from './is-native-mobile';

const isAndroidWebView = (): boolean => isNativeMobile() && Capacitor.getPlatform() === 'android';

const canRunGameCore = (): boolean => !isAndroidWebView();

export { canRunGameCore };
