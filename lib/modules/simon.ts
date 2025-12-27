import { BombState } from '@/types/bomb';
import { ModuleLogic, InstructionStep } from '@/types/module';
import { hasVowelInSerial, isLastDigitOdd } from '@/types/bomb';

// Simon Says module logic based on KTANE manual
export const simon: ModuleLogic = {
  info: {
    id: 'simon',
    name: 'Simon Says',
    description: 'Repeat the color sequence shown on the Simon module.',
    category: 'regular',
    difficulty: 'easy',
  },

  getSteps: (bomb: BombState): InstructionStep[] => {
    const hasVowel = hasVowelInSerial(bomb);
    const lastDigitOdd = isLastDigitOdd(bomb);

    const steps: InstructionStep[] = [
      {
        step: 1,
        type: 'info',
        title: 'Observe the Flashing Sequence',
        content: `Watch the sequence of colors that flash on the Simon module. The colors are: RED, BLUE, GREEN, YELLOW.`,
      },
      {
        step: 2,
        type: 'info',
        title: 'Determine the Correct Input Sequence',
        content: `Based on the bomb's serial number characteristics, use the appropriate table:

**If the serial number contains a vowel:**
  Strike count 0: BLUE → RED → GREEN → YELLOW
  Strike count 1: YELLOW → BLUE → RED → GREEN
  Strike count 2+: GREEN → YELLOW → BLUE → RED

**If the serial number has NO vowel and the last digit is ODD:**
  Strike count 0: YELLOW → GREEN → BLUE → RED
  Strike count 1: RED → YELLOW → GREEN → BLUE
  Strike count 2+: BLUE → RED → YELLOW → GREEN

**Otherwise (no vowel, last digit even):**
  Strike count 0: GREEN → YELLOW → RED → BLUE
  Strike count 1: BLUE → GREEN → YELLOW → RED
  Strike count 2+: RED → BLUE → YELLOW → GREEN`,
        condition: `Serial vowel: ${hasVowel ? 'YES' : 'NO'} | Last digit odd: ${lastDigitOdd ? 'YES' : 'NO'} | Strikes: ${bomb.strikes}`,
      },
      {
        step: 3,
        type: 'info',
        title: 'Input the Correct Sequence',
        content: `1. Press the buttons in the order specified by the table above.
2. Each correct sequence adds one more flash to the sequence.
3. Repeat the growing sequence until the module is solved.

For example, if the sequence starts flashing and you need to press BLUE, then the next input should be BLUE + (first color of next sequence).`,
        note: 'The sequence grows longer with each successful round!',
      },
      {
        step: 4,
        type: 'warning',
        title: 'Execute the Pattern',
        content: 'Watch carefully and repeat the color pattern.',
        warning: 'Wrong color or wrong order will cause a strike!',
      },
    ];

    return steps;
  },

  validate: (): { correct: boolean; message?: string } => {
    return { correct: true, message: 'Simon Says module requires visual input' };
  },

  defaultAnswers: (): Record<string, unknown> => {
    return { sequence: [], currentRound: 0 };
  },
};

export type SimonModule = typeof simon;
