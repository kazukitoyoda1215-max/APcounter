
import React from 'react';
import { FireIcon } from './icons';

interface DailyGoalsDashboardProps {
    dailyGoal: number;
    currentOks: number;
    dailyStreak: number;
}

const DailyGoalsDashboard: React.FC<DailyGoalsDashboardProps> = ({ dailyGoal, currentOks, dailyStreak }) => {
    const progress = dailyGoal > 0 ? (currentOks / dailyGoal) * 100 : (currentOks > 0 ? 100 : 0);

    return (
        <section className="neumorphic-card p-4 sm:p-5 space-y-3">
            <h2 className="text-lg font-semibold text-color-dark">デイリーゴール</h2>
            <div className="neumorphic-card-inner p-4 space-y-3">
                <div className="flex justify-between items-center text-sm flex-wrap gap-2">
                    <span className="font-semibold text-color-dark">本日の目標達成率 (主商材)</span>
                    <div className="flex items-center gap-4">
                        {dailyStreak > 0 && (
                            <span className="flex items-center gap-1 font-bold text-orange-500">
                                <FireIcon className="w-5 h-5" />
                                {dailyStreak}日連続達成中！
                            </span>
                        )}
                        <span className="text-color-light">
                            本日の目標: <span className="font-bold text-gradient">{dailyGoal}件</span>
                        </span>
                    </div>
                </div>
                <div className="progress-bar h-4">
                    <div className="progress-bar-inner" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                </div>
                <div className="text-center">
                    <span className="text-xl text-gradient font-bold">{progress.toFixed(0)}%</span>
                    <span className="ml-2 text-color-light">({currentOks}/{dailyGoal}件)</span>
                </div>
            </div>
        </section>
    );
};

export default DailyGoalsDashboard;
