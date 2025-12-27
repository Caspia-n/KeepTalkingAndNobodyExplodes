import { BombState } from './bomb';

export type StepType = 'info' | 'action' | 'warning' | 'success';

export interface InstructionStep {
  step: number;
  type: StepType;
  title: string;
  content: string;
  condition?: string;
  note?: string;
  warning?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface Question {
  id: string;
  type: 'text' | 'select' | 'multi-select' | 'boolean';
  label: string;
  description?: string;
  options?: string[];
  dependsOn?: string;
  condition?: (answers: Record<string, unknown>) => boolean;
}

export interface ModuleInfo {
  id: string;
  name: string;
  description: string;
  category: 'regular' | 'needy';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ModuleLogic {
  info: ModuleInfo;
  getSteps?: (bomb: BombState) => InstructionStep[];
  getQuestions?: (bomb: BombState) => Question[];
  solve?: (bomb: BombState, answers: Record<string, unknown>) => { solution: string; explanation?: string };
  validate?: (bomb: BombState, answers: Record<string, unknown>) => { correct: boolean; message?: string };
  defaultAnswers?: () => Record<string, unknown>;
}
