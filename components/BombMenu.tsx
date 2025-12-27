'use client';

import React, { useState } from 'react';
import { useBomb } from '@/lib/bomb-context';
import { storage } from '@/lib/storage';
import { SavedBomb } from '@/types/bomb';

type MenuView = 'main' | 'load';

export default function BombMenu({ onStartNew, onContinue, onEdit }: { onStartNew: () => void; onContinue: () => void; onEdit: () => void }) {
  const { bomb, hasActiveBomb, clearBomb, loadBomb } = useBomb();
  const [view, setView] = useState<MenuView>('main');
  const [savedBombs, setSavedBombs] = useState<SavedBomb[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleLoadView = () => {
    setSavedBombs(storage.getSavedBombs());
    setView('load');
  };

  const handleLoadBomb = (savedBomb: SavedBomb) => {
    loadBomb(savedBomb.bomb);
    onContinue();
  };

  const handleDeleteSavedBomb = (bombId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storage.deleteSavedBomb(bombId);
    setSavedBombs(storage.getSavedBombs());
  };

  const handleReset = () => {
    clearBomb();
    setShowResetConfirm(false);
    setView('main');
  };

  if (view === 'load') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-8 shadow-xl border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Load Saved Bomb</h2>
            <button
              onClick={() => setView('main')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ← Back
            </button>
          </div>

          {savedBombs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No saved bombs found</p>
              <button
                onClick={() => setView('main')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Go Back
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedBombs.map((savedBomb) => (
                <div
                  key={savedBomb.bomb.id}
                  className="bg-slate-700 rounded-lg p-6 border border-slate-600 hover:border-blue-500 transition-colors cursor-pointer group"
                  onClick={() => handleLoadBomb(savedBomb)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{savedBomb.name}</h3>
                      <p className="text-slate-400 mt-1">
                        Serial: {savedBomb.bomb.serialNumber} • Batteries: {savedBomb.bomb.batteries}
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        Saved: {new Date(savedBomb.savedAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteSavedBomb(savedBomb.bomb.id, e)}
                      className="opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800 rounded-lg p-8 shadow-xl border border-slate-700">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          Keep Talking and Nobody Explodes
        </h1>
        <p className="text-slate-400 text-center mb-8">Bomb Defusal Assistant</p>

        {hasActiveBomb() && bomb && (
          <div className="mb-8 bg-slate-700 rounded-lg p-6 border border-slate-600">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Current Bomb</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  bomb.strikes === 0
                    ? 'bg-green-500/20 text-green-400'
                    : bomb.strikes === 1
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : bomb.strikes === 2
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-red-500/20 text-red-400'
                }`}
              >
                {bomb.strikes} Strike{bomb.strikes !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Serial Number</p>
                <p className="text-white font-mono font-bold">{bomb.serialNumber}</p>
              </div>
              <div>
                <p className="text-slate-400">Batteries</p>
                <p className="text-white font-bold">{bomb.batteries}</p>
              </div>
              <div>
                <p className="text-slate-400">Indicators</p>
                <p className="text-white font-bold">{bomb.indicators.length}</p>
              </div>
              <div>
                <p className="text-slate-400">Ports</p>
                <p className="text-white font-bold">{bomb.ports.length}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onContinue}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Continue Defusal
              </button>
              <button
                onClick={onEdit}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Edit Bomb
              </button>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Reset Bomb
              </button>
            </div>
          </div>
        )}

        {!hasActiveBomb() && (
          <>
            <div className="space-y-4">
              <button
                onClick={onStartNew}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
              >
                🚨 Start New Bomb Defusal
              </button>
              <button
                onClick={handleLoadView}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg border border-slate-600"
              >
                📂 Load Saved Bomb
              </button>
            </div>

            <div className="mt-8 bg-slate-700/50 rounded-lg p-6 border border-slate-600">
              <h3 className="text-lg font-bold text-white mb-3">How to Play</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>• Start by entering your bomb&apos;s characteristics</li>
                <li>• Work with your team to defuse modules</li>
                <li>• One person sees the bomb, the other has the manual</li>
                <li>• Avoid strikes - 3 strikes and the bomb explodes!</li>
                <li>• Save your progress anytime to continue later</li>
              </ul>
            </div>
          </>
        )}

        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl border border-slate-600">
              <h3 className="text-xl font-bold text-white mb-4">Reset Bomb?</h3>
              <p className="text-slate-300 mb-6">
                Are you sure you want to reset this bomb? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Reset Bomb
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors border border-slate-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
