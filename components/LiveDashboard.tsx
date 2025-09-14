import React, { useMemo } from 'react';
import { CounterState } from '../types';

interface DonutChartProps {
    data: { label: string; value: number; color: string }[];
}

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
    const radius = 50;
    const strokeWidth = 15;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);
    if (total === 0) {
        return <div className="flex items-center justify-center h-full text-color-light">データがありません</div>;
    }

    let accumulatedOffset = 0;
    const segments = data.map((item, index) => {
        const percent = item.value / total;
        const strokeDashoffset = accumulatedOffset;
        accumulatedOffset += circumference * (1 - percent);
        return {
            ...item,
            strokeDashoffset,
            strokeDasharray: `${circumference * percent} ${circumference * (1-percent)}`
        };
    });

    return (
        <div className="flex items-center gap-4">
             <svg height="120" width="120" viewBox="0 0 120 120" className="-rotate-90">
                {segments.map((segment, index) => (
                    <circle
                        key={index}
                        stroke={segment.color}
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        strokeDasharray={segment.strokeDasharray}
                        style={{ strokeDashoffset: segment.strokeDashoffset }}
                        r={normalizedRadius}
                        cx={radius + strokeWidth/2}
                        cy={radius + strokeWidth/2}
                        className="donut-chart-segment"
                    />
                ))}
            </svg>
            <div className="text-sm space-y-2">
                {data.map(item => (
                    <div key={item.label} className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                        <span className="text-color-light mr-2">{item.label}:</span>
                        <span className="font-semibold text-color-dark">{item.value}件</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


interface LiveDashboardProps {
    counts: CounterState;
    dailyGoal: number;
}

const LiveDashboard: React.FC<LiveDashboardProps> = ({ counts, dailyGoal }) => {
    const totalOks = counts.okMain + counts.okElectricity;
    const progress = dailyGoal > 0 ? (totalOks / dailyGoal) * 100 : 0;
    
    const chartData = useMemo(() => {
        const others = counts.ps + counts.na + counts.ex;
        return [
            { label: 'OK', value: totalOks, color: 'var(--color-primary)' },
            { label: 'NG', value: counts.ng, color: 'var(--color-danger)' },
            { label: 'その他', value: others, color: 'var(--text-light)' },
        ];
    }, [counts, totalOks]);

    return (
        <section className="neumorphic-card p-4 grid md:grid-cols-2 gap-6">
            <div>
                <h2 className="text-lg font-semibold text-color-dark mb-3">成果グラフ</h2>
                <div className="neumorphic-card-inner p-3 h-40">
                    <DonutChart data={chartData} />
                </div>
            </div>
            <div>
                <h2 className="text-lg font-semibold text-color-dark mb-3">目標達成率 (本日)</h2>
                <div className="neumorphic-card-inner p-4 space-y-3 h-40 flex flex-col justify-center">
                    <div className="progress-bar h-3">
                        <div className="progress-bar-inner" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>
                    <div className="text-center">
                        <span className="text-lg text-gradient font-bold">{progress.toFixed(0)}%</span>
                        <span className="ml-2 text-color-light">({totalOks}/{dailyGoal}件)</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LiveDashboard;
