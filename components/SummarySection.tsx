import React from 'react';

interface SummarySectionProps {
  date: string;
  total: number;
  rateMain: number;
  rateElectricity: number;
  effectiveRate: number;
}

const SummarySection: React.FC<SummarySectionProps> = ({ date, total, rateMain, rateElectricity, effectiveRate }) => {
  return (
    <section className="neumorphic-card p-4 sm:p-5">
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-center">
        <div className="neumorphic-card-inner">
          <div className="text-sm text-color-light">今日</div>
          <div id="today" className="text-lg font-semibold text-color-dark">{date}</div>
        </div>
        <div className="neumorphic-card-inner">
          <div className="text-sm text-color-light">合計</div>
          <div id="summary-total" className="text-lg font-semibold text-color-dark">{total}件</div>
        </div>
        <div className="neumorphic-card-inner">
          <div className="text-sm text-color-light">有効率 (主商材)</div>
          <div className="text-lg font-semibold text-gradient">
            {effectiveRate.toFixed(1)}%
          </div>
        </div>
        <div className="neumorphic-card-inner">
          <div className="text-sm text-color-light">成約率 (主 / 電)</div>
          <div id="summary-rate" className="text-lg font-semibold text-gradient">
            {rateMain.toFixed(1)}% / {rateElectricity.toFixed(1)}%
          </div>
        </div>
      </div>
    </section>
  );
};

export default SummarySection;