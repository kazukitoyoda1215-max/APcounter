import React, { useMemo } from 'react';

interface ProgressTrackerSectionProps {
  goals: {
    main: number;
    electricity: number;
  };
  totalWorkdays: number;
  completedWorkdays: number;
  totalMonthOks: {
    main: number;
    electricity: number;
  };
  okAdjustments: {
    main: number;
    electricity: number;
  };
  onGoalChange: (category: 'main' | 'electricity', value: number) => void;
  onTotalDaysChange: (value: number) => void;
  onCompletedDaysChange: (value: number) => void;
  onAdjustmentChange: (category: 'main' | 'electricity', value: number) => void;
}

interface TrackerDisplayProps {
  title: string;
  goal: number;
  totalOks: number;
  totalWorkdays: number;
  completedWorkdays: number;
}

const TrackerDisplay: React.FC<TrackerDisplayProps> = ({ title, goal, totalOks, totalWorkdays, completedWorkdays }) => {
  const progress = useMemo(() => {
    if (!goal || goal <= 0) return 0;
    return (totalOks / goal) * 100;
  }, [totalOks, goal]);

  const remainingWorkdays = useMemo(() => {
    return Math.max(1, totalWorkdays - completedWorkdays);
  }, [totalWorkdays, completedWorkdays]);

  const dailyTarget = useMemo(() => {
    const remainingOks = goal - totalOks;
    if (remainingOks <= 0) return 0; // Goal reached
    return Math.ceil(remainingOks / remainingWorkdays);
  }, [goal, totalOks, remainingWorkdays]);

  const progressPace = useMemo(() => {
    if (goal <= 0 || totalWorkdays <= 0 || completedWorkdays <= 0) {
      return { percent: 0, color: 'text-color-light' };
    }
    const idealPaceTotal = (goal / totalWorkdays) * completedWorkdays;
    if (idealPaceTotal <= 0) {
        return { percent: totalOks > 0 ? 999 : 100, color: 'text-color-success' };
    }
    const percent = (totalOks / idealPaceTotal) * 100;
    
    let color = 'text-color-success';
    if (percent < 90) {
        color = 'text-color-danger';
    } else if (percent < 100) {
        color = 'text-color-warning';
    }

    return { percent, color };

  }, [goal, totalOks, totalWorkdays, completedWorkdays]);


  return (
    <div className="space-y-3 p-4 rounded-lg neumorphic-card-inner">
      <h3 className="font-semibold text-color-dark">{title}</h3>
      <div className="grid sm:grid-cols-3 gap-3 text-center">
        <div className="neumorphic-card-inner">
          <div className="flex items-center justify-center gap-1.5">
            <div className="text-sm text-color-light">今月の進捗</div>
            <div className="relative group flex items-center">
              <svg xmlns="http://www.w.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                今月の保存済みOK件数をすべて合算した数値です。
              </div>
            </div>
          </div>
          <div className="text-lg font-semibold text-gradient mt-1">
            {progress.toFixed(1)}%
            <span className="text-sm font-normal text-color-light ml-2">({totalOks} / {goal || '?'})</span>
          </div>
        </div>
         <div className="neumorphic-card-inner">
          <div className="text-sm text-color-light">進捗達成率</div>
          <div className={`text-lg font-semibold ${progressPace.color}`}>
            {progressPace.percent.toFixed(1)}%
            <span className="text-sm font-normal text-color-light ml-2">(100%で目標ペース)</span>
          </div>
        </div>
        <div className="neumorphic-card-inner">
          <div className="text-sm text-color-light">残りの必要件数</div>
          <div className="text-lg font-semibold text-color-danger">
            {dailyTarget}件
            <span className="text-sm font-normal text-color-light ml-2">(1日あたり)</span>
          </div>
        </div>
      </div>
    </div>
  );
};


