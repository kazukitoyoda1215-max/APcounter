import React from 'react';
import { View } from '../types';

interface NavigationProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const views: { key: View, label: string }[] = [
    { key: 'daily', label: 'デイリー' },
    { key: 'monthly', label: '月次' },
    { key: 'achievements', label: '実績' },
];

const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  return (
    <nav className="neumorphic-card p-1.5 flex justify-center items-center gap-2 rounded-xl">
      {views.map(({ key, label }) => (
        <button 
          key={key}
          onClick={() => onViewChange(key)}
          className={`w-full px-4 py-2 font-semibold text-sm rounded-lg transition-all duration-300 btn-neumorphic ${activeView === key ? 'active' : ''}`}
        >
          <span className={activeView === key ? 'text-gradient' : ''}>{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
