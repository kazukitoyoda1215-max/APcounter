

import React, { useMemo } from 'react';
import { CounterState } from '../types';

interface DonutChartProps {
    data: { label: string; value: number; color: string }[];
}

const Chart: React.FC<DonutChartProps> = ({ data }) => {
    const radius = 50;
    const strokeWidth = 15;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);
    
    if (total === 0) {
        return <div className="flex items-center justify-center h-full text-color-light">月次データがありません</div>;
    }

    let accumulatedOffset = 0;
    const segments = data.map((item) => {
        const percent = item.value / total;
        const strokeDashoffset = accumulatedOffset;
        accumulatedOffset += circumference * (1 - percent);
        return {
            ...item,
            strokeDashoffset,
            strokeDasharray: `${circumference * percent} ${circumference * (1 - percent)}`
        };
    });

    return (
        <div className="flex items-center justify-center gap-6">
             <svg height="140" width="140" viewBox="0 0 120 120" className="-rotate-90">
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
                 <div className="flex items-center pt-2 mt-2 border-t border-[var(--shadow-dark)]">
                    <span className="w-3 h-3 rounded-full mr-2 bg-transparent"></span>
                    <span className="text-color-light mr-2 font-bold">合計:</span>
                    <span className="font-bold text-color-dark">{total}件</span>
                </div>
            </div>
        </div>
    );
};

interface MonthlyDonutChartProps {
    chartData: CounterState;
}

const MonthlyDonutChart: React.FC<MonthlyDonutChartProps> = ({ chartData }) => {
    
    const formattedChartData = useMemo(() => {
        const others = chartData.ps + chartData.na + chartData.ex;
        return [
            { label: 'OK (主商材)', value: chartData.okMain, color: 'var(--color-primary)' },
            { label: 'OK (電気)', value: chartData.okElectricity, color: 'var(--color-secondary)' },
            { label: 'NG', value: chartData.ng, color: 'var(--color-danger)' },
            { label: 'その他', value: others, color: 'var(--text-light)' },
        ].filter(item => item.value > 0);
    }, [chartData]);
    
    const { mainRate, elecRate, totalRate } = useMemo(() => {
        const effectiveCalls = chartData.callsMade - chartData.ex;
        if (effectiveCalls <= 0) {
            return { mainRate: 0, elecRate: 0, totalRate: 0 };
        }
        const totalOks = chartData.okMain + chartData.okElectricity;
        return {
            mainRate: (chartData.okMain / effectiveCalls) * 100,
            elecRate: (chartData.okElectricity / effectiveCalls) * 100,
            totalRate: (totalOks / effectiveCalls) * 100,
        };
    }, [chartData]);


    return (
        <section className="neumorphic-card p-4 sm:p-5 space-y-3">
          <h2 className="text-lg font-semibold text-color-dark">月次サマリー</h2>
          <div className="neumorphic-card-inner p-3 flex flex-col items-center justify-center min-h-[228px] gap-4">
              <h3 className="text-md font-semibold text-color-dark -mb-2">成果グラフ</h3>
              <Chart data={formattedChartData} />
          </div>
          <div className="neumorphic-card-inner p-3 text-center space-y-2">
            <h3 className="text-md font-semibold text-color-dark">成約率</h3>
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <div className="text-sm text-color-light">主商材</div>
                    <div className="text-lg font-semibold text-gradient">{mainRate.toFixed(1)}%</div>
                </div>
                <div>
                    <div className="text-sm text-color-light">電気</div>
                    <div className="text-lg font-semibold text-gradient">{elecRate.toFixed(1)}%</div>
                </div>
                <div>
                    <div className="text-sm text-color-light">合計</div>
                    <div className="text-lg font-semibold text-gradient">{totalRate.toFixed(1)}%</div>
                </div>
            </div>
          </div>
        </section>
    );
};

export default MonthlyDonutChart;
