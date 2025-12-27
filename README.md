# Keep Talking and Nobody Explodes - Bomb Defusal Assistant

An interactive web application for the Keep Talking and Nobody Explodes bomb defusal game. This app helps players manage bomb characteristics and track defusal progress.

## Features

- **Bomb Setup Form**: Capture all global bomb characteristics including serial number, batteries, indicators, ports, and strikes
- **State Management**: In-memory bomb state with localStorage persistence
- **Save/Load**: Save named bomb states and restore them later
- **Visual Display**: Clear, readable display of bomb information with helpful hints
- **Strike Tracking**: Track strikes with visual indicators
- **Mobile-Friendly**: Responsive design that works on all devices

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS for styling
- **React Context API** - State management
- **localStorage** - Client-side persistence

## Getting Started

First, install dependencies:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Main application page
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── BombForm.tsx    # Bomb setup/edit form
│   ├── BombMenu.tsx    # Main menu and load interface
│   └── BombDisplay.tsx # Bomb status display
├── lib/                # Utilities and context
│   ├── bomb-context.tsx  # React context for bomb state
│   └── storage.ts        # localStorage helpers
└── types/              # TypeScript definitions
    └── bomb.ts         # Bomb state interfaces
```

## How to Use

1. **Start New Bomb**: Click "Start New Bomb Defusal" on the main menu
2. **Enter Bomb Details**: Fill in the serial number, batteries, indicators, ports, and current strikes
3. **Save and Continue**: Click "Start Defusal" to begin tracking
4. **Track Progress**: View bomb status and add strikes as needed
5. **Save Progress**: Use the "Save Bomb" button to save your progress
6. **Load Later**: Return to the menu and load any saved bomb state

## Bomb Characteristics

### Serial Number
- 6 alphanumeric characters
- Used to determine vowel presence and parity of last digit
- Important for many module defusal rules

### Batteries (0-6)
- Total number of batteries on the bomb
- Many modules require knowing if you have more than 1 or 2 batteries

### Indicators
- Lit indicators on the bomb
- Common indicators: FRK, FRQ, CAR, IND, SIG, NSA, MSA, TRN, BOB, CLR, SND

### Ports
- Port plates on the bomb
- Port types: Parallel, PS/2, RJ-45, Serial, USB, DVI-D, Stereo RCA, Empty

### Strikes (0-3)
- Current number of strikes
- 3 strikes = explosion!

## Future Enhancements

This is the foundation for a complete bomb defusal assistant. Future additions will include:

- Individual module defusal helpers (wires, button, keypads, Simon Says, etc.)
- Module tracking and completion status
- Timer functionality
- Module-specific rules and lookup tables

## License

This project is a fan-made assistant for the game "Keep Talking and Nobody Explodes" by Steel Crate Games.
