'use client';

import React, { useState } from 'react';
import { useBomb } from '@/lib/bomb-context';
import { storage } from '@/lib/storage';

interface BombDisplayProps {
  onEdit: () => void;
  onReset: () => void;
  onContinue: () => void;
}

export default function BombDisplay({ onEdit, onReset, onContinue }: BombDisplayProps) {
  const { bomb, addStrike, resetStrikes } = useBomb();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  if (!bomb) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveName.trim()) return;

    storage.saveBomb(saveName, bomb);
    setSaveMessage('Bomb saved successfully!');
    setShowSaveDialog(false);
    setSaveName('');

    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleAddStrike = () => {
    addStrike();
  };

  const handleResetStrikes = () => {
    resetStrikes();
  };

  const serialContainsVowel = /[AEIOU]/.test(bomb.serialNumber);
  const serialLastDigitIsOdd = /\d$/.test(bomb.serialNumber) && parseInt(bomb.serialNumber.slice(-1)) % 2 === 1;
  const serialEvenDigit = /\d$/.test(bomb.serialNumber) && parseInt(bomb.serialNumber.slice(-1)) % 2 === 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800 rounded-lg p-8 shadow-xl border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Bomb Status</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowSaveDialog(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              💾 Save Bomb
            </button>
            <button
              onClick={onEdit}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              ✏️ Edit
            </button>
          </div>
        </div>

        {saveMessage && (
          <div className="mb-4 bg-green-500/20 border border-green-500 text-green-400 px-4 py-2 rounded-lg text-center">
            {saveMessage}
          </div>
        )}

        {/* Strikes */}
        <div className="mb-8 bg-slate-700 rounded-lg p-6 border border-slate-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Strikes</h3>
            <div className="flex gap-2">
              {bomb.strikes > 0 && (
                <button
                  onClick={handleResetStrikes}
                  className="bg-slate-600 hover:bg-slate-500 text-white text-sm py-1 px-3 rounded-lg transition-colors"
                >
                  Reset Strikes
                </button>
              )}
              {bomb.strikes < 3 && (
                <button
                  onClick={handleAddStrike}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded-lg transition-colors"
                >
                  + Add Strike
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            {[1, 2, 3].map((strike) => (
              <div
                key={strike}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
                  strike <= bomb.strikes
                    ? 'bg-red-500 text-white scale-110'
                    : 'bg-slate-600 text-slate-400'
                }`}
              >
                {strike <= bomb.strikes ? '💥' : '○'}
              </div>
            ))}
          </div>
          {bomb.strikes === 3 && (
            <p className="text-center text-red-400 font-bold mt-4 animate-pulse">
              💀 EXPLOSION IMMINENT!
            </p>
          )}
        </div>

        {/* Bomb Details */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Serial Number */}
          <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <h3 className="text-lg font-bold text-white mb-3">Serial Number</h3>
            <p className="text-3xl font-mono font-bold text-blue-400 mb-4">{bomb.serialNumber}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Contains Vowel:</span>
                <span
                  className={`font-bold ${serialContainsVowel ? 'text-green-400' : 'text-red-400'}`}
                >
                  {serialContainsVowel ? '✓ YES' : '✗ NO'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Last Digit Odd:</span>
                <span className={`font-bold ${serialLastDigitIsOdd ? 'text-green-400' : 'text-red-400'}`}>
                  {serialLastDigitIsOdd ? '✓ YES' : '✗ NO'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Last Digit Even:</span>
                <span className={`font-bold ${serialEvenDigit ? 'text-green-400' : 'text-red-400'}`}>
                  {serialEvenDigit ? '✓ YES' : '✗ NO'}
                </span>
              </div>
            </div>
          </div>

          {/* Batteries */}
          <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <h3 className="text-lg font-bold text-white mb-3">Batteries</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="flex gap-2">
                {[...Array(bomb.batteries)].map((_, i) => (
                  <div key={i} className="text-3xl">🔋</div>
                ))}
                {bomb.batteries === 0 && <span className="text-slate-400 text-lg">No batteries</span>}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Total:</span>
                <span className="text-white font-bold">{bomb.batteries}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">More than 1:</span>
                <span className={`font-bold ${bomb.batteries > 1 ? 'text-green-400' : 'text-red-400'}`}>
                  {bomb.batteries > 1 ? '✓ YES' : '✗ NO'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">More than 2:</span>
                <span className={`font-bold ${bomb.batteries > 2 ? 'text-green-400' : 'text-red-400'}`}>
                  {bomb.batteries > 2 ? '✓ YES' : '✗ NO'}
                </span>
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <h3 className="text-lg font-bold text-white mb-3">Indicators</h3>
            {bomb.indicators.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {bomb.indicators.map((indicator) => (
                  <span
                    key={indicator}
                    className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-lg font-mono font-bold border border-amber-500/50"
                  >
                    {indicator}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 mb-4">No indicators present</p>
            )}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Lit CAR:</span>
                <span
                  className={`font-bold ${bomb.indicators.includes('CAR') ? 'text-green-400' : 'text-red-400'}`}
                >
                  {bomb.indicators.includes('CAR') ? '✓ YES' : '✗ NO'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Lit FRK:</span>
                <span
                  className={`font-bold ${bomb.indicators.includes('FRK') ? 'text-green-400' : 'text-red-400'}`}
                >
                  {bomb.indicators.includes('FRK') ? '✓ YES' : '✗ NO'}
                </span>
              </div>
            </div>
          </div>

          {/* Ports */}
          <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <h3 className="text-lg font-bold text-white mb-3">Ports</h3>
            {bomb.ports.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {bomb.ports.map((port) => (
                  <span
                    key={port}
                    className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg font-mono font-bold border border-green-500/50"
                  >
                    {port.toUpperCase()}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 mb-4">No ports present</p>
            )}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Parallel Port:</span>
                <span
                  className={`font-bold ${bomb.ports.includes('parallel') ? 'text-green-400' : 'text-red-400'}`}
                >
                  {bomb.ports.includes('parallel') ? '✓ YES' : '✗ NO'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">DVI-D Port:</span>
                <span
                  className={`font-bold ${bomb.ports.includes('dvid') ? 'text-green-400' : 'text-red-400'}`}
                >
                  {bomb.ports.includes('dvid') ? '✓ YES' : '✗ NO'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={onContinue}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            🎯 Start Defusal
          </button>
          <button
            onClick={onReset}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-red-500"
          >
            🔄 Return to Menu
          </button>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl border border-slate-600">
            <h3 className="text-xl font-bold text-white mb-4">Save Bomb</h3>
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label htmlFor="saveName" className="block text-sm font-medium text-slate-300 mb-2">
                  Save Name
                </label>
                <input
                  id="saveName"
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="My Bomb #1"
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSaveDialog(false);
                    setSaveName('');
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors border border-slate-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
