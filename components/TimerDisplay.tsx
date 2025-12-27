'use client';

import { useState, useEffect } from 'react';
import { useBomb } from '@/lib/bomb-context';

interface TimerDisplayProps {
  showControls?: boolean;
  className?: string;
}

export default function TimerDisplay({ showControls = false, className = '' }: TimerDisplayProps) {
  const { bomb, startTimer, stopTimer, isTimerRunning, getTimeRemaining } = useBomb();
  const [currentTime, setCurrentTime] = useState<number>(getTimeRemaining());

  useEffect(() => {
    if (bomb?.timer) {
      const [minutes, seconds] = bomb.timer.split(':').map(Number);
      setCurrentTime(minutes * 60 + seconds);
    }
  }, [bomb?.timer]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerRunning() && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev - 1;
          // Update bomb timer string every second
          const minutes = Math.floor(newTime / 60);
          const seconds = newTime % 60;
          bomb.timer = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          return newTime;
        });
      }, 1000);
    } else if (currentTime === 0 && isTimerRunning()) {
      stopTimer();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, currentTime, stopTimer, bomb]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (): string => {
    if (currentTime <= 30) return 'text-red-500 animate-pulse';
    if (currentTime <= 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  const handleStartStop = () => {
    if (isTimerRunning()) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  if (!bomb) return null;

  return (
    <div className={`${className}`}>
      <div className="bg-black rounded-lg p-4 border-2 border-red-500">
        <div className="text-center">
          <div className={`text-4xl font-mono font-bold ${getTimerColor()}`}>
            {formatTime(currentTime)}
          </div>
          {showControls && (
            <button
              onClick={handleStartStop}
              className={`mt-3 px-4 py-2 rounded-lg font-bold transition-colors ${
                isTimerRunning()
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isTimerRunning() ? '⏸️ Stop' : '▶️ Start'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}