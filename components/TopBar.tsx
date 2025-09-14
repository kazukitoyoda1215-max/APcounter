

import React, { useState } from 'react';
import { View, Theme } from '../types';
import Navigation from './Navigation';
import ThemeSwitcher from './ThemeSwitcher';

interface TopBarProps {
  userName: string;
  activeView: View;
  onViewChange: (view: View) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ userName, activeView, onViewChange, theme, onThemeChange, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="flex justify-between items-center gap-4 flex-wrap">
      <div className="flex-grow md:flex-grow-0">
        <Navigation activeView={activeView} onViewChange={onViewChange} />
      </div>
      
      <div className="flex items-center gap-4 ml-auto">
        <ThemeSwitcher theme={theme} onToggle={() => onThemeChange(theme === 'light' ? 'dark' : 'light')} />
        <div className="relative">
          <div onClick={() => setIsProfileOpen(p => !p)} className="text-right text-color-light text-sm cursor-pointer flex items-center gap-1">
              <span className="font-semibold text-gradient">{userName}</span> 
              <span className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}>▼</span>
          </div>
          {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 neumorphic-card p-2 z-10">
                  <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm text-color-dark hover:bg-[var(--shadow-dark)] rounded-md transition-colors">
                      ログアウト
                  </button>
              </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;