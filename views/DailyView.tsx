
import React, { useState, useEffect } from 'react';
import type { CounterState, OneClickActionCategory } from '../types';
import ReportingConsole from '../components/ReportingConsole';
import DailyCounters from '../components/DailyCounters';
import DailyGoalsDashboard from '../components/DailyGoalsDashboard';
import CallControl from '../components/CallControl';

interface DailyViewProps {
  onOneClickAction: (category: OneClickActionCategory) => void;
  counts: CounterState;
  dailyGoal: number;
  dailyStreak: number;
  onIncrement: (category: keyof CounterState) => void;
  onDecrement: (category: keyof CounterState) => void;
  onCountChange: (category: keyof CounterState, value: number) => void;
  onClear: () => void;
  lastSaveTime: string;
  previewText: string;
}

const DailyView: React.FC<DailyViewProps> = (props) => {
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: number | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isTimerRunning]);

  const handleTimerStart = () => setIsTimerRunning(true);
  const handleTimerStop = () => setIsTimerRunning(false);

  const handleActionClick = (category: OneClickActionCategory) => {
    props.onOneClickAction(category);
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  return (
    <main className="space-y-6">
      <CallControl
        timerSeconds={timerSeconds}
        isTimerRunning={isTimerRunning}
        onTimerStart={handleTimerStart}
        onTimerStop={handleTimerStop}
        onOneClickAction={handleActionClick}
      />
      <DailyCounters
        counts={props.counts}
        onIncrement={props.onIncrement}
        onDecrement={props.onDecrement}
        onCountChange={props.onCountChange}
        onClear={props.onClear}
        lastSaveTime={props.lastSaveTime}
      />
      <DailyGoalsDashboard 
        dailyGoal={props.dailyGoal}
        currentOks={props.counts.okMain + props.counts.okElectricity}
        dailyStreak={props.dailyStreak}
      />
      <ReportingConsole textToCopy={props.previewText} />
    </main>
  );
};

export default DailyView;
