import { BombState } from '@/types/bomb';
import { ModuleLogic, InstructionStep } from '@/types/module';
import { hasVowelInSerial, isLastDigitOdd } from '@/types/bomb';

// Button module logic based on KTANE manual
export const button: ModuleLogic = {
  info: {
    id: 'button',
    name: 'The Button',
    description: 'Press or hold the button based on its color, label, and bomb characteristics.',
    category: 'regular',
    difficulty: 'medium',
  },

  getSteps: (bomb: BombState): InstructionStep[] => {
    const hasVowel = hasVowelInSerial(bomb);
    const lastDigitOdd = isLastDigitOdd(bomb);

    const steps: InstructionStep[] = [
      {
        step: 1,
        type: 'info',
        title: 'Examine the Button',
        content: 'Note the button\'s color and the text label on it. Common labels include: DETONATE, HOLD, PRESS, ABORT, RELEASE.',
      },
      {
        step: 2,
        type: 'info',
        title: 'Determine Action',
        content: `STEP 1: If the button is ABORT and the indicator BOB is lit, hold the button and refer to "Holding a Button".

STEP 2: If the button is DETONATE and there is more than 1 battery, press and immediately release the button.

STEP 3: If the button is HOLD and there are 2 or more batteries, hold the button and refer to "Holding a Button".

STEP 4: If the button is WHITE and the indicator CAR is lit, hold the button and refer to "Holding a Button".

STEP 5: If the button is YELLOW and the indicator BOB is not lit, hold the button and refer to "Holding a Button".

STEP 6: If the button is RED and the button says HOLD, press and immediately release the button.

STEP 7: If there are 2 or more batteries and the indicator FRK is lit, press and immediately release the button.

STEP 8: If the button is BLUE and the button says HOLD, hold the button and refer to "Holding a Button".

STEP 9: Otherwise, hold the button and refer to "Holding a Button".`,
        note: 'These rules must be checked in order - use the first rule that applies!',
      },
      {
        step: 3,
        type: 'info',
        title: 'Holding a Button',
        content: `If instructed to hold the button:
1. A colored strip will appear with a number in it.
2. The strip color corresponds to how many seconds to hold before releasing.

• WHITE strip = 1 second
• BLUE strip = 2 seconds
• YELLOW strip = 3 seconds
• RED strip = 4 seconds
• GREEN strip = 5 seconds
• ORANGE strip = 6 seconds
• PURPLE strip = 7 seconds
• BLACK strip = 8 seconds
• PINK strip = 9 seconds
• BROWN strip = 0 seconds (release immediately)

Wait for the countdown timer to reach the correct number, then release the button.`,
        condition: `Batteries: ${bomb.batteries} | Serial vowel: ${hasVowel ? 'YES' : 'NO'} | Last digit odd: ${lastDigitOdd ? 'YES' : 'NO'}`,
      },
      {
        step: 4,
        type: 'warning',
        title: 'Execute the Correct Action',
        content: 'Press and release immediately, or hold until the countdown reaches the correct number.',
        warning: 'Incorrect timing or wrong action will cause a strike!',
      },
    ];

    return steps;
  },

  getQuestions: (bomb: BombState) => {
    return [
      {
        id: 'button-color',
        type: 'select',
        label: 'Button color',
        description: 'What color is the button?',
        options: ['Red', 'Blue', 'Yellow', 'White', 'Black'],
      },
      {
        id: 'button-label',
        type: 'select',
        label: 'Button label',
        description: 'What does the button say?',
        options: ['Detonate', 'Hold', 'Abort', 'Press', 'Release'],
      },
      {
        id: 'strip-color',
        type: 'select',
        label: 'Strip color (if holding)',
        description: 'If you need to hold the button, what color strip appears?',
        options: ['White', 'Blue', 'Yellow', 'Red', 'Green', 'Orange', 'Purple', 'Black', 'Pink', 'Brown'],
        condition: (answers) => {
          const color = answers['button-color'];
          const label = answers['button-label'];
          
          // Rules that require holding (strip color check)
          if (label === 'Abort' && bomb.indicators.includes('BOB')) return true;
          if (label === 'Hold' && bomb.batteries >= 2) return true;
          if (color === 'White' && bomb.indicators.includes('CAR')) return true;
          if (color === 'Yellow' && !bomb.indicators.includes('BOB')) return true;
          if (color === 'Blue' && label === 'Hold') return true;
          
          return false; // Default: no strip check needed
        },
      },
    ];
  },

  solve: (bomb: BombState, answers: Record<string, unknown>) => {
    const color = answers['button-color'] as string;
    const label = answers['button-label'] as string;
    const stripColor = answers['strip-color'] as string;
    
    // Strip color to seconds mapping
    const stripTiming: Record<string, number> = {
      'White': 1,
      'Blue': 2,
      'Yellow': 3,
      'Red': 4,
      'Green': 5,
      'Orange': 6,
      'Purple': 7,
      'Black': 8,
      'Pink': 9,
      'Brown': 0,
    };
    
    // Apply rules in order
    // Rule 1: ABORT button with lit BOB indicator
    if (label === 'Abort' && bomb.indicators.includes('BOB')) {
      const seconds = stripTiming[stripColor];
      return {
        solution: `Hold button until timer shows ${seconds}, then release`,
        explanation: 'Button says ABORT and BOB is lit',
      };
    }
    
    // Rule 2: DETONATE with more than 1 battery
    if (label === 'Detonate' && bomb.batteries > 1) {
      return {
        solution: 'Press and immediately release',
        explanation: 'Button says DETONATE and more than 1 battery',
      };
    }
    
    // Rule 3: HOLD button with 2+ batteries
    if (label === 'Hold' && bomb.batteries >= 2) {
      const seconds = stripTiming[stripColor];
      return {
        solution: `Hold button until timer shows ${seconds}, then release`,
        explanation: 'Button says HOLD and 2+ batteries',
      };
    }
    
    // Rule 4: WHITE button with lit CAR indicator
    if (color === 'White' && bomb.indicators.includes('CAR')) {
      const seconds = stripTiming[stripColor];
      return {
        solution: `Hold button until timer shows ${seconds}, then release`,
        explanation: 'White button and CAR is lit',
      };
    }
    
    // Rule 5: YELLOW button with no lit BOB indicator
    if (color === 'Yellow' && !bomb.indicators.includes('BOB')) {
      const seconds = stripTiming[stripColor];
      return {
        solution: `Hold button until timer shows ${seconds}, then release`,
        explanation: 'Yellow button and BOB is not lit',
      };
    }
    
    // Rule 6: RED button saying HOLD
    if (color === 'Red' && label === 'Hold' && bomb.batteries > 1) {
      return {
        solution: 'Press and immediately release',
        explanation: 'Red button saying HOLD with more than 1 battery',
      };
    }
    
    // Rule 7: 2+ batteries with lit FRK indicator
    if (bomb.batteries >= 2 && bomb.indicators.includes('FRK')) {
      return {
        solution: 'Press and immediately release',
        explanation: '2+ batteries and FRK is lit',
      };
    }
    
    // Rule 8: BLUE button saying HOLD
    if (color === 'Blue' && label === 'Hold') {
      const seconds = stripTiming[stripColor];
      return {
        solution: `Hold button until timer shows ${seconds}, then release`,
        explanation: 'Blue button saying HOLD',
      };
    }
    
    // Rule 9: Default - hold the button
    const seconds = stripTiming[stripColor];
    return {
      solution: `Hold button until timer shows ${seconds}, then release`,
      explanation: 'Default rule: hold the button',
    };
  },

  validate: (): { correct: boolean; message?: string } => {
    return { correct: true, message: 'Button module validated' };
  },

  defaultAnswers: (): Record<string, unknown> => {
    return { 'button-color': 'Red', 'button-label': 'Press' };
  },
};

export type ButtonModule = typeof button;
