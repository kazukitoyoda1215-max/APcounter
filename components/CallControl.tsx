
import React from 'react';
import { OneClickActionCategory } from '../types';
import { PlayIcon, StopIcon } from './icons';

interface CallControlProps {
  timerSeconds: number;
  isTimerRunning: boolean;
  onTimerStart: () => void;
  onTimerStop: () => void;
  onOneClickAction: (category: OneClickActionCategory) => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const actionButtons: { label: string; category: OneClickActionCategory }[] = [
    { label: 'OK獲得', category: 'ok'},
    { label: 'NG', category: 'ng'},
    { label: '留守', category: 'na'},
    { label: '見込み', category: 'ps'},
];

const CallControl: React.FC<CallControlProps> = ({ timerSeconds, isTimerRunning, onTimerStart, onTimerStop, onOneClickAction }) => {
  return (
    <section className="neumorphic-card p-4 flex items-center justify-between flex-wrap gap-4">
      {/* Timer Section */}
      <div className="flex-grow flex flex-col items-center">
        <div className="text-5xl font-light text-color-dark tracking-widest">{formatTime(timerSeconds)}</div>
        <div className="flex items-center gap-3 mt-2">
            <button onClick={onTimerStart} disabled={isTimerRunning} className="btn-gradient p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Start Timer">
                <PlayIcon className="w-5 h-5 text-white" />
            </button>
            <button onClick={onTimerStop} disabled={!isTimerRunning} className="btn-neumorphic p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Stop Timer">
                <StopIcon className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="flex-grow flex items-center gap-2 flex-wrap justify-center">
         {actionButtons.map(({label, category}) => (
             <button key={category} onClick={() => onOneClickAction(category)} className="btn-action-topbar text-sm px-4 py-3 min-w-[90px]">
                {label}
             </button>
         ))}
      </div>
    </section>
  );
};

export default CallControl;
