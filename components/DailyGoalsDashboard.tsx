
import React from 'react';
import { FireIcon } from './icons';

interface DailyGoalsDashboardProps {
    dailyMainGoal: number;
    dailyElectricityGoal: number;
    currentMainOks: number;
    currentElectricityOks: number;
    dailyStreak: number;
}

interface GoalProgressProps {
    title: string;
    goal: number;
    current: number;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ title, goal, current }) => {
    const progress = goal > 0 ? (current / goal) * 100 : (current > 0 ? 100 : 0);
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-color-dark">{title}</span>
                <span className="text-color-light">
                    本日の目標: <span className="font-bold text-gradient">{goal}件</span>
                </span>
            </div>
            <div className="progress-bar h-4">
                <div className="progress-bar-inner" style={{ width: `${Math.min(progress, 100)}%` }}></div>
            </div>
            <div className="text-center">
                <span className="text-xl text-gradient font-bold">{progress.toFixed(0)}%</span>
                <span className="ml-2 text-color-light">({current}/{goal}件)</span>
            </div>
        </div>
    );
};

const DailyGoalsDashboard: React.FC<DailyGoalsDashboardProps> = ({ dailyMainGoal, dailyElectricityGoal, currentMainOks, currentElectricityOks, dailyStreak }) => {
    return (
        <section className="neumorphic-card p-4 sm:p-5 space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
                <h2 className="text-lg font-semibold text-color-dark">デイリーゴール</h2>
                {dailyStreak > 0 && (
                    <span className="flex items-center gap-1 font-bold text-orange-500">
                        <FireIcon className="w-5 h-5" />
                        {dailyStreak}日連続達成中！ (主商材)
                    </span>
                )}
            </div>
            <div className="neumorphic-card-inner p-4 grid md:grid-cols-2 gap-6">
                <GoalProgress 
                    title="主商材"
                    goal={dailyMainGoal}
                    current={currentMainOks}
                />
                <GoalProgress 
                    title="電気"
                    goal={dailyElectricityGoal}
                    current={currentElectricityOks}
                />
            </div>
        </section>
    );
};

export default DailyGoalsDashboard;
