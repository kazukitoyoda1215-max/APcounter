
import React, { useMemo } from 'react';
import { CounterState } from '../types';

interface DailySummaryForMonthProps {
  currentDate: Date;
  counts: CounterState;
}

const ymdJp = (d: Date): string => {
  const m = String(d.getMonth() + 1);
  const day = String(d.getDate());
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
  return `${m}月${day}日 (${dayOfWeek})`;
};

const DailySummaryForMonth: React.FC<DailySummaryForMonthProps> = ({ currentDate, counts }) => {
  const { totalOks, effectiveRate, conversionRate } = useMemo(() => {
    const totalOks = counts.okMain; // Only count main product OKs as per user request
    const mainOkAndNg = counts.okMain + counts.ng;
    const effectiveRate = mainOkAndNg > 0 ? (counts.okMain / mainOkAndNg) * 100 : 0;
    const conversionRateMain = counts.callsMade > 0 ? (counts.okMain / counts.callsMade) * 100 : 0;
    const conversionRateElec = counts.callsMade > 0 ? (counts.okElectricity / counts.callsMade) * 100 : 0;
    
    return {
      totalOks,
      effectiveRate,
      conversionRate: { main: conversionRateMain, elec: conversionRateElec }
    };
  }, [counts]);
  
  return (
    <section className="neumorphic-card p-4 sm:p-5 space-y-3">
      <h2 className="text-lg font-semibold text-color-dark">日次サマリー (参考)</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-center">
        <div className="neumorphic-card-inner">
          <div className="text-sm text-color-light">今日の日付</div>
          <div className="text-lg font-semibold text-color-dark">{ymdJp(currentDate)}</div>
        </div>
        <div className="neumorphic-card-inner">
          <div className="text-sm text-color-light">合計件数 (OK)</div>
          <div className="text-lg font-semibold text-color-dark">{totalOks}件</div>
        </div>
        <div className="neumorphic-card-inner">
          <div className="text-sm text-color-light">有効率 (主商材)</div>
          <div className="text-lg font-semibold text-gradient">
            {effectiveRate.toFixed(1)}%
          </div>
        </div>
        <div className="neumorphic-card-inner">
          <div className="text-sm text-color-light">成約率 (主 / 電)</div>
          <div className="text-lg font-semibold text-gradient">
            {conversionRate.main.toFixed(1)}% / {conversionRate.elec.toFixed(1)}%
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailySummaryForMonth;