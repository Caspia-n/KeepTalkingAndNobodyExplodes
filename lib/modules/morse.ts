import { BombState } from '@/types/bomb';
import { ModuleLogic, InstructionStep } from '@/types/module';
import { hasVowelInSerial, isLastDigitOdd } from '@/types/bomb';

// Morse Code module logic based on KTANE manual
export const morse: ModuleLogic = {
  info: {
    id: 'morse',
    name: 'Morse Code',
    description: 'Decode morse code signals to find the correct transmission frequency.',
    category: 'regular',
    difficulty: 'medium',
  },

  getSteps: (bomb: BombState): InstructionStep[] => {
    const hasSerialVowel = hasVowelInSerial(bomb);
    const lastDigitOdd = isLastDigitOdd(bomb);

    const steps: InstructionStep[] = [
      {
        step: 1,
        type: 'info',
        title: 'Decode the Morse Code',
        content: `A word will be transmitted in Morse code on the module. Decode it using the chart below.

MORSE CODE REFERENCE:
  A: .-    N: -.    0: -----
  B: -...  O: ---   1: .----
  C: -.-.  P: .--.  2: ..---
  D: -..   Q: --.-  3: ...--
  E: .     R: .-.   4: ....-
  F: ..-.  S: ...   5: .....
  G: --.   T: -     6: -....
  H: ....  U: ..-   7: --...
  I: ..    V: ...-  8: ---..
  J: .---  W: .--   9: ----.
  K: -.-   X: -..-
  L: .-..  Y: -.--
  M: --    Z: --..

Listen for the pattern of dots (short) and dashes (long).`,
      },
      {
        step: 2,
        type: 'info',
        title: 'Find the Frequency',
        content: `Once you've decoded the word, find it in the list below to get the frequency:

  A: 3.505 MHz  N: 3.655 MHz
  B: 3.515 MHz  O: 3.665 MHz
  C: 3.525 MHz  P: 3.675 MHz
  D: 3.535 MHz  Q: 3.685 MHz
  E: 3.545 MHz  R: 3.695 MHz
  F: 3.555 MHz  S: 3.705 MHz
  G: 3.565 MHz  T: 3.715 MHz
  H: 3.575 MHz  U: 3.725 MHz
  I: 3.585 MHz  V: 3.735 MHz
  J: 3.595 MHz  W: 3.745 MHz
  K: 3.605 MHz  X: 3.755 MHz
  L: 3.615 MHz  Y: 3.765 MHz
  M: 3.625 MHz  Z: 3.775 MHz`,
      },
      {
        step: 3,
        type: 'info',
        title: 'Adjust for Bomb Characteristics',
        content: `If ANY of these conditions are true, ADD 1 to the frequency:
  • Serial number contains a vowel
  • Last digit of serial is odd

FREQUENCY ADJUSTMENT:
  ${hasSerialVowel ? '✓ Serial has vowel' : '✗ Serial has no vowel'}
  ${lastDigitOdd ? '✓ Last digit is odd' : '✗ Last digit is even'}

Base frequency + ${hasSerialVowel || lastDigitOdd ? '1' : '0'} = ${3.505 + ((hasSerialVowel || lastDigitOdd) ? 1 : 0)} MHz`,
        note: 'The frequency will always end in .xxx or .yyy - enter it exactly!',
      },
      {
        step: 4,
        type: 'info',
        title: 'Enter the Frequency',
        content: `Enter the final frequency using the keypad:
1. Press the frequency number (e.g., "3.505" for base 3.505 MHz)
2. Press the "TX" (transmit) button to submit

If the frequency is incorrect, a strike will be given.`,
      },
      {
        step: 5,
        type: 'warning',
        title: 'Transmit the Correct Frequency',
        content: 'Enter the decoded frequency and press TX.',
        warning: 'Wrong frequency will cause a strike!',
      },
    ];

    return steps;
  },

  validate: (_bomb: BombState, _answers: Record<string, unknown>): { correct: boolean; message?: string } => {
    return { correct: true, message: 'Morse Code module requires audio input' };
  },

  defaultAnswers: (): Record<string, unknown> => {
    return { decodedWord: '', frequency: 0 };
  },
};

export type MorseModule = typeof morse;
