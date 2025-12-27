import { ModuleLogic, InstructionStep } from '@/types/module';

// Memory module logic based on KTANE manual
export const memory: ModuleLogic = {
  info: {
    id: 'memory',
    name: 'Memory',
    description: 'Remember and repeat the correct sequence of numbers based on position rules.',
    category: 'regular',
    difficulty: 'hard',
  },

  getSteps: (): InstructionStep[] => {
    const steps: InstructionStep[] = [
      {
        step: 1,
        type: 'info',
        title: 'Stage 1 - Display 1',
        content: `A number will appear on the display. Press the button in the position that corresponds to that number.

Positions: 1 (Top-Left), 2 (Top-Right), 3 (Middle-Left), 4 (Middle-Right), 5 (Bottom-Left), 6 (Bottom-Right)

RULES FOR STAGE 1:
  • If the number is 1-3: Press the button in the same position
  • If the number is 4-6: Press the button in the position equal to the number

After pressing, a new number will appear. Remember the DISPLAY number for later stages.`,
        note: 'Memorize the displayed number - you will need it!',
      },
      {
        step: 2,
        type: 'info',
        title: 'Stage 2 - Display 2',
        content: `A new number appears. Use these rules based on Stage 1's display:

STAGE 1 WAS 1:
  • Press the number that matches Stage 1's display
  • Otherwise, press the button in position 4

STAGE 1 WAS 2:
  • Press the button in position (Stage 1 display + 2)
  • Otherwise, press the button in position (Stage 1 display)

STAGE 1 WAS 3:
  • Press the button in position 1
  • Otherwise, press the button in position (Stage 1 display)

STAGE 1 WAS 4:
  • Press the button in position 1
  • Otherwise, press the button in position (Stage 1 display)

STAGE 1 WAS 5:
  • Press the button in position (Stage 1 display + 2)
  • Otherwise, press the button in position (Stage 1 display)

STAGE 1 WAS 6:
  • Press the button in position (Stage 1 display + 1)
  • Otherwise, press the button in position (Stage 1 display)

Remember this new display number!`,
      },
      {
        step: 3,
        type: 'info',
        title: 'Stage 3 - Display 3',
        content: `A new number appears. Use these rules based on Stage 2's display:

STAGE 2 WAS 1:
  • Press the button in position 1
  • Otherwise, press the button in position (Stage 2 display + 2)

STAGE 2 WAS 2:
  • Press the button in position (Stage 2 display + 1)
  • Otherwise, press the button in position (Stage 1 display)

STAGE 2 WAS 3:
  • Press the button in position (Stage 1 display + 1)
  • Otherwise, press the button in position (Stage 2 display)

STAGE 2 WAS 4:
  • Press the button in position (Stage 2 display + 2)
  • Otherwise, press the button in position (Stage 1 display + 1)

STAGE 2 WAS 5:
  • Press the button in position (Stage 1 display + 2)
  • Otherwise, press the button in position (Stage 2 display)

STAGE 2 WAS 6:
  • Press the button in position (Stage 1 display + 1)
  • Otherwise, press the button in position (Stage 2 display + 1)

Remember this new display number!`,
      },
      {
        step: 4,
        type: 'info',
        title: 'Stage 4 - Display 4',
        content: `A new number appears. Use these rules based on Stage 1's display:

STAGE 1 WAS 1:
  • Press the button in position (Stage 2 display)
  • Otherwise, press the button in position (Stage 3 display)

STAGE 1 WAS 2:
  • Press the button in position (Stage 1 display)
  • Otherwise, press the button in position (Stage 3 display)

STAGE 1 WAS 3:
  • Press the button in position (Stage 3 display)
  • Otherwise, press the button in position (Stage 1 display)

STAGE 1 WAS 4:
  • Press the button in position (Stage 4 display)
  • Otherwise, press the button in position (Stage 1 display)

STAGE 1 WAS 5:
  • Press the button in position (Stage 1 display + 1)
  • Otherwise, press the button in position (Stage 2 display)

STAGE 1 WAS 6:
  • Press the button in position (Stage 2 display + 1)
  • Otherwise, press the button in position (Stage 4 display)`,
      },
      {
        step: 5,
        type: 'info',
        title: 'Stage 5 - Final Display',
        content: `The final number appears. Use these rules based on ALL previous displays:

STAGE 3 WAS 1:
  • Press the button in position (Stage 4 display)
  • Otherwise, press the button in position (Stage 2 display)

STAGE 3 WAS 2:
  • Press the button in position (Stage 1 display)
  • Otherwise, press the button in position (Stage 4 display)

STAGE 3 WAS 3:
  • Press the button in position (Stage 3 display)
  • Otherwise, press the button in position (Stage 1 display)

STAGE 3 WAS 4:
  • Press the button in position (Stage 2 display)
  • Otherwise, press the button in position (Stage 4 display)

STAGE 3 WAS 5:
  • Press the button in position (Stage 1 display)
  • Otherwise, press the button in position (Stage 3 display)

STAGE 3 WAS 6:
  • Press the button in position (Stage 4 display)
  • Otherwise, press the button in position (Stage 2 display)`,
        note: 'This is the final stage - complete it correctly!',
      },
      {
        step: 6,
        type: 'warning',
        title: 'Complete All 5 Stages',
        content: 'Work through all 5 stages in order, memorizing the displayed numbers.',
        warning: 'Wrong position at any stage will cause a strike!',
      },
    ];

    return steps;
  },

  validate: (): { correct: boolean; message?: string } => {
    return { correct: true, message: 'Memory module requires visual input' };
  },

  defaultAnswers: (): Record<string, unknown> => {
    return { stage: 1, display: 0, positions: [] };
  },
};

export type MemoryModule = typeof memory;
