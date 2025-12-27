import { BombState } from '@/types/bomb';
import { ModuleLogic, InstructionStep } from '@/types/module';

// Keypad symbols based on KTANE manual
export const KEYPAD_SYMBOLS = [
  { id: 1, name: 'Omega', ascii: 'Ω' },
  { id: 2, name: 'Psi', ascii: 'Ψ' },
  { id: 3, name: 'Phi', ascii: 'Φ' },
  { id: 4, name: 'Lambda', ascii: 'Λ' },
  { id: 5, name: 'Xi', ascii: 'Ξ' },
  { id: 6, name: 'Chi', ascii: 'Χ' },
  { id: 7, name: 'Gamma', ascii: 'Γ' },
  { id: 8, name: 'Delta', ascii: 'Δ' },
  { id: 9, name: 'Sigma', ascii: 'Σ' },
  { id: 10, name: 'Theta', ascii: 'Θ' },
  { id: 11, name: 'Beta', ascii: 'Β' },
  { id: 12, name: 'Alpha', ascii: 'Α' },
  { id: 13, name: 'Pi', ascii: 'Π' },
  { id: 14, name: 'Zeta', ascii: 'Ζ' },
  { id: 15, name: 'Eta', ascii: 'Η' },
  { id: 16, name: 'Tau', ascii: 'Τ' },
  { id: 17, name: 'Mu', ascii: 'Μ' },
  { id: 18, name: 'Nu', ascii: 'Ν' },
  { id: 19, name: 'Rho', ascii: 'Ρ' },
  { id: 20, name: 'Iota', ascii: 'Ι' },
  { id: 21, name: 'Kappa', ascii: 'Κ' },
  { id: 22, name: 'Omicron', ascii: 'Ο' },
  { id: 23, name: 'Upsilon', ascii: 'Υ' },
  { id: 24, name: 'Bullseye', ascii: '◎' },
];

// Traditional games featuring symbols - simple 6x3 grid based on manual
export const KEYPAD_COLUMNS = [
  // Column 1 (6 symbols)
  ['Ω', 'Ψ', 'Ю', 'Σ', 'Φ', 'Λ'],
  // Column 2 (6 symbols)  
  ['Γ', 'Δ', 'Θ', 'Ξ', 'Β', 'Π'],
  // Column 3 (6 symbols)
  ['Ζ', 'Η', 'Τ', 'Μ', 'Ν', 'Υ'],
];

// Keypad module logic based on KTANE manual
export const keypads: ModuleLogic = {
  info: {
    id: 'keypads',
    name: 'Keypads',
    description: 'Input the correct sequence of symbols displayed on the keypad.',
    category: 'regular',
    difficulty: 'medium',
  },

  getSteps: (): InstructionStep[] => {
    const steps: InstructionStep[] = [
      {
        step: 1,
        type: 'info',
        title: 'Identify the Symbols',
        content: `Look at the 4 symbols displayed on the keypad buttons. Note each symbol's shape and position.

Available symbols include Greek letters and special characters:
${KEYPAD_SYMBOLS.slice(0, 12).map(s => `  • ${s.name} (${s.ascii})`).join('\n')}

See full reference for all 24 symbols.`,
      },
      {
        step: 2,
        type: 'info',
        title: 'Determine the Correct Order',
        content: `Look at the 4 symbols in the display and determine their ORDER based on manual reference:

Column 1: [Omega, Psi, Phi, Lambda, Xi, Chi]
Column 2: [Gamma, Delta, Theta, Beta, Alpha, Pi]
Column 3: [Zeta, Eta, Tau, Mu, Nu, Upsilon]

Find which column contains ALL FOUR symbols (only one column will). Then press the symbols in the order they appear in that column.`,
        note: 'All symbols will be in one specific column. Use column order!',
      },
      {
        step: 3,
        type: 'warning',
        title: 'Press in Correct Order',
        content: 'Press the 4 keypad buttons in the determined order.',
        warning: 'Wrong order will cause a strike!',
      },
    ];

    return steps;
  },

  getQuestions: () => {
    const allSymbols = KEYPAD_SYMBOLS.map(s => s.ascii);
    return [
      {
        id: 'symbol-1',
        type: 'select',
        label: 'Symbol 1 (Top-Left)',
        description: 'What symbol is in the top-left position?',
        options: allSymbols,
      },
      {
        id: 'symbol-2',
        type: 'select',
        label: 'Symbol 2 (Top-Right)',
        description: 'What symbol is in the top-right position?',
        options: allSymbols,
      },
      {
        id: 'symbol-3',
        type: 'select',
        label: 'Symbol 3 (Bottom-Left)',
        description: 'What symbol is in the bottom-left position?',
        options: allSymbols,
      },
      {
        id: 'symbol-4',
        type: 'select',
        label: 'Symbol 4 (Bottom-Right)',
        description: 'What symbol is in the bottom-right position?',
        options: allSymbols,
      },
    ];
  },

  solve: (_bomb: BombState, answers: Record<string, unknown>) => {
    const symbols = [
      answers['symbol-1'] as string,
      answers['symbol-2'] as string,
      answers['symbol-3'] as string,
      answers['symbol-4'] as string,
    ];
    
    // Find which column contains all four symbols
    let foundColumn: string[] | null = null;
    let columnIndex = -1;
    
    for (let i = 0; i < KEYPAD_COLUMNS.length; i++) {
      const column = KEYPAD_COLUMNS[i];
      const allInColumn = symbols.every(symbol => column.includes(symbol));
      if (allInColumn) {
        foundColumn = column;
        columnIndex = i;
        break;
      }
    }
    
    if (!foundColumn) {
      return {
        solution: 'Error: Symbols not found in any column',
        explanation: 'Make sure you selected correct symbols',
      };
    }
    
    // Get the order based on column position
    const orderedSymbols = foundColumn.filter(symbol => symbols.includes(symbol));
    
    return {
      solution: `Press in order: ${orderedSymbols.join(' → ')}`,
      explanation: `Found in Column ${columnIndex + 1}`,
    };
  },

  validate: (): { correct: boolean; message?: string } => {
    return { correct: true, message: 'Keypads module validated' };
  },

  defaultAnswers: (): Record<string, unknown> => {
    return { 'symbol-1': 'Ω', 'symbol-2': 'Ψ', 'symbol-3': 'Φ', 'symbol-4': 'Λ' };
  },
};

export type KeypadsModule = typeof keypads;
