import React from 'react';
import type { CounterState } from '../types';

interface CounterCardProps {
  label: string;
  count: number;
  diff: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const CounterCard: React.FC<CounterCardProps> = ({ label, count, diff, onIncrement, onDecrement }) => {
  const diffColor = diff > 0 ? 'text-color-success' : diff < 0 ? 'text-color-danger' : 'text-color-light';
  const diffSign = diff > 0 ? '+' : '';
  
  return (
    <div className="neumorphic-card-inner p-3 flex flex-col justify-between text-center">
      <div className="font-medium text-color-light">{label}</div>
      <div className="text-4xl text-gradient my-2">{count}</div>
      <div className="flex justify-between items-center mt-2">
        <div className="text-xs w-1/3 text-left">
           <span className={diffColor}>{diff !== 0 ? `(前日比: ${diffSign}${diff})` : ''}</span>
        </div>
        <div className="w-1/3 flex gap-2">
            <button onClick={onDecrement} className="w-full py-1 btn-neumorphic font-bold">-</button>
            <button onClick={onIncrement} className="w-full py-1 btn-gradient text-base">+</button>
        </div>
        <div className="w-1/3"></div>
      </div>
    </div>
  );
};

interface DetailedCountersProps {
  counts: CounterState;
  previousDayCounts: CounterState;
  onIncrement: (category: keyof CounterState) => void;
  onDecrement: (category: keyof CounterState) => void;
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

const DetailedCounters: React.FC<DetailedCountersProps> = ({ counts, previousDayCounts, onIncrement, onDecrement, lastSaveTime }) => {
  return (
    <section className="neumorphic-card p-4 sm:p-5 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-color-dark">詳細カウンター</h2>
        <span className="text-sm text-color-light mr-auto pl-6 h-5">{lastSaveTime}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        {counterCategories.map(({ key, label }) => (
            <CounterCard
              key={key}
              label={label}
              count={counts[key]}
              diff={counts[key] - previousDayCounts[key]}
              onIncrement={() => onIncrement(key)}
              onDecrement={() => onDecrement(key)}
            />
        ))}
      </div>
    </section>
  );
};

export default DetailedCounters;
