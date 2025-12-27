import { BombState } from '@/types/bomb';
import { ModuleLogic, InstructionStep } from '@/types/module';
import { hasVowelInSerial, isLastDigitOdd } from '@/types/bomb';

// Wire module logic based on KTANE manual
export const wires: ModuleLogic = {
  info: {
    id: 'wires',
    name: 'Wires',
    description: 'Cut the correct wire based on the color pattern and bomb characteristics.',
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
        title: 'Analyze the Wires',
        content: 'Count the wires and note their colors from top to bottom.',
        condition: `Vowel in serial: ${hasVowel ? 'YES' : 'NO'} | Last digit odd: ${lastDigitOdd ? 'YES' : 'NO'} | Batteries: ${bomb.batteries}`,
      },
      {
        step: 2,
        type: 'info',
        title: 'Determine Which Wire to Cut',
        content: `Based on the KTANE manual rules:
        
• If there is more than 1 red wire and the last digit of the serial is ODD, cut the second red wire.
• Otherwise, if the last wire is WHITE and there is a lit CAR indicator with no lit FRK indicator, cut the last wire.
• Otherwise, if there is more than 1 YELLOW wire, cut the last yellow wire.
• Otherwise, if the first wire is NOT RED and there is more than 1 BLUE wire, cut the last blue wire.
• Otherwise, if there is exactly 1 red wire, cut the first wire.
• Otherwise, if the last wire is GREEN, cut the first wire.
• Otherwise, if there is more than 1 wire, cut the last wire.
• Otherwise (only 1 wire), cut the first wire.`,
        note: 'These rules must be checked in order - use the first rule that applies!',
      },
      {
        step: 3,
        type: 'warning',
        title: 'Cut the Correct Wire',
        content: 'After identifying the correct wire, cut it to solve the module.',
        warning: 'Cutting the wrong wire will cause a strike!',
      },
    ];

    return steps;
  },

  validate: (_bomb: BombState, _answers: Record<string, unknown>): { correct: boolean; message?: string } => {
    return { correct: true, message: 'Wires module validation requires wire state input' };
  },

  defaultAnswers: (): Record<string, unknown> => {
    return { wires: [] };
  },
};

export type WiresModule = typeof wires;
