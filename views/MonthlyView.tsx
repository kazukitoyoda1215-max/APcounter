
import React from 'react';
import MonthlySettings from '../components/MonthlySettings';
import MonthlySummary from '../components/MonthlySummary';
import DailySummaryForMonth from '../components/DailySummaryForMonth';
import { CounterState } from '../types';
import MonthlyDonutChart from '../components/MonthlyDonutChart';

interface MonthlySettingsState {
  goals: { main: number; electricity: number };
  workdays: { total: number; completed: number };
  adjustments: { main: number; electricity: number };
}

interface MonthlyViewProps {
  currentDate: Date;
  counts: CounterState;
  monthlySettings: MonthlySettingsState;
  onSettingsChange: <K extends keyof MonthlySettingsState, T extends keyof MonthlySettingsState[K]>(
    section: K,
    field: T,
    value: number
  ) => void;
  totalMonthOks: { main: number; electricity: number };
  monthlyChartData: CounterState;
}

const MonthlyView: React.FC<MonthlyViewProps> = (props) => {
  return (
    <main className="space-y-6">
      <MonthlySettings 
        settings={props.monthlySettings}
        onSettingsChange={props.onSettingsChange}
      />
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <MonthlySummary
          totalMonthOks={props.totalMonthOks}
          monthlySettings={props.monthlySettings}
        />
        <MonthlyDonutChart chartData={props.monthlyChartData} />
      </div>
      <DailySummaryForMonth
        currentDate={props.currentDate}
        counts={props.counts}
      />
    </main>
  );
};

export default MonthlyView;
