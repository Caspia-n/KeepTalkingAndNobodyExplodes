'use client';

import React from 'react';
import { useBomb } from '@/lib/bomb-context';

interface StrikeCounterProps {
  onStrikeAdded?: () => void;
  compact?: boolean;
}

export default function StrikeCounter({ onStrikeAdded, compact = false }: StrikeCounterProps) {
  const { bomb, addStrike, resetStrikes } = useBomb();

  if (!bomb) return null;

  const handleAddStrike = () => {
    addStrike();
    onStrikeAdded?.();
  };

  const handleReset = () => {
    resetStrikes();
  };

  const getStrikeColor = () => {
    if (bomb.strikes === 0) return 'text-green-400';
    if (bomb.strikes === 1) return 'text-yellow-400';
    if (bomb.strikes === 2) return 'text-orange-400';
    return 'text-red-400';
  };

  const isGameOver = bomb.strikes >= 3;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {[1, 2, 3].map((strike) => (
            <div
              key={strike}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                strike <= bomb.strikes
                  ? 'bg-red-500 text-white scale-110'
                  : 'bg-slate-600 text-slate-400'
              }`}
            >
              {strike <= bomb.strikes ? '💥' : '○'}
            </div>
          ))}
        </div>
        <span className={`font-bold ${getStrikeColor()}`}>
          {bomb.strikes}/3
        </span>
        {bomb.strikes < 3 && (
          <button
            onClick={handleAddStrike}
            className="text-red-400 hover:text-red-300 text-xs underline"
          >
            + Strike
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Strikes</h3>
        <div className="flex gap-2">
          {bomb.strikes > 0 && (
            <button
              onClick={handleReset}
              className="bg-slate-600 hover:bg-slate-500 text-white text-sm py-1 px-3 rounded-lg transition-colors"
            >
              Reset
            </button>
          )}
          {bomb.strikes < 3 && (
            <button
              onClick={handleAddStrike}
              className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded-lg transition-colors flex items-center gap-1"
            >
              <span>+ Add Strike</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-4 justify-center mb-4">
        {[1, 2, 3].map((strike) => (
          <div
            key={strike}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold transition-all ${
              strike <= bomb.strikes
                ? 'bg-red-500 text-white scale-110'
                : 'bg-slate-600 text-slate-400'
            }`}
          >
            {strike <= bomb.strikes ? '💥' : '○'}
          </div>
        ))}
      </div>

      <div className="text-center">
        <span className={`text-2xl font-bold ${getStrikeColor()}`}>
          {bomb.strikes} / 3 Strikes
        </span>
      </div>

      {isGameOver && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-center text-red-400 font-bold animate-pulse">
            💀 EXPLOSION! Game Over!
          </p>
        </div>
      )}
    </div>
  );
}
