'use client';

import React, { useState, useEffect } from 'react';
import { useBomb } from '@/lib/bomb-context';
import { getModule } from '@/lib/modules';
import ModuleSelector from './ModuleSelector';
import ModuleInstructions from './ModuleInstructions';
import ModuleSolver from './ModuleSolver';
import StrikeCounter from './StrikeCounter';
import TimerDisplay from './TimerDisplay';
import { ModuleId } from '@/types/bomb';

type DefusalView = 'modules' | 'bomb';

export default function DefusalInterface({ onEdit, onReset }: { onEdit: () => void; onReset: () => void }) {
  const { bomb, resetModules, getSolvedModules } = useBomb();
  const [selectedModule, setSelectedModule] = useState<ModuleId | null>('wires');
  const [view, setView] = useState<DefusalView>('modules');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Check for game over when timer reaches 0
    const timerInterval = setInterval(() => {
      if (bomb?.timerRunning && bomb.timer === '0:00') {
        setGameOver(true);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [bomb]);

  if (!bomb) return null;

  const solvedCount = getSolvedModules().length;
  const totalCount = bomb.modules.length;
  const isVictory = solvedCount === totalCount && totalCount > 0;

  const handleModuleSelect = (moduleId: ModuleId) => {
    setSelectedModule(moduleId);
  };

  const handleModuleSolved = () => {
    // Module solved - check for victory
  };

  const handleAddStrike = () => {
    // Strike added - the context handles this
  };

  const handleResetModules = () => {
    resetModules();
    setSelectedModule('wires');
  };

  if (gameOver) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-8 shadow-xl border border-red-500/50">
          <div className="text-center">
            <div className="text-8xl mb-6 animate-pulse">💥</div>
            <h2 className="text-4xl font-bold text-red-400 mb-4">
              GAME OVER!
            </h2>
            <p className="text-xl text-slate-300 mb-6">
              The bomb exploded! {bomb.strikes} strike{bomb.strikes !== 1 ? 's' : ''} received.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleResetModules}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                🔄 Try Again
              </button>
              <button
                onClick={onReset}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-slate-600"
              >
                🏠 Return to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isVictory) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-8 shadow-xl border border-green-500/50">
          <div className="text-center">
            <div className="text-8xl mb-6 animate-bounce">🎉</div>
            <h2 className="text-4xl font-bold text-green-400 mb-4">
              BOMB DEFUSED!
            </h2>
            <p className="text-xl text-slate-300 mb-6">
              Congratulations! You successfully defused the bomb with {bomb.strikes} strike{bomb.strikes !== 1 ? 's' : ''}!
            </p>

            <div className="bg-slate-700 rounded-lg p-6 max-w-md mx-auto mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Defusal Summary</h3>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span>Serial Number:</span>
                  <span className="font-mono text-blue-400">{bomb.serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Batteries:</span>
                  <span className="font-bold">{bomb.batteries}</span>
                </div>
                <div className="flex justify-between">
                  <span>Indicators:</span>
                  <span className="font-bold">{bomb.indicators.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Modules Solved:</span>
                  <span className="font-bold text-green-400">{totalCount}/{totalCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Strikes:</span>
                  <span className={`font-bold ${bomb.strikes === 0 ? 'text-green-400' : bomb.strikes === 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {bomb.strikes}/3
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleResetModules}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                🔄 New Bomb
              </button>
              <button
                onClick={onReset}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-slate-600"
              >
                🏠 Return to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with Timer */}
      <div className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Defusal Progress</h1>
            <TimerDisplay className="ml-4" showControls />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView(view === 'modules' ? 'bomb' : 'modules')}
              className="px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white"
            >
              {view === 'modules' ? '💣 Bomb Info' : '📦 Modules'}
            </button>
            <button
              onClick={onEdit}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              ✏️ Edit
            </button>
          </div>
        </div>
      </div>

      {/* Progress summary */}
      <div className="bg-slate-700 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">
            Progress: <span className="text-white font-bold">{solvedCount}/{totalCount}</span> modules
          </span>
          <StrikeCounter compact />
        </div>
        <div className="w-full h-2 bg-slate-600 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${(solvedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {view === 'modules' ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Module selector */}
          <div className="lg:col-span-1">
            <ModuleSelector
              selectedModule={selectedModule}
              onSelectModule={handleModuleSelect}
            />
          </div>

          {/* Module solver/instructions */}
          <div className="lg:col-span-2">
            {selectedModule && (
              <>
                {getModule(selectedModule)?.validate ? (
                  <ModuleSolver
                    key={selectedModule}
                    moduleId={selectedModule}
                    onComplete={handleModuleSolved}
                    onError={handleAddStrike}
                  />
                ) : (
                  <ModuleInstructions
                    key={selectedModule}
                    moduleId={selectedModule}
                    onModuleSolved={handleModuleSolved}
                    onAddStrike={handleAddStrike}
                  />
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        /* Bomb info view */
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Serial Number</h3>
            <p className="text-4xl font-mono font-bold text-blue-400 mb-4">{bomb.serialNumber}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Vowel:</span>
                <span className={`${/[AEIOU]/i.test(bomb.serialNumber) ? 'text-green-400' : 'text-red-400'}`}>
                  {/[AEIOU]/i.test(bomb.serialNumber) ? '✓ Yes' : '✗ No'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Last digit odd:</span>
                <span className={`${/\d$/.test(bomb.serialNumber) && parseInt(bomb.serialNumber.slice(-1)) % 2 === 1 ? 'text-green-400' : 'text-red-400'}`}>
                  {/\d$/.test(bomb.serialNumber) && parseInt(bomb.serialNumber.slice(-1)) % 2 === 1 ? '✓ Yes' : '✗ No'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Batteries</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="flex gap-2 text-4xl">
                {[...Array(bomb.batteries)].map((_, i) => (
                  <span key={i}>🔋</span>
                ))}
                {bomb.batteries === 0 && <span className="text-slate-400 text-lg">No batteries</span>}
              </div>
            </div>
            <p className="text-center text-white font-bold text-2xl">{bomb.batteries} batteries</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Indicators</h3>
            {bomb.indicators.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {bomb.indicators.map((indicator) => (
                  <span
                    key={indicator}
                    className="bg-amber-500/20 text-amber-400 px-4 py-2 rounded-lg font-mono font-bold border border-amber-500/50"
                  >
                    {indicator}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">No indicators present</p>
            )}
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Ports</h3>
            {bomb.ports.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {bomb.ports.map((port) => (
                  <span
                    key={port}
                    className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-mono font-bold border border-green-500/50"
                  >
                    {port.toUpperCase()}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">No ports present</p>
            )}
          </div>

          <div className="md:col-span-2">
            <StrikeCounter />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 text-center">
        <button
          onClick={onReset}
          className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-colors border border-slate-600"
        >
          🏠 Return to Menu
        </button>
      </div>
    </div>
  );
}
