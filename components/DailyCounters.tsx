

import React from 'react';
import type { CounterState } from '../types';

interface DailyCounterCardProps {
  label: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onCountChange: (value: number) => void;
}

const DailyCounterCard: React.FC<DailyCounterCardProps> = ({ label, count, onIncrement, onDecrement, onCountChange }) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onCountChange(isNaN(value) ? 0 : value);
  };
    
  return (
    <div className="neumorphic-card-inner p-3 flex flex-col justify-between text-center">
      <div className="font-medium text-color-light truncate">{label}</div>
        <input
            type="number"
            value={count}
            onChange={handleInputChange}
            className="w-full text-center text-4xl font-bold text-color-dark my-2 bg-transparent form-input-neumorphic"
            aria-label={`${label} count input`}
            min="0"
        />
      <div className="mt-1 grid grid-cols-2 gap-2">
        <button 
          onClick={onDecrement} 
          className="w-full px-3 py-1.5 btn-neumorphic font-bold"
          aria-label={`Decrement ${label}`}
        >
          -
        </button>
        <button 
          onClick={onIncrement} 
          className="w-full px-3 py-1.5 btn-gradient text-base"
          aria-label={`Increment ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
};


interface DailyCountersProps {
  counts: CounterState;
  onIncrement: (category: keyof CounterState) => void;
  onDecrement: (category: keyof CounterState) => void;
  onCountChange: (category: keyof CounterState, value: number) => void;
  onClear: () => void;
  lastSaveTime: string;
}

const counterCategories: { key: keyof CounterState, label: string }[] = [
  { key: 'okMain', label: 'OK (主商材)' },
  { key: 'okElectricity', label: 'OK (電気)' },
  { key: 'ng', label: 'NG' },
  { key: 'ps', label: '見込み' },
  { key: 'na', label: '留守' },
  { key: 'ex', label: '対象外' },
  { key: 'callsMade', label: 'コール数' },
  { key: 'callsReceived', label: '入電数' },
];

const DailyCounters: React.FC<DailyCountersProps> = ({ counts, onIncrement, onDecrement, onCountChange, onClear, lastSaveTime }) => {
  return (
    <section id="daily-counters-section" className="neumorphic-card p-4 sm:p-5 space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-color-dark">カウンター</h2>
        <span className="text-sm text-color-light h-5">{lastSaveTime}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
        {counterCategories.map(({ key, label }) => (
            <DailyCounterCard
              key={key}
              label={label}
              count={counts[key]}
              onIncrement={() => onIncrement(key)}
              onDecrement={() => onDecrement(key)}
              onCountChange={(value) => onCountChange(key, value)}
            />
        ))}
      </div>
      <div className="flex justify-end items-center pt-2">
        <button 
            onClick={onClear} 
            className="btn-neumorphic px-4 py-2 font-semibold text-sm text-color-danger"
        >
          当日データをクリア
        </button>
      </div>
    </section>
  );
};

export default DailyCounters;