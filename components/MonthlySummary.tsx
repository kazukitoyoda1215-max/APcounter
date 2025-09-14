
import React, { useMemo } from 'react';

interface MonthlySettingsState {
  goals: { main: number; electricity: number };
  workdays: { total: number; completed: number };
}

interface MonthlySummaryProps {
  totalMonthOks: { main: number; electricity: number };
  monthlySettings: MonthlySettingsState;
}

interface SummaryCardProps {
  title: string;
  goal: number;
  totalOks: number;
  totalWorkdays: number;
  completedWorkdays: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, goal, totalOks, totalWorkdays, completedWorkdays }) => {
  const { progress, progressPace, dailyTarget, remainingOks } = useMemo(() => {
    const safeGoal = goal > 0 ? goal : 0;
    const safeTotalWorkdays = totalWorkdays > 0 ? totalWorkdays : 1;
    const safeCompletedWorkdays = completedWorkdays >= 0 ? completedWorkdays : 0;

    const progress = safeGoal > 0 ? (totalOks / safeGoal) * 100 : 0;

    const remainingWorkdays = Math.max(1, safeTotalWorkdays - safeCompletedWorkdays);
    const remainingOks = safeGoal - totalOks;
    const dailyTarget = remainingOks <= 0 ? 0 : Math.ceil(remainingOks / remainingWorkdays);

    const idealPaceTotal = (safeGoal / safeTotalWorkdays) * safeCompletedWorkdays;
    const pacePercent = idealPaceTotal > 0 ? (totalOks / idealPaceTotal) * 100 : (totalOks > 0 ? 999 : 100);

    let paceColor = 'text-color-success';
    if (pacePercent < 90) paceColor = 'text-color-danger';
    else if (pacePercent < 100) paceColor = 'text-color-warning';
    
    return { 
      progress, 
      progressPace: { percent: pacePercent, color: paceColor }, 
      dailyTarget,
      remainingOks,
    };
  }, [goal, totalOks, totalWorkdays, completedWorkdays]);

  return (
    <div className="space-y-3 p-4 rounded-lg neumorphic-card-inner">
      <h3 className="font-semibold text-color-dark">{title}</h3>
      <div className="grid sm:grid-cols-3 gap-3 text-center">
        <div className="neumorphic-card-inner">
          <div className="text-sm text-color-light">今月の進捗</div>
          <div className="text-lg font-semibold text-gradient mt-1">
            {progress.toFixed(1)}%
            <span className="text-sm font-normal text-color-light ml-2">({totalOks} / {goal || '?'})</span>
          </div>
        </div>
         <div className="neumorphic-card-inner">
          <div className="text-sm text-color-light">進捗達成率</div>
          <div className={`text-lg font-semibold ${progressPace.color}`}>
            {progressPace.percent.toFixed(1)}%
            <span className="text-sm font-normal text-color-light ml-1">(目標ペース)</span>
          </div>
        </div>
        <div className="neumorphic-card-inner">
          <div className="text-sm text-color-light">残件数 / 日ペース</div>
          <div className="text-lg font-semibold text-color-danger">
            {remainingOks > 0 ? `${remainingOks}件` : '達成🎉'}
            <span className="text-sm font-normal text-color-light ml-1">
              {remainingOks > 0 ? `/ ${dailyTarget}件` : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


const MonthlySummary: React.FC<MonthlySummaryProps> = ({ totalMonthOks, monthlySettings }) => {
  return (
    <section className="neumorphic-card p-4 sm:p-5 space-y-4">
      <h2 className="text-lg font-semibold text-color-dark">進捗サマリー</h2>
      <div className="grid lg:grid-cols-1 gap-4">
        <SummaryCard
          title="主商材"
          goal={monthlySettings.goals.main}
          totalOks={totalMonthOks.main}
          totalWorkdays={monthlySettings.workdays.total}
          completedWorkdays={monthlySettings.workdays.completed}
        />
        <SummaryCard
          title="電気"
          goal={monthlySettings.goals.electricity}
          totalOks={totalMonthOks.electricity}
          totalWorkdays={monthlySettings.workdays.total}
          completedWorkdays={monthlySettings.workdays.completed}
        />
      </div>
    </section>
  );
};

export default MonthlySummary;
