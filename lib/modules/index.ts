import { ModuleId } from '@/types/bomb';
import { ModuleLogic } from '@/types/module';
import { wires } from './wires';
import { button } from './button';
import { keypads } from './keypads';
import { simon } from './simon';
import { whosOnFirst } from './whos-on-first';
import { memory } from './memory';
import { morse } from './morse';

export const MODULES: Record<ModuleId, ModuleLogic> = {
  'wires': wires,
  'button': button,
  'keypads': keypads,
  'simon': simon,
  'whos-on-first': whosOnFirst,
  'memory': memory,
  'morse': morse,
};

export const MODULE_ORDER: ModuleId[] = [
  'wires',
  'button',
  'keypads',
  'simon',
  'whos-on-first',
  'memory',
  'morse',
];

export const MODULE_NAMES: Record<ModuleId, string> = {
  'wires': 'Wires',
  'button': 'The Button',
  'keypads': 'Keypads',
  'simon': 'Simon Says',
  'whos-on-first': "Who's on First",
  'memory': 'Memory',
  'morse': 'Morse Code',
};

export function getModule(id: ModuleId): ModuleLogic | undefined {
  return MODULES[id];
}

export function getAllModules(): ModuleLogic[] {
  return MODULE_ORDER.map(id => MODULES[id]);
}

export function getModuleName(id: ModuleId): string {
  return MODULE_NAMES[id];
}
