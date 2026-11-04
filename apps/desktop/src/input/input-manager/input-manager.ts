/* @layer renderer-lib @kind logic */
import type {
  InputProfile, DetectedDevice, PauseListener, RawInputListener, AllowedDevices, DeviceScopedMap,
  SnesButton, FunctionMapping, FunctionAction,
} from '@chronoki/input-mapping';
import type { ActiveProfileListener, DeviceChangeListener, InputStateListener } from './input-manager.type';
import type { DeviceEntry } from '@drizztdourden08/brock-input';
import { controllerInputStore } from '@drizztdourden08/brock-input/renderer';
import type { ControllerInputState } from '@drizztdourden08/brock-input/renderer';
import { PauseManager, FunctionActionEngine, RawInputDispatcher } from '@chronoki/input-mapping';
import { startInputManager } from './start-input';
import { stopInputManager } from './stop-input';
import { refreshInputDevices } from './refresh-input-devices';
import { rebuildMaps } from './rebuild-maps';
import { guardKeys } from './guard-keys';
import { keyDown } from './key-down';
import { keyUp } from './key-up';
import { pollFrame } from './poll-frame';
import { connectedGamepadKeys } from './connected-gamepad-keys';
import { cycleActiveProfile } from './cycle-active-profile';

class InputManager {
  profileId: string | null = null;
  activeProfile: InputProfile | null = null;
  profiles: InputProfile[] = [];
  allowed: AllowedDevices = { keyboard: false, gamepadKeys: new Set() };
  activeProfileListeners = new Set<ActiveProfileListener>();
  persistActiveProfileId: ((id: string) => void) | null = null;
  keyStates = new Map<string, boolean>();
  allPressedKeys = new Set<string>();
  animFrameId: number | null = null;
  setInputFn: ((mask: number) => void) | null = null;
  running = false;

  keyboardMap = new Map<string, SnesButton>();
  gamepadButtonMap: DeviceScopedMap<number, SnesButton> = new Map();
  gamepadAxisMap: DeviceScopedMap<string, SnesButton> = new Map();

  hidStates = new Map<string, { buttons: boolean[]; axes: number[] }>();
  hidUnsubscribe: (() => void) | null = null;
  hidDisconnectUnsub: (() => void) | null = null;
  controllerDevicesUnsub: (() => void) | null = null;

  devices: DetectedDevice[] = [];
  deviceListeners = new Set<DeviceChangeListener>();
  hidDeviceCache: DeviceEntry[] = [];

  currentHidStates = new Map<string, ControllerInputState>();
  hidStatesDirty = false;
  stateListeners = new Set<InputStateListener>();
  calibrationLoaded = false;
  devicePollId: ReturnType<typeof setInterval> | null = null;

  inputSuppressed = false;

  readonly pauseManager = new PauseManager();
  readonly functionActions = new FunctionActionEngine();
  readonly rawDispatcher = new RawInputDispatcher();

  constructor() {
    this.pauseManager.onPause = (zeroBitmask) => {
      if (zeroBitmask) this.setInputFn?.(0);
    };
    this.functionActions.onPauseToggle = () => this.pauseManager.togglePause();
  }

  guardEmscriptenKeys = (e: KeyboardEvent): void => guardKeys(this, e);
  onKeyDown = (e: KeyboardEvent): void => keyDown(this, e);
  onKeyUp = (e: KeyboardEvent): void => keyUp(this, e);
  pollLoop = (): void => pollFrame(this);

  setInputSuppressed(suppressed: boolean): void {
    this.inputSuppressed = suppressed;
    if (suppressed) {
      this.functionActions.clearHeld();
      for (const key of this.keyStates.keys()) this.keyStates.set(key, false);
      this.setInputFn?.(0);
    }
  }

  isInputSuppressed(): boolean { return this.inputSuppressed; }
  setWasmBridge(fn: ((mask: number) => void) | null): void { this.setInputFn = fn; }

  setProfile(profile: InputProfile): void {
    this.activeProfile = profile;
    rebuildMaps(this);
  }

  getProfile(): InputProfile | null { return this.activeProfile; }
  getProfiles(): InputProfile[] { return this.profiles; }
  setProfiles(profiles: InputProfile[]): void { this.profiles = profiles; }
  setActiveProfilePersist(fn: (id: string) => void): void { this.persistActiveProfileId = fn; }

  onActiveProfileChange(listener: ActiveProfileListener): () => void {
    this.activeProfileListeners.add(listener);
    return () => this.activeProfileListeners.delete(listener);
  }

  cycleActiveProfile(direction: 1 | -1): void { cycleActiveProfile(this, direction); }
  setFunctionMappings(mappings: FunctionMapping[]): void { this.functionActions.setMappings(mappings); }
  getFunctionMappings(): FunctionMapping[] { return this.functionActions.getMappings(); }

  onFunctionAction(action: FunctionAction, callback: () => void): () => void {
    return this.functionActions.onAction(action, callback);
  }

  isPaused(): boolean { return this.pauseManager.isPaused; }

  checkControllerPresence(): void {
    this.pauseManager.checkControllerDisconnect(this.activeProfile, connectedGamepadKeys(this), this.devices);
  }

  resumeIfControllerPresent(): void {
    this.pauseManager.resumeIfPresent(this.activeProfile, connectedGamepadKeys(this));
  }

  reevaluateControllerPresence(): void {
    this.pauseManager.reevaluateForProfile(this.activeProfile, connectedGamepadKeys(this), this.devices);
  }

  resume(): void { this.pauseManager.resume(); }
  togglePause(): void { this.pauseManager.togglePause(); }
  onPauseChange(listener: PauseListener): () => void { return this.pauseManager.subscribe(listener); }
  onRawInput(listener: RawInputListener): () => void { return this.rawDispatcher.subscribe(listener); }

  onInputState(listener: InputStateListener): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  getDevices(): DetectedDevice[] { return this.devices; }

  onDeviceChange(listener: DeviceChangeListener): () => void {
    this.deviceListeners.add(listener);
    return () => this.deviceListeners.delete(listener);
  }

  getHidStates(): Map<string, ControllerInputState> { return this.currentHidStates; }
  getPressedKeys(): Set<string> { return this.allPressedKeys; }
  isHidConnected(): boolean { return controllerInputStore.isConnected(); }
  start(): void { startInputManager(this); }
  stop(): void { stopInputManager(this); }
  refreshDevices(): void { refreshInputDevices(this); }
}

export { InputManager };
