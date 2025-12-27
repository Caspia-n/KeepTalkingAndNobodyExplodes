'use client';

import { useState } from 'react';
import { BombProvider } from '@/lib/bomb-context';
import BombMenu from '@/components/BombMenu';
import BombForm from '@/components/BombForm';
import BombDisplay from '@/components/BombDisplay';
import DefusalInterface from '@/components/DefusalInterface';

type View = 'menu' | 'form' | 'display' | 'defusal';

function AppContent() {
  const [view, setView] = useState<View>('menu');

  const handleStartNew = () => {
    setView('form');
  };

  const handleContinue = () => {
    setView('defusal');
  };

  const handleEdit = () => {
    setView('form');
  };

  const handleFormCancel = () => {
    setView('menu');
  };

  const handleReset = () => {
    setView('menu');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      {view === 'menu' && (
        <BombMenu
          onStartNew={handleStartNew}
          onContinue={handleContinue}
          onEdit={handleEdit}
        />
      )}
      {view === 'form' && <BombForm onCancel={handleFormCancel} />}
      {view === 'display' && <BombDisplay onEdit={handleEdit} onReset={handleReset} onContinue={handleContinue} />}
      {view === 'defusal' && (
        <DefusalInterface
          onEdit={handleEdit}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <BombProvider>
      <AppContent />
    </BombProvider>
  );
}
