import React from 'react';
import type { IndependentCounterCategory } from '../types';

interface IndependentCounterProps {
  label: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const IndependentCounter: React.FC<IndependentCounterProps> = ({ label, count, onIncrement, onDecrement }) => {
  return (
    <div className="rounded-xl border bg-white/50 p-3 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="mb-2 sm:mb-0">
        <div className="text-sm text-slate-500">{label}</div>
        <div className="text-2xl font-bold text-slate-900">{count}</div>
      </div>
      <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:max-w-[120px]">
         <button 
          onClick={onDecrement} 
          className="w-full px-3 py-1.5 rounded-md bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
          aria-label={`Decrement ${label}`}
        >
          -
        </button>
        <button 
          onClick={onIncrement} 
          className="w-full px-3 py-1.5 rounded-md bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label={`Increment ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )
}


interface IndependentCounterSectionProps {
  callsMade: number;
  callsReceived: number;
  onIncrement: (category: IndependentCounterCategory) => void;
  onDecrement: (category: IndependentCounterCategory) => void;
}

const IndependentCounterSection: React.FC<IndependentCounterSectionProps> = ({ callsMade, callsReceived, onIncrement, onDecrement }) => {
  return (
    <section className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">コールトラッカー</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <IndependentCounter 
            label="コール数"
            count={callsMade}
            onIncrement={() => onIncrement('callsMade')}
            onDecrement={() => onDecrement('callsMade')}
        />
        <IndependentCounter 
            label="入電数"
            count={callsReceived}
            onIncrement={() => onIncrement('callsReceived')}
            onDecrement={() => onDecrement('callsReceived')}
        />
      </div>
    </section>
  );
};

export default IndependentCounterSection;
