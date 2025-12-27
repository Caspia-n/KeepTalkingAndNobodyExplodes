export type Indicator =
  | 'FRK'
  | 'FRQ'
  | 'CAR'
  | 'IND'
  | 'SIG'
  | 'NSA'
  | 'MSA'
  | 'TRN'
  | 'BOB'
  | 'CLR'
  | 'SND';

export type PortType =
  | 'parallel'
  | 'ps2'
  | 'rj45'
  | 'serial'
  | 'usb'
  | 'dvid'
  | 'stereo_rca'
  | 'empty';

export type ModuleCategory = 'regular' | 'needy';

export type ModuleId =
  | 'wires'
  | 'button'
  | 'keypads'
  | 'simon'
  | 'whos-on-first'
  | 'memory'
  | 'morse';

export interface BombState {
  id: string;
  serialNumber: string;
  batteries: number;
  indicators: Indicator[];
  ports: PortType[];
  strikes: number;
  modules: ModuleState[];
  createdAt: number;
  updatedAt: number;
}

export interface ModuleState {
  id: ModuleId;
  solved: boolean;
  strikes: number;
}

export interface SavedBomb {
  name: string;
  bomb: BombState;
  savedAt: number;
}

export type BombAction =
  | { type: 'CREATE_BOMB'; payload: Partial<BombState> }
  | { type: 'UPDATE_BOMB'; payload: Partial<BombState> }
  | { type: 'SET_INDICATORS'; payload: Indicator[] }
  | { type: 'TOGGLE_INDICATOR'; payload: Indicator }
  | { type: 'SET_PORTS'; payload: PortType[] }
  | { type: 'TOGGLE_PORT'; payload: PortType }
  | { type: 'ADD_STRIKE' }
  | { type: 'RESET_STRIKES' }
  | { type: 'CLEAR_BOMB' }
  | { type: 'LOAD_BOMB'; payload: BombState }
  | { type: 'SET_MODULE_SOLVED'; payload: ModuleId }
  | { type: 'ADD_MODULE_STRIKE'; payload: ModuleId }
  | { type: 'RESET_MODULES' };

export interface BombContextType {
  bomb: BombState | null;
  createBomb: (data: Partial<BombState>) => void;
  updateBomb: (data: Partial<BombState>) => void;
  setIndicators: (indicators: Indicator[]) => void;
  toggleIndicator: (indicator: Indicator) => void;
  setPorts: (ports: PortType[]) => void;
  togglePort: (port: PortType) => void;
  addStrike: () => void;
  resetStrikes: () => void;
  clearBomb: () => void;
  loadBomb: (bomb: BombState) => void;
  hasActiveBomb: () => boolean;
  setModuleSolved: (moduleId: ModuleId) => void;
  addModuleStrike: (moduleId: ModuleId) => void;
  resetModules: () => void;
  getSolvedModules: () => ModuleState[];
  getUnsolvedModules: () => ModuleState[];
  isModuleSolved: (moduleId: ModuleId) => boolean;
}

// Helper functions for bomb characteristics
export function hasVowelInSerial(bomb: BombState | null): boolean {
  if (!bomb) return false;
  return /[AEIOU]/i.test(bomb.serialNumber);
}

export function isLastDigitOdd(bomb: BombState | null): boolean {
  if (!bomb) return false;
  const lastChar = bomb.serialNumber.slice(-1);
  const digit = parseInt(lastChar);
  return !isNaN(digit) && digit % 2 === 1;
}

export function hasIndicator(bomb: BombState | null, indicator: Indicator): boolean {
  if (!bomb) return false;
  return bomb.indicators.includes(indicator);
}

export function hasPort(bomb: BombState | null, port: PortType): boolean {
  if (!bomb) return false;
  return bomb.ports.includes(port);
}

export function hasMoreBatteriesThan(bomb: BombState | null, count: number): boolean {
  if (!bomb) return false;
  return bomb.batteries > count;
}
