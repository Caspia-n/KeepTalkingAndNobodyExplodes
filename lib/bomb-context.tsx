'use client';

import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { BombState, BombAction, BombContextType, Indicator, PortType } from '@/types/bomb';
import { storage } from './storage';

const BombContext = createContext<BombContextType | undefined>(undefined);

function bombReducer(state: BombState | null, action: BombAction): BombState | null {
  switch (action.type) {
    case 'CREATE_BOMB': {
      return {
        id: action.payload.id || crypto.randomUUID(),
        serialNumber: action.payload.serialNumber || '',
        batteries: action.payload.batteries || 0,
        indicators: action.payload.indicators || [],
        ports: action.payload.ports || [],
        strikes: action.payload.strikes || 0,
        createdAt: action.payload.createdAt || Date.now(),
        updatedAt: Date.now(),
      };
    }
    case 'UPDATE_BOMB': {
      if (!state) return null;
      return {
        ...state,
        ...action.payload,
        id: state.id,
        createdAt: state.createdAt,
        updatedAt: Date.now(),
      };
    }
    case 'SET_INDICATORS': {
      if (!state) return null;
      return { ...state, indicators: action.payload, updatedAt: Date.now() };
    }
    case 'TOGGLE_INDICATOR': {
      if (!state) return null;
      const exists = state.indicators.includes(action.payload);
      return {
        ...state,
        indicators: exists
          ? state.indicators.filter((ind) => ind !== action.payload)
          : [...state.indicators, action.payload],
        updatedAt: Date.now(),
      };
    }
    case 'SET_PORTS': {
      if (!state) return null;
      return { ...state, ports: action.payload, updatedAt: Date.now() };
    }
    case 'TOGGLE_PORT': {
      if (!state) return null;
      const exists = state.ports.includes(action.payload);
      return {
        ...state,
        ports: exists
          ? state.ports.filter((port) => port !== action.payload)
          : [...state.ports, action.payload],
        updatedAt: Date.now(),
      };
    }
    case 'ADD_STRIKE': {
      if (!state) return null;
      return { ...state, strikes: Math.min(state.strikes + 1, 3), updatedAt: Date.now() };
    }
    case 'RESET_STRIKES': {
      if (!state) return null;
      return { ...state, strikes: 0, updatedAt: Date.now() };
    }
    case 'CLEAR_BOMB': {
      return null;
    }
    case 'LOAD_BOMB': {
      return { ...action.payload, updatedAt: Date.now() };
    }
    default:
      return state;
  }
}

export function BombProvider({ children }: { children: ReactNode }) {
  const [bomb, dispatch] = useReducer(bombReducer, null);

  useEffect(() => {
    const savedBomb = storage.getCurrentBomb();
    if (savedBomb) {
      dispatch({ type: 'LOAD_BOMB', payload: savedBomb });
    }
  }, []);

  useEffect(() => {
    if (bomb) {
      storage.setCurrentBomb(bomb);
    } else {
      storage.clearCurrentBomb();
    }
  }, [bomb]);

  const createBomb = (data: Partial<BombState>) => {
    dispatch({ type: 'CREATE_BOMB', payload: data });
  };

  const updateBomb = (data: Partial<BombState>) => {
    dispatch({ type: 'UPDATE_BOMB', payload: data });
  };

  const setIndicators = (indicators: Indicator[]) => {
    dispatch({ type: 'SET_INDICATORS', payload: indicators });
  };

  const toggleIndicator = (indicator: Indicator) => {
    dispatch({ type: 'TOGGLE_INDICATOR', payload: indicator });
  };

  const setPorts = (ports: PortType[]) => {
    dispatch({ type: 'SET_PORTS', payload: ports });
  };

  const togglePort = (port: PortType) => {
    dispatch({ type: 'TOGGLE_PORT', payload: port });
  };

  const addStrike = () => {
    dispatch({ type: 'ADD_STRIKE' });
  };

  const resetStrikes = () => {
    dispatch({ type: 'RESET_STRIKES' });
  };

  const clearBomb = () => {
    dispatch({ type: 'CLEAR_BOMB' });
  };

  const loadBomb = (bomb: BombState) => {
    dispatch({ type: 'LOAD_BOMB', payload: bomb });
  };

  const hasActiveBomb = () => {
    return bomb !== null;
  };

  const value: BombContextType = {
    bomb,
    createBomb,
    updateBomb,
    setIndicators,
    toggleIndicator,
    setPorts,
    togglePort,
    addStrike,
    resetStrikes,
    clearBomb,
    loadBomb,
    hasActiveBomb,
  };

  return <BombContext.Provider value={value}>{children}</BombContext.Provider>;
}

export function useBomb() {
  const context = useContext(BombContext);
  if (context === undefined) {
    throw new Error('useBomb must be used within a BombProvider');
  }
  return context;
}
