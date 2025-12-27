'use client';

import React from 'react';
import { useBomb } from '@/lib/bomb-context';
import { MODULE_NAMES, MODULE_ORDER } from '@/lib/modules';
import { ModuleId } from '@/types/bomb';

interface ModuleSelectorProps {
  selectedModule: ModuleId | null;
  onSelectModule: (moduleId: ModuleId) => void;
}

export default function ModuleSelector({ selectedModule, onSelectModule }: ModuleSelectorProps) {
  const { bomb, getSolvedModules, isModuleSolved } = useBomb();

  if (!bomb) return null;

  const solvedCount = getSolvedModules().length;
  const totalCount = bomb.modules.length;

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Modules</h2>
        <div className="text-sm text-slate-400">
          {solvedCount} of {totalCount} solved
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-slate-700 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${(solvedCount / totalCount) * 100}%` }}
        />
      </div>

      {/* Module grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {MODULE_ORDER.map((moduleId) => {
          const solved = isModuleSolved(moduleId);
          const isSelected = selectedModule === moduleId;
          const isUnsolved = !solved;

          return (
            <button
              key={moduleId}
              onClick={() => onSelectModule(moduleId)}
              className={`relative px-4 py-3 rounded-lg font-medium transition-all text-left ${
                solved
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : isSelected
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="truncate">{MODULE_NAMES[moduleId]}</span>
                {solved && (
                  <span className="text-green-400">✓</span>
                )}
              </div>
              {isUnsolved && (
                <div className="mt-2 w-full h-1 bg-slate-600 rounded-full">
                  <div className="h-full bg-slate-500 rounded-full" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick stats */}
      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-slate-400">Solved: {solvedCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-500" />
          <span className="text-slate-400">Remaining: {totalCount - solvedCount}</span>
        </div>
      </div>
    </div>
  );
}
