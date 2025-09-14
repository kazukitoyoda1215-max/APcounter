
import React from 'react';
import { Achievement } from '../types';

interface BadgeCardProps {
  achievement: Achievement;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ achievement }) => {
  const { title, description, unlocked, unlockedDate } = achievement;

  return (
    <div 
      className={`neumorphic-card p-4 flex flex-col items-center text-center space-y-2 transition-all duration-300 ${!unlocked ? 'grayscale opacity-60' : ''}`}
      title={unlocked ? `達成日: ${unlockedDate}` : '未達成'}
    >
      <div className="w-16 h-16 rounded-full neumorphic-card-inner flex items-center justify-center">
        <span className={`text-4xl ${unlocked ? '' : 'grayscale'}`}>
          {achievement.id.includes('GOAL') ? '🏆' : achievement.id.includes('CALLS') ? '📞' : '🎉'}
        </span>
      </div>
      <h3 className={`font-semibold text-color-dark text-sm ${unlocked && 'text-gradient'}`}>{title}</h3>
      <p className="text-xs text-color-light flex-grow">{unlocked ? '達成！' : description}</p>
      {unlocked && unlockedDate && (
        <p className="text-xs text-color-light font-medium">達成日: {unlockedDate}</p>
      )}
    </div>
  );
};

export default BadgeCard;
