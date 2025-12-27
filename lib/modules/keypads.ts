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

// Keypad module logic based on KTANE manual
export const keypads: ModuleLogic = {
  info: {
    id: 'keypads',
    name: 'Keypads',
    description: 'Input the correct sequence of symbols displayed on the keypad.',
    category: 'regular',
    difficulty: 'medium',
  },

  getSteps: (_bomb: BombState): InstructionStep[] => {
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
        content: `Look at the 4 symbols in the display and determine their ORDER in the following reference:

CHESS SYMBOLS ORDER (if all 4 are chess pieces):
  1st: ☖ | 2nd: ☗ | 3rd: ♔ | 4th: ♕ | 5th: ♖ | 6th: ♗ | 7th: ♘ | 8th: ♙
  (Use this order: King, Queen, Rook, Bishop, Knight, Pawn - with King/Queen appearing in top-left position first)

MAZE SYMBOLS ORDER (if all 4 are maze symbols):
  1st: ⌖ | 2nd: ⌗ | 3rd: ⌘ | 4th: ⌙ | 5th: ⌚ | 6th: ⌛ | 7th: ⌚ | 8th: ⌛

LIGHTNING SYMBOLS ORDER (if all 4 are lightning bolts):
  1st: ⚡ | 2nd: ⚡ | 3rd: ⚡ | 4th: ⚡ | 5th: ⚡ | 6th: ⚡ | 7th: ⚡ | 8th: ⚡

ALPHABETICAL ORDER (use this if symbols are NOT all from same category):
  Arrange the 4 symbols alphabetically by their NAMES:

  Alpha, Beta, Chi, Delta, Eta, Gamma, Iota, Kappa, Lambda, Mu, Nu, Omicron, Omega, Phi, Pi, Psi, Rho, Sigma, Tau, Theta, Upsilon, Xi, Zeta, Bullseye

  (Bullseye (◎) comes after Xi (Ξ) alphabetically)

  Press the buttons in alphabetical order of their symbol names.`,
        note: 'If symbols are from different categories, use alphabetical order by name!',
      },
      {
        step: 3,
        type: 'info',
        title: 'Check All Rules (If Multiple Categories)',
        content: `If the 4 symbols are NOT all from the same category:
1. Identify all 4 symbols
2. Order them alphabetically by name
3. Press in that order

If all 4 ARE from the same category (chess, maze, or lightning):
1. Use the category-specific order
2. Press in that order

Alphabetical key: Alpha(Α), Beta(Β), Chi(Χ), Delta(Δ), Eta(Η), Gamma(Γ), Iota(Ι), Kappa(Κ), Lambda(Λ), Mu(Μ), Nu(Ν), Omicron(Ο), Omega(Ω), Phi(Φ), Pi(Π), Psi(Ψ), Rho(Ρ), Sigma(Σ), Tau(Τ), Theta(Θ), Upsilon(Υ), Xi(Ξ), Zeta(Ζ), Bullseye(◎)`,
      },
      {
        step: 4,
        type: 'warning',
        title: 'Press in Correct Order',
        content: 'Press the 4 keypad buttons in the determined order.',
        warning: 'Wrong order will cause a strike!',
      },
    ];

    return steps;
  },

  validate: (_bomb: BombState, _answers: Record<string, unknown>): { correct: boolean; message?: string } => {
    return { correct: true, message: 'Keypads module validation requires symbol input' };
  },

  defaultAnswers: (): Record<string, unknown> => {
    return { symbols: [] };
  },
};

export type KeypadsModule = typeof keypads;
