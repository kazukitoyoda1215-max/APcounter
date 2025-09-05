
import React from 'react';

interface SummarySectionProps {
  date: string;
  total: number;
  rateMain: number;
  rateElectricity: number;
}

const SummarySection: React.FC<SummarySectionProps> = ({ date, total, rateMain, rateElectricity }) => {
  return (
    <section className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-5">
       <div className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-xl border bg-white/50 p-3">
          <div className="text-sm text-slate-500">今日</div>
          <div id="today" className="text-lg font-semibold">{date}</div>
        </div>
        <div className="rounded-xl border bg-white/50 p-3">
          <div className="text-sm text-slate-500">合計</div>
          <div id="summary-total" className="text-lg font-semibold">{total}件</div>
        </div>
        <div className="rounded-xl border bg-white/50 p-3">
          <div className="text-sm text-slate-500">成約率 (主 / 電)</div>
          <div id="summary-rate" className="text-lg font-semibold">
            {rateMain.toFixed(1)}% / {rateElectricity.toFixed(1)}%
          </div>
        </div>
      </div>
    </section>
  );
};

export default SummarySection;
