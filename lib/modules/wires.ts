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

  getQuestions: () => {
    return [
      {
        id: 'wire-count',
        type: 'select',
        label: 'How many wires?',
        description: 'Count the wires from top to bottom',
        options: ['3', '4', '5', '6'],
      },
      {
        id: 'wire-colors',
        type: 'text',
        label: 'Wire colors',
        description: 'Enter wire colors from top to bottom (e.g., R,Y,B,R,G)',
      },
    ];
  },

  solve: (bomb: BombState, answers: Record<string, any>) => {
    const wireCount = parseInt(answers['wire-count']);
    const wireColors = (answers['wire-colors'] as string).toUpperCase().split(',');
    const hasVowel = hasVowelInSerial(bomb);
    const lastDigitOdd = isLastDigitOdd(bomb);
    
    // Wire color mapping
    const colorMap: Record<string, string> = {
      'R': 'Red',
      'Y': 'Yellow',
      'B': 'Blue',
      'W': 'White',
      'G': 'Green'
    };

    // Count colors
    const colorCounts = {
      red: wireColors.filter(c => c === 'R').length,
      yellow: wireColors.filter(c => c === 'Y').length,
      blue: wireColors.filter(c => c === 'B').length,
      white: wireColors.filter(c => c === 'W').length,
      green: wireColors.filter(c => c === 'G').length,
    };

    let wireToCut = 0;
    let reason = '';

    // Wire rules based on wire count
    if (wireCount === 3) {
      if (!wireColors.includes('R')) {
        wireToCut = 2; // Second wire (index 1 is second wire, 0-indexed)
        reason = 'No red wires: Cut second wire';
      } else if (wireColors[wireColors.length - 1] === 'W') {
        wireToCut = 3; // Last wire
        reason = 'Last wire is white: Cut last wire';
      } else if (colorCounts.blue > 1) {
        wireToCut = 3; // Last blue wire
        reason = 'More than one blue wire: Cut last blue wire';
      } else {
        wireToCut = 3; // Last wire
        reason = 'Default: Cut last wire';
      }
    } else if (wireCount === 4) {
      if (colorCounts.red > 1 && lastDigitOdd) {
        // Find second red wire
        wireToCut = wireColors.indexOf('R', wireColors.indexOf('R') + 1) + 1;
        reason = `More than 1 red wire and serial number odd: Cut wire ${wireToCut}`;
      } else if (wireColors[wireColors.length - 1] === 'Y' && colorCounts.red === 0) {
        wireToCut = 1; // First wire
        reason = 'Last wire yellow and no red wires: Cut first wire';
      } else if (colorCounts.blue === 1) {
        wireToCut = 1; // First wire
        reason = 'Exactly one blue wire: Cut first wire';
      } else if (colorCounts.yellow > 1) {
        wireToCut = 4; // Last wire
        reason = 'More than one yellow wire: Cut last wire';
      } else {
        wireToCut = 2; // Second wire
        reason = 'Default: Cut second wire';
      }
    } else if (wireCount === 5) {
      if (wireColors[wireColors.length - 1] === 'B' && lastDigitOdd) {
        wireToCut = 4; // Fourth wire
        reason = 'Last wire black and serial odd: Cut fourth wire';
      } else if (colorCounts.red === 1 && colorCounts.yellow > 1) {
        wireToCut = 1; // First wire
        reason = 'Exactly one red wire and more than one yellow: Cut first wire';
      } else if (!wireColors.includes('B')) {
        wireToCut = 2; // Second wire
        reason = 'No black wires: Cut second wire';
      } else {
        wireToCut = 1; // First wire
        reason = 'Default: Cut first wire';
      }
    } else if (wireCount === 6) {
      if (!wireColors.includes('Y') && lastDigitOdd) {
        wireToCut = 3; // Third wire
        reason = 'No yellow wires and serial odd: Cut third wire';
      } else if (colorCounts.yellow === 1) {
        wireToCut = 4; // Fourth wire
        reason = 'Exactly one yellow wire: Cut fourth wire';
      } else if (colorCounts.red === 0) {
        wireToCut = 6; // Last wire
        reason = 'No red wires: Cut last wire';
      } else {
        wireToCut = 4; // Fourth wire
        reason = 'Default: Cut fourth wire';
      }
    }

    const wireColor = colorMap[wireColors[wireToCut - 1]] || wireColors[wireToCut - 1];
    
    return {
      solution: `Cut wire ${wireToCut} (${wireColor})`,
      explanation: reason,
    };
  },

  validate: (_bomb: BombState, _answers: Record<string, unknown>): { correct: boolean; message?: string } => {
    return { correct: true, message: 'Wires module validated' };
  },

  defaultAnswers: (): Record<string, unknown> => {
    return { 'wire-count': '3', 'wire-colors': 'R,Y,B' };
  },
};

export type WiresModule = typeof wires;
