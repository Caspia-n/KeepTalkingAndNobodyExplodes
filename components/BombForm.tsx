'use client';

import React, { useState } from 'react';
import { useBomb } from '@/lib/bomb-context';
import { Indicator, PortType } from '@/types/bomb';

const INDICATORS: Indicator[] = ['FRK', 'FRQ', 'CAR', 'IND', 'SIG', 'NSA', 'MSA', 'TRN', 'BOB', 'CLR', 'SND'];

const PORTS: PortType[] = ['parallel', 'ps2', 'rj45', 'serial', 'usb', 'dvid', 'stereo_rca', 'empty'];

export default function BombForm({ onCancel }: { onCancel: () => void }) {
  const { bomb, createBomb, updateBomb } = useBomb();
  const [serialNumber, setSerialNumber] = useState(bomb?.serialNumber || '');
  const [batteries, setBatteries] = useState(bomb?.batteries || 0);
  const [indicators, setIndicators] = useState<Indicator[]>(bomb?.indicators || []);
  const [ports, setPorts] = useState<PortType[]>(bomb?.ports || []);
  const [strikes, setStrikes] = useState(bomb?.strikes || 0);
  const [timerMinutes, setTimerMinutes] = useState<number>(() => {
    const timer = bomb?.timer || '5:00';
    return parseInt(timer.split(':')[0]);
  });
  const [timerSeconds, setTimerSeconds] = useState<number>(() => {
    const timer = bomb?.timer || '5:00';
    return parseInt(timer.split(':')[1]);
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!serialNumber) {
      newErrors.serialNumber = 'Serial number is required';
    } else if (!/^[A-Z0-9]{6}$/i.test(serialNumber)) {
      newErrors.serialNumber = 'Serial number must be exactly 6 alphanumeric characters';
    }

    if (batteries < 0 || batteries > 6) {
      newErrors.batteries = 'Number of batteries must be between 0 and 6';
    }

    if (strikes < 0 || strikes > 3) {
      newErrors.strikes = 'Number of strikes must be between 0 and 3';
    }

    if (timerMinutes < 0 || timerMinutes > 59) {
      newErrors.timer = 'Minutes must be between 0 and 59';
    }

    if (timerSeconds < 0 || timerSeconds > 59) {
      newErrors.timer = 'Seconds must be between 0 and 59';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const timer = `${timerMinutes.toString().padStart(1, '0')}:${timerSeconds.toString().padStart(2, '0')}`;

    if (bomb) {
      updateBomb({
        serialNumber,
        batteries,
        indicators,
        ports,
        strikes,
        timer,
      });
    } else {
      createBomb({
        serialNumber,
        batteries,
        indicators,
        ports,
        strikes,
        timer,
      });
    }
  };

  const toggleIndicator = (indicator: Indicator) => {
    setIndicators((prev) =>
      prev.includes(indicator) ? prev.filter((i) => i !== indicator) : [...prev, indicator]
    );
  };

  const togglePort = (port: PortType) => {
    setPorts((prev) => (prev.includes(port) ? prev.filter((p) => p !== port) : [...prev, port]));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-8 shadow-xl border border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-6">
          {bomb ? 'Edit Bomb' : 'New Bomb Setup'}
        </h2>

        <div className="grid gap-6">
          {/* Serial Number */}
          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-slate-300 mb-2">
              Serial Number
            </label>
            <input
              id="serialNumber"
              type="text"
              value={serialNumber}
              onChange={(e) => {
                const upper = e.target.value.toUpperCase();
                setSerialNumber(upper.slice(0, 6));
                if (errors.serialNumber) setErrors({ ...errors, serialNumber: '' });
              }}
              placeholder="ABC123"
              className={`w-full px-4 py-3 rounded-lg bg-slate-700 border ${
                errors.serialNumber ? 'border-red-500' : 'border-slate-600'
              } text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase`}
              maxLength={6}
            />
            {errors.serialNumber && <p className="mt-2 text-sm text-red-400">{errors.serialNumber}</p>}
          </div>

          {/* Batteries */}
          <div>
            <label htmlFor="batteries" className="block text-sm font-medium text-slate-300 mb-2">
              Number of Batteries: <span className="text-blue-400 font-bold">{batteries}</span>
            </label>
            <input
              id="batteries"
              type="range"
              min="0"
              max="6"
              value={batteries}
              onChange={(e) => {
                setBatteries(parseInt(e.target.value));
                if (errors.batteries) setErrors({ ...errors, batteries: '' });
              }}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
            </div>
          </div>

          {/* Indicators */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Indicators ({indicators.length} selected)
            </label>
            <div className="flex flex-wrap gap-2">
              {INDICATORS.map((indicator) => (
                <button
                  key={indicator}
                  type="button"
                  onClick={() => toggleIndicator(indicator)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    indicators.includes(indicator)
                      ? 'bg-amber-500 text-black hover:bg-amber-400'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
                  }`}
                >
                  {indicator}
                </button>
              ))}
            </div>
          </div>

          {/* Ports */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Ports ({ports.length} selected)
            </label>
            <div className="flex flex-wrap gap-2">
              {PORTS.map((port) => (
                <button
                  key={port}
                  type="button"
                  onClick={() => togglePort(port)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    ports.includes(port)
                      ? 'bg-green-500 text-black hover:bg-green-400'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
                  }`}
                >
                  {port.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Strikes */}
          <div>
            <label htmlFor="strikes" className="block text-sm font-medium text-slate-300 mb-2">
              Number of Strikes: <span className="text-red-400 font-bold">{strikes}/3</span>
            </label>
            <div className="flex gap-3">
              {[0, 1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setStrikes(num);
                    if (errors.strikes) setErrors({ ...errors, strikes: '' });
                  }}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                    strikes === num
                      ? 'bg-red-500 text-white scale-105'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Timer */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Bomb Timer
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Minutes:</span>
                <input
                  id="timerMinutes"
                  type="number"
                  min="0"
                  max="59"
                  value={timerMinutes}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
                    setTimerMinutes(value);
                    if (errors.timer) setErrors({ ...errors, timer: '' });
                  }}
                  className="w-20 px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <span className="text-white font-bold text-xl">:</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Seconds:</span>
                <input
                  id="timerSeconds"
                  type="number"
                  min="0"
                  max="59"
                  value={timerSeconds}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
                    setTimerSeconds(value);
                    if (errors.timer) setErrors({ ...errors, timer: '' });
                  }}
                  className="w-20 px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <span className="font-mono text-blue-400 font-bold">
                {`${timerMinutes.toString().padStart(1, '0')}:${timerSeconds.toString().padStart(2, '0')}`}
              </span>
            </div>
            {errors.timer && <p className="mt-2 text-sm text-red-400">{errors.timer}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {bomb ? 'Save Changes' : 'Start Defusal'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-slate-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
