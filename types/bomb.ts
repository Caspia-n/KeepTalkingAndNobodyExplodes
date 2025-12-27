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

export interface BombState {
  id: string;
  serialNumber: string;
  batteries: number;
  indicators: Indicator[];
  ports: PortType[];
  strikes: number;
  createdAt: number;
  updatedAt: number;
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
  | { type: 'LOAD_BOMB'; payload: BombState };

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
}
