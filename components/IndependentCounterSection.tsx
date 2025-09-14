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
    <div className="neumorphic-card-inner p-3 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="mb-2 sm:mb-0">
        <div className="text-sm text-color-light">{label}</div>
        <div className="text-2xl font-bold text-gradient">{count}</div>
      </div>
      <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:max-w-[120px]">
         <button 
          onClick={onDecrement} 
          className="w-full px-3 py-1.5 rounded-md btn-neumorphic font-bold"
          aria-label={`Decrement ${label}`}
        >
          -
        </button>
        <button 
          onClick={onIncrement} 
          className="w-full px-3 py-1.5 rounded-md btn-gradient text-base"
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
    <section className="neumorphic-card p-4 sm:p-5 space-y-4">
      <h2 className="text-lg font-semibold text-color-dark">コールトラッカー</h2>
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