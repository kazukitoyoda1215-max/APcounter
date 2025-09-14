
import React from 'react';
import { Achievement, AchievementId } from '../types';

interface BadgeCardProps {
  achievement: Achievement;
}

const getEmoji = (id: AchievementId): string => {
    if (id.includes('STREAK')) return '🔥';
    if (id.includes('GOAL')) return '🏆';
    if (id.includes('CALLS')) return '📞';
    if (id === 'PERFECT_DAY') return '🌟';
    if (id === 'TOTAL_OK_MAIN_100') return '💯';
    if (id.includes('ELEC')) return '⚡️';
    if (id.includes('TEN_OK')) return '✨';
    return '🎉';
};

const BadgeCard: React.FC<BadgeCardProps> = ({ achievement }) => {
  const { id, title, description, unlocked, unlockedDate } = achievement;

  return (
    <div 
      className={`neumorphic-card p-4 flex flex-col items-center text-center space-y-2 transition-all duration-300 ${!unlocked ? 'grayscale opacity-60' : ''}`}
      title={unlocked ? `達成日: ${unlockedDate}` : '未達成'}
    >
      <div className="w-16 h-16 rounded-full neumorphic-card-inner flex items-center justify-center">
        <span className={`text-4xl ${unlocked ? '' : 'grayscale'}`}>
          {getEmoji(id)}
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
