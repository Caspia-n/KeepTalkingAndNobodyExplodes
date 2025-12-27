'use client';

import { useBomb } from '@/lib/bomb-context';

interface BatteryTrackerProps {
  compact?: boolean;
  className?: string;
}

export default function BatteryTracker({ compact = false, className = '' }: BatteryTrackerProps) {
  const { bomb } = useBomb();

  if (!bomb) return null;

  return (
    <div className={`${className}`}>
      <div className={compact ? 'flex items-center gap-2' : 'flex items-center justify-center gap-3'}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`text-2xl transition-all ${
              i < bomb.batteries
                ? 'text-blue-400 opacity-100'
                : 'text-slate-600 opacity-40'
            }`}
          >
            🔋
          </div>
        ))}
        {!compact && (
          <span className={`ml-4 font-bold text-xl ${
            bomb.batteries === 0 
              ? 'text-slate-400' 
              : bomb.batteries > 2 
                ? 'text-green-400' 
                : 'text-yellow-400'
          }`}>
            {bomb.batteries}/6
          </span>
        )}
      </div>
    </div>
  );
}