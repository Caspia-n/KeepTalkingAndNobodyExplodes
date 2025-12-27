'use client';

import React, { useState, useEffect } from 'react';
import { useBomb } from '@/lib/bomb-context';
import { ModuleId } from '@/types/bomb';
import { Question } from '@/types/module';
import { getModule, MODULE_NAMES } from '@/lib/modules';

interface ModuleSolverProps {
  moduleId: ModuleId;
  onComplete: () => void;
  onError: () => void;
}

type AnswerType = string | string[] | boolean | number;

export default function ModuleSolver({ moduleId, onComplete, onError }: ModuleSolverProps) {
  const { bomb, setModuleSolved, addModuleStrike } = useBomb();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerType>>({});
  const [error, setError] = useState<string | null>(null);
  const [solution, setSolution] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const module = getModule(moduleId);
  if (!bomb || !module) return null;

  const questions = module.getQuestions?.(bomb) || [];
  const filteredQuestions = questions.filter(
    q => !q.condition || q.condition(answers)
  );

  const currentQuestion = filteredQuestions[currentStep];
  const totalSteps = filteredQuestions.length;
  const isLastStep = currentStep === totalSteps - 1;
  const hasVisitedAllSteps = Object.keys(answers).length >= questions.length;

  useEffect(() => {
    // Reset when module changes
    setCurrentStep(0);
    setAnswers({});
    setError(null);
    setSolution(null);
    setShowSuccess(false);
  }, [moduleId]);

  const handleAnswerChange = (value: AnswerType) => {
    if (currentQuestion) {
      const newAnswers = { ...answers, [currentQuestion.id]: value };
      setAnswers(newAnswers);
      
      // Try to solve if all questions answered
      if (Object.keys(newAnswers).length >= questions.length) {
        trySolve(newAnswers);
      }
    }
  };

  const trySolve = (answersToUse: Record<string, AnswerType>) => {
    try {
      const result = module.solve?.(bomb, answersToUse);
      if (result) {
        setSolution(result.solution || 'Complete');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const goNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setError(null);
    } else if (currentQuestion) {
      // If this was the last question, try to solve
      const newAnswers = { ...answers, [currentQuestion.id]: currentQuestion.type === 'boolean' ? false : '' };
      setAnswers(newAnswers);
      trySolve(newAnswers);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleMarkSolved = () => {
    setModuleSolved(moduleId);
    setShowSuccess(true);
    onComplete();
  };

  const handleAddStrike = () => {
    addModuleStrike(moduleId);
    onError();
  };

  if (showSuccess) {
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
        </div>
      </div>
    );
  }

  if (solution && hasVisitedAllSteps) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="bg-slate-700 px-6 py-4 border-b border-slate-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{MODULE_NAMES[moduleId]}</h2>
              <p className="text-slate-400 text-sm mt-1">{module.info.description}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-lg border-2 border-green-500 bg-green-500/10 p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-3">Solution Found!</h3>
            <div className="text-lg text-white font-medium">
              {solution || 'Complete'}
            </div>
          </div>

          <div className="flex items-center justify-between">
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

      {/* Progress */}
      <div className="px-6 py-3 bg-slate-700/50 border-b border-slate-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Question</span>
            <span className="text-white font-bold">{currentStep + 1}</span>
            <span className="text-slate-400 text-sm">of</span>
            <span className="text-white font-bold">{totalSteps}</span>
          </div>
          <div className="flex gap-1">
            {filteredQuestions.map((_, idx) => (
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

      {/* Question */}
      {currentQuestion && (
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-white font-bold mb-3">
              {currentQuestion.description || currentQuestion.label}
            </label>

            <div className="space-y-3">
              {currentQuestion.type === 'select' && currentQuestion.options && (
                currentQuestion.options.map((option) => (
                  <label key={option} className="flex items-center gap-3 p-3 rounded-lg border border-slate-600 bg-slate-700 cursor-pointer hover:bg-slate-600">
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={() => handleAnswerChange(option)}
                      className="text-blue-500"
                    />
                    <span className="text-white">{option}</span>
                  </label>
                ))
              )}

              {currentQuestion.type === 'multi-select' && currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option) => (
                    <label key={option} className="flex items-center gap-3 p-3 rounded-lg border border-slate-600 bg-slate-700 cursor-pointer hover:bg-slate-600">
                      <input
                        type="checkbox"
                        name={`${currentQuestion.id}-${option}`}
                        value={option}
                        checked={Array.isArray(answers[currentQuestion.id]) && (answers[currentQuestion.id] as string[]).includes(option)}
                        onChange={(e) => {
                          const currentValue = (answers[currentQuestion.id] as string[]) || [];
                          const newValue = e.target.checked
                            ? [...currentValue, option]
                            : currentValue.filter(item => item !== option);
                          handleAnswerChange(newValue);
                        }}
                        className="text-blue-500"
                      />
                      <span className="text-white">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'boolean' && (
                <div className="flex gap-3">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-600 bg-slate-700 cursor-pointer hover:bg-slate-600">
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value="true"
                      checked={answers[currentQuestion.id] === true}
                      onChange={() => handleAnswerChange(true)}
                      className="text-blue-500"
                    />
                    <span className="text-white">Yes</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-600 bg-slate-700 cursor-pointer hover:bg-slate-600">
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value="false"
                      checked={answers[currentQuestion.id] === false}
                      onChange={() => handleAnswerChange(false)}
                      className="text-blue-500"
                    />
                    <span className="text-white">No</span>
                  </label>
                </div>
              )}

              {currentQuestion.type === 'text' && (
                <input
                  type="text"
                  placeholder="Enter answer..."
                  value={(answers[currentQuestion.id] as string) || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              ← Back
            </button>

            <button
              onClick={goNext}
              className={`px-6 py-2 ${isLastStep ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg font-medium transition-colors`}
            >
              {isLastStep ? 'Solve →' : 'Next →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}