const ProgressTrackerSection: React.FC<ProgressTrackerSectionProps> = ({
  goals,
  totalWorkdays,
  completedWorkdays,
  totalMonthOks,
  okAdjustments,
  onGoalChange,
  onTotalDaysChange,
  onCompletedDaysChange,
  onAdjustmentChange,
}) => {
  return (
    <section className="neumorphic-card p-4 sm:p-5 space-y-4">
      <h2 className="text-lg font-semibold text-color-dark">進捗トラッカー (月次)</h2>
      
      {/* Input Fields */}
      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="total-days" className="block text-sm font-medium text-color-light mb-1">
            月の総出勤日数
          </label>
          <input
            type="number"
            id="total-days"
            value={totalWorkdays || ''}
            onChange={(e) => onTotalDaysChange(parseInt(e.target.value, 10) || 1)}
            className="w-full form-input-neumorphic text-lg font-semibold"
            placeholder="e.g., 20"
            min="1"
          />
        </div>
         <div>
          <label htmlFor="completed-days" className="block text-sm font-medium text-color-light mb-1">
            今月の消化出勤日数
          </label>
          <input
            type="number"
            id="completed-days"
            value={completedWorkdays || ''}
            onChange={(e) => onCompletedDaysChange(parseInt(e.target.value, 10) || 0)}
            className="w-full form-input-neumorphic text-lg font-semibold"
            placeholder="e.g., 5"
            min="0"
          />
        </div>
        <div>
          <label htmlFor="main-goal" className="block text-sm font-medium text-color-light mb-1">
            主商材の目標件数
          </label>
          <input
            type="number"
            id="main-goal"
            value={goals.main || ''}
            onChange={(e) => onGoalChange('main', parseInt(e.target.value, 10) || 0)}
            className="w-full form-input-neumorphic text-lg font-semibold"
            placeholder="e.g., 100"
            min="0"
          />
        </div>
        <div>
          <label htmlFor="electricity-goal" className="block text-sm font-medium text-color-light mb-1">
            電気の目標件数
          </label>
          <input
            type="number"
            id="electricity-goal"
            value={goals.electricity || ''}
            onChange={(e) => onGoalChange('electricity', parseInt(e.target.value, 10) || 0)}
            className="w-full form-input-neumorphic text-lg font-semibold"
            placeholder="e.g., 50"
            min="0"
          />
        </div>
      </div>

      {/* Adjustment Fields */}
      <div className="pt-4 mt-4 border-t border-[var(--shadow-dark)]">
        <h3 className="text-sm font-medium text-color-light mb-2">月次OK件数の補正</h3>
        <p className="text-xs text-color-light mb-3">過去のデータがずれている場合、ここに補正値（プラスまたはマイナス）を入力して、月次の合計値を修正します。</p>
        <div className="grid md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="main-adjustment" className="block text-sm font-medium text-color-light mb-1">
                    主商材 補正値
                </label>
                <input
                    type="number"
                    id="main-adjustment"
                    value={okAdjustments.main || ''}
                    onChange={(e) => onAdjustmentChange('main', parseInt(e.target.value, 10) || 0)}
                    className="w-full form-input-neumorphic text-lg font-semibold"
                    placeholder="例: -5 や 10"
                />
            </div>
            <div>
                <label htmlFor="electricity-adjustment" className="block text-sm font-medium text-color-light mb-1">
                    電気 補正値
                </label>
                <input
                    type="number"
                    id="electricity-adjustment"
                    value={okAdjustments.electricity || ''}
                    onChange={(e) => onAdjustmentChange('electricity', parseInt(e.target.value, 10) || 0)}
                    className="w-full form-input-neumorphic text-lg font-semibold"
                    placeholder="例: -2 や 3"
                />
            </div>
        </div>
    </div>

      {/* Display Results */}
      <div className="grid lg:grid-cols-1 gap-4 pt-4">
        <TrackerDisplay
            title="主商材"
            goal={goals.main}
            totalOks={totalMonthOks.main}
            totalWorkdays={totalWorkdays}
            completedWorkdays={completedWorkdays}
        />
        <TrackerDisplay
            title="電気"
            goal={goals.electricity}
            totalOks={totalMonthOks.electricity}
            totalWorkdays={totalWorkdays}
            completedWorkdays={completedWorkdays}
        />
      </div>
    </section>
  );
};

export default ProgressTrackerSection;