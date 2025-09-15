

import React from 'react';
import type { CounterState, OneClickActionCategory } from '../types';
import ReportingConsole from '../components/ReportingConsole';
import DailyCounters from '../components/DailyCounters';
import DailyGoalsDashboard from '../components/DailyGoalsDashboard';
import CallControl from '../components/CallControl';

interface DailyViewProps {
  onOneClickAction: (category: OneClickActionCategory) => void;
  counts: CounterState;
  dailyMainGoal: number;
  dailyElectricityGoal: number;
  dailyStreak: number;
  onIncrement: (category: keyof CounterState) => void;
  onDecrement: (category: keyof CounterState) => void;
  onCountChange: (category: keyof CounterState, value: number) => void;
  onClear: () => void;
  lastSaveTime: string;
  previewText: string;
  timerSeconds: number;
  isTimerRunning: boolean;
  onTimerStart: () => void;
  onTimerStop: () => void;
}

const DailyView: React.FC<DailyViewProps> = (props) => {
  return (
    <main className="space-y-6">
      <CallControl
        timerSeconds={props.timerSeconds}
        isTimerRunning={props.isTimerRunning}
        onTimerStart={props.onTimerStart}
        onTimerStop={props.onTimerStop}
        onOneClickAction={props.onOneClickAction}
      />
      <DailyCounters
        counts={props.counts}
        onIncrement={props.onIncrement}
        onDecrement={props.onDecrement}
        onCountChange={props.onCountChange}
        onClear={props.onClear}
        lastSaveTime={props.lastSaveTime}
      />
      <div className="hidable-container space-y-6">
        <DailyGoalsDashboard 
          dailyMainGoal={props.dailyMainGoal}
          dailyElectricityGoal={props.dailyElectricityGoal}
          currentMainOks={props.counts.okMain}
          currentElectricityOks={props.counts.okElectricity}
          dailyStreak={props.dailyStreak}
        />
        <ReportingConsole textToCopy={props.previewText} />
      </div>
    </main>
  );
};

export default DailyView;