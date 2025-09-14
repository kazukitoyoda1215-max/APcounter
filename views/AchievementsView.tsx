
import React from 'react';
import { Achievement } from '../types';
import BadgeCard from '../components/BadgeCard';

interface AchievementsViewProps {
  achievements: Achievement[];
}

const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements }) => {
  return (
    <main className="space-y-6">
      <section className="neumorphic-card p-4 sm:p-5">
        <h1 className="text-2xl font-bold text-gradient mb-4">アチーブメント</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {achievements.map(ach => (
            <BadgeCard key={ach.id} achievement={ach} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default AchievementsView;
