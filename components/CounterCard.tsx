
import React from 'react';

interface CounterCardProps {
  label: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  isEditable?: boolean;
  onCountChange?: (value: number) => void;
}

const CounterCard: React.FC<CounterCardProps> = ({ label, count, onIncrement, onDecrement, isEditable, onCountChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onCountChange?.(isNaN(value) ? 0 : value);
  };
    
  return (
    <div className="rounded-xl border bg-white p-3 flex flex-col justify-between">
      <div className="font-medium text-slate-700">{label}</div>
      {isEditable ? (
        <input
            type="number"
            value={count}
            onChange={handleInputChange}
            className="w-full text-center text-4xl font-bold text-slate-900 my-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none border-gray-200 p-0"
            aria-label={`${label} count input`}
            min="0"
        />
      ) : (
        <div className="text-4xl font-bold text-slate-900 my-2">{count}</div>
      )}
      <div className="mt-2 grid grid-cols-2 gap-2">
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
  );
};

export default CounterCard;
