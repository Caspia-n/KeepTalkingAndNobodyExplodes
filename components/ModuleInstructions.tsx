'use client';

import React, { useState } from 'react';
import { useBomb } from '@/lib/bomb-context';
import { ModuleId } from '@/types/bomb';
import { InstructionStep, StepType, ModuleLogic } from '@/types/module';
import { getModule, MODULE_NAMES } from '@/lib/modules';

interface ModuleInstructionsProps {
  moduleId: ModuleId;
  onModuleSolved: () => void;
  onAddStrike: () => void;
}

export default function ModuleInstructions({ moduleId, onModuleSolved, onAddStrike }: ModuleInstructionsProps) {
  const { bomb, setModuleSolved, addModuleStrike, isModuleSolved } = useBomb();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const module = getModule(moduleId);
  if (!bomb || !module) return null;

  const steps = module.getSteps(bomb as unknown as Parameters<typeof module.getSteps>[0]);
  const solved = isModuleSolved(moduleId);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleMarkSolved = () => {
    setModuleSolved(moduleId);
    setShowSuccess(true);
    onModuleSolved();
  };

  const handleAddStrike = () => {
    addModuleStrike(moduleId);
    onAddStrike();
  };

  const step = steps[currentStep];

  const getStepColor = (type: StepType) => {
    switch (type) {
      case 'info':
        return 'border-blue-500 bg-blue-500/10';
      case 'action':
        return 'border-green-500 bg-green-500/10';
      case 'warning':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'success':
        return 'border-green-500 bg-green-500/20';
      default:
        return 'border-slate-500 bg-slate-500/10';
    }
  };

  const getStepIcon = (type: StepType) => {
    switch (type) {
      case 'info':
        return 'ℹ️';
      case 'action':
        return '👆';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      default:
        return '📋';
    }
  };

  if (showSuccess || solved) {
    return (
      <div className="bg-slate-800 rounded-lg p-8 border border-green-500/50">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-green-400 mb-2">
            {MODULE_NAMES[moduleId]} Solved!
          </h2>
          <p className="text-slate-300 mb-6">
            Great job! This module has been marked as complete.
          </p>
          {!showSuccess && (
            <button
              onClick={() => setShowSuccess(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Mark as Solved
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-700 px-6 py-4 border-b border-slate-600">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{MODULE_NAMES[moduleId]}</h2>
            <p className="text-slate-400 text-sm mt-1">{module.info.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              module.info.difficulty === 'easy'
                ? 'bg-green-500/20 text-green-400'
                : module.info.difficulty === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
            }`}>
              {module.info.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="px-6 py-3 bg-slate-700/50 border-b border-slate-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Step</span>
            <span className="text-white font-bold">{currentStep + 1}</span>
            <span className="text-slate-400 text-sm">of</span>
            <span className="text-white font-bold">{steps.length}</span>
          </div>
          <div className="flex gap-1">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentStep
                    ? 'bg-blue-400'
                    : idx < currentStep
                      ? 'bg-green-400'
                      : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="p-6">
        <div className={`rounded-lg border-2 p-6 mb-6 ${getStepColor(step.type)}`}>
          <div className="flex items-start gap-4">
            <span className="text-3xl">{getStepIcon(step.type)}</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                {step.content}
              </div>
              {step.condition && (
                <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400 text-sm">Current conditions: </span>
                  <span className="text-blue-400 font-mono text-sm">{step.condition}</span>
                </div>
              )}
              {step.note && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <span className="text-blue-400 font-medium">📝 Note: </span>
                  <span className="text-blue-300">{step.note}</span>
                </div>
              )}
              {step.warning && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <span className="text-yellow-400 font-medium">⚠️ Warning: </span>
                  <span className="text-yellow-300">{step.warning}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 0
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            ← Previous
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleAddStrike}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Add Strike
            </button>
            <button
              onClick={handleMarkSolved}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              ✓ Mark Solved
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentStep === steps.length - 1
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Module info footer */}
      <div className="px-6 py-4 bg-slate-700/30 border-t border-slate-600">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Category: {module.info.category}</span>
          <span className="text-slate-400">Difficulty: {module.info.difficulty}</span>
        </div>
      </div>
    </div>
  );
}
