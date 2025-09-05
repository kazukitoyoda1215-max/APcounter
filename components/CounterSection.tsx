
import React from 'react';
import type { CounterState, CounterCategory } from '../types';
import CounterCard from './CounterCard';

interface CounterSectionProps {
  counts: CounterState;
  onIncrement: (category: CounterCategory) => void;
  onDecrement: (category: CounterCategory) => void;
  onCountChange: (category: CounterCategory, value: number) => void;
  onClear: () => void;
  lastSaveTime: string;
}

const counterCategories: { key: CounterCategory, label: string }[] = [
  { key: 'okMain', label: 'OK (主商材)' },
  { key: 'okElectricity', label: 'OK (電気)' },
  { key: 'ng', label: 'NG' },
  { key: 'ps', label: '見込み' },
  { key: 'na', label: '留守' },
  { key: 'ex', label: '対象外' },
];

const CounterSection: React.FC<CounterSectionProps> = ({ counts, onIncrement, onDecrement, onClear, lastSaveTime, onCountChange }) => {
  return (
    <section className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">カウンター</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
        {counterCategories.map(({ key, label }) => {
          const isEditable = key === 'okMain' || key === 'okElectricity';
          return (
            <CounterCard
              key={key}
              label={label}
              count={counts[key]}
              onIncrement={() => onIncrement(key)}
              onDecrement={() => onDecrement(key)}
              isEditable={isEditable}
              onCountChange={isEditable ? (value) => onCountChange(key, value) : undefined}
            />
          );
        })}
      </div>
      <div className="flex gap-3 justify-end items-center pt-2">
        <span className="text-sm text-slate-500 mr-auto h-5">{lastSaveTime}</span>
        <button 
            onClick={onClear} 
            className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          当日データをクリア
        </button>
      </div>
    </section>
  );
};

export default CounterSection;
