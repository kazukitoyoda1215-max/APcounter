import React from 'react';

interface MonthlySettingsState {
  goals: { main: number; electricity: number };
  workdays: { total: number; completed: number };
  adjustments: { main: number; electricity: number };
}

interface MonthlySettingsProps {
  settings: MonthlySettingsState;
  onSettingsChange: <K extends keyof MonthlySettingsState, T extends keyof MonthlySettingsState[K]>(
    section: K,
    field: T,
    value: number
  ) => void;
}

const MonthlySettings: React.FC<MonthlySettingsProps> = ({ settings, onSettingsChange }) => {
  return (
    <section className="neumorphic-card p-4 sm:p-5 space-y-4">
      <h2 className="text-lg font-semibold text-color-dark">月次目標設定</h2>
      
      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="total-days" className="block text-sm font-medium text-color-light mb-1">
            月の総出勤日数
          </label>
          <input
            type="number"
            id="total-days"
            value={settings.workdays.total || ''}
            onChange={(e) => onSettingsChange('workdays', 'total', parseInt(e.target.value, 10))}
            className="w-full form-input-neumorphic"
            placeholder="例: 20"
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
            value={settings.workdays.completed || ''}
            onChange={(e) => onSettingsChange('workdays', 'completed', parseInt(e.target.value, 10))}
            className="w-full form-input-neumorphic"
            placeholder="例: 5"
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
            value={settings.goals.main || ''}
            onChange={(e) => onSettingsChange('goals', 'main', parseInt(e.target.value, 10))}
            className="w-full form-input-neumorphic"
            placeholder="例: 80"
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
            value={settings.goals.electricity || ''}
            onChange={(e) => onSettingsChange('goals', 'electricity', parseInt(e.target.value, 10))}
            className="w-full form-input-neumorphic"
            placeholder="例: 40"
            min="0"
          />
        </div>
      </div>

      <div className="pt-4 mt-2 border-t border-[var(--shadow-dark)]">
        <h3 className="text-md font-semibold text-color-dark mb-2">月次OK件数の補正</h3>
        <p className="text-xs text-color-light mb-3">過去のデータがずれている場合、ここに補正値（プラスまたはマイナス）を入力して、月次の合計値を修正します。</p>
        <div className="grid md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="main-adjustment" className="block text-sm font-medium text-color-light mb-1">
                    主商材 補正値
                </label>
                <input
                    type="number"
                    id="main-adjustment"
                    value={settings.adjustments.main || ''}
                    onChange={(e) => onSettingsChange('adjustments', 'main', parseInt(e.target.value, 10))}
                    className="w-full form-input-neumorphic"
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
                    value={settings.adjustments.electricity || ''}
                    onChange={(e) => onSettingsChange('adjustments', 'electricity', parseInt(e.target.value, 10))}
                    className="w-full form-input-neumorphic"
                    placeholder="例: -2 や 3"
                />
            </div>
        </div>
      </div>
    </section>
  );
};

export default MonthlySettings;
