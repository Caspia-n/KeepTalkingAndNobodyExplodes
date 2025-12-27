import { ModuleLogic, InstructionStep } from '@/types/module';

// Who's on First module logic based on KTANE manual
export const whosOnFirst: ModuleLogic = {
  info: {
    id: 'whos-on-first',
    name: "Who's on First",
    description: 'Match the word on the display with the correct button based on position labels.',
    category: 'regular',
    difficulty: 'hard',
  },

  getSteps: (): InstructionStep[] => {
    const steps: InstructionStep[] = [
      {
        step: 1,
        type: 'info',
        title: 'Read the Display Word',
        content: `The top display shows a word. Note what it says.

Common words: YES, FIRST, DISPLAY, OKAY, SAYS, NOTHING, EMPTY, LED, etc.`,
      },
      {
        step: 2,
        type: 'info',
        title: 'Check Step 1 - Look for these words on buttons',
        content: `If the display shows:
  • "YES" - press the button in the 2nd position
  • "FIRST" - press the button in the 1st position
  • "DISPLAY" - press the button in the 4th position
  • "OKAY" - press the button in the 5th position
  • "SAYS" - press the button in the 6th position
  • "NOTHING" - press the button in the 2nd position
  • "EMPTY" - press the button in the 2nd position
  • "LED" - press the button in the 3rd position
  • "LIE" - press the button in the 6th position
  • "READ" - press the button in the 2nd position
  • "RED" - press the button in the 2nd position
  • "REED" - press the button in the 4th position
  • "LEED" - press the button in the 4th position
  • "HOLD ON" - press the button in the 5th position
  • "YOU" - press the button in the 4th position
  • "YOUR" - press the button in the 6th position
  • "YOU'RE" - press the button in the 4th position
  • "UR" - press the button in the 1st position
  • "WHAT" - press the button in the 3rd position
  • "U" - press the button in the 4th position
  • "UM" - press the button in the 4th position
  • "UH" - press the button in the 4th position
  • "UH OH" - press the button in the 5th position
  • "ALREADY" - press the button in the 5th position`,
        note: 'If the display word is not in this list, proceed to Step 2!',
      },
      {
        step: 3,
        type: 'info',
        title: 'Check Step 2 - If display not found in Step 1',
        content: `If the display word is not in the Step 1 list:

  • "YES" - press the button in the 2nd position
  • "FIRST" - press the button in the 1st position
  • "DISPLAY" - press the button in the 4th position
  • "OKAY" - press the button in the 5th position
  • "SAYS" - press the button in the 6th position
  • "NOTHING" - press the button in the 2nd position
  • "EMPTY" - press the button in the 1st position
  • "LED" - press the button in the 3rd position
  • "LIE" - press the button in the 5th position
  • "READ" - press the button in the 2nd position
  • "RED" - press the button in the 2nd position
  • "REED" - press the button in the 4th position
  • "LEED" - press the button in the 4th position
  • "HOLD ON" - press the button in the 5th position
  • "YOU" - press the button in the 4th position
  • "YOUR" - press the button in the 6th position
  • "YOU'RE" - press the button in the 4th position
  • "UR" - press the button in the 1st position
  • "WHAT" - press the button in the 3rd position
  • "U" - press the button in the 4th position
  • "UM" - press the button in the 1st position
  • "UH" - press the button in the 1st position
  • "UH OH" - press the button in the 5th position
  • "ALREADY" - press the button in the 5th position`,
        note: 'This is a DIFFERENT table from Step 1!',
      },
      {
        step: 4,
        type: 'info',
        title: 'Button Positions Reference',
        content: `Button positions (top to bottom, left to right):

  TL  TR    (Top Left, Top Right)
  ML  MR    (Middle Left, Middle Right)
  BL  BR    (Bottom Left, Bottom Right)

The buttons are labeled with words. Match the display word to the correct button using the tables above.`,
      },
      {
        step: 5,
        type: 'warning',
        title: 'Press the Correct Button',
        content: 'Press the button in the position indicated by the tables.',
        warning: 'Wrong button will cause a strike!',
      },
    ];

    return steps;
  },

  validate: (): { correct: boolean; message?: string } => {
    return { correct: true, message: "Who's on First module requires display word input" };
  },

  defaultAnswers: (): Record<string, unknown> => {
    return { displayWord: '', buttonWord: '' };
  },
};

export type WhosOnFirstModule = typeof whosOnFirst;
