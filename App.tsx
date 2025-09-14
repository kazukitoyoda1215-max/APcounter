
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { CounterState, OneClickActionCategory, View, Theme, Achievement, AchievementId } from './types';
import TopBar from './components/TopBar';
import DailyView from './views/DailyView';
import MonthlyView from './views/MonthlyView';
import AchievementsView from './views/AchievementsView';

// --- Helper Functions & Initial Data ---
const ymdLocal = (d: Date): string => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const getDailyStorageKey = (d: Date): string => `ap_day_v3_${ymdLocal(d)}`;
const getMonthlyStorageKey = (d: Date): string => `ap_month_v1_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const getAchievementsStorageKey = (): string => 'ap_achievements_v1';
const getStreakStorageKey = (): string => 'ap_streak_v1';

const initialCounterState: CounterState = { okMain: 0, okElectricity: 0, ng: 0, ps: 0, na: 0, ex: 0, callsMade: 0, callsReceived: 0 };
const initialMonthlySettings = {
  goals: { main: 0, electricity: 0 },
  workdays: { total: 20, completed: 0 },
  adjustments: { main: 0, electricity: 0 },
};

const allAchievements: Omit<Achievement, 'unlocked' | 'unlockedDate'>[] = [
    { id: 'FIRST_OK_MAIN', title: '最初の主商材OK', description: '初めて主商材のOKを獲得する' },
    { id: 'TEN_OK_MAIN', title: '主商材マスター', description: '1日で主商材OKを10件獲得する' },
    { id: 'MONTHLY_GOAL_MAIN', title: '月間目標達成 (主)', description: '主商材の月間目標を達成する' },
    { id: 'TOTAL_CALLS_100', title: 'コール100件', description: '累計コール数が100件に到達' },
    { id: 'TOTAL_CALLS_1000', title: 'コール1000件', description: '累計コール数が1000件に到達' },
    { id: 'STREAK_5', title: '5日連続達成', description: '5日間連続で日次目標を達成する' },
];

// --- Main App Component ---
const App: React.FC = () => {
  // Common State
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [userName] = useState<string>('T.Yoshi');
  const [view, setView] = useState<View>('daily');
  const [theme, setTheme] = useState<Theme>('light');

  // Daily View State
  const [counts, setCounts] = useState<CounterState>(initialCounterState);
  const [lastSaveTime, setLastSaveTime] = useState<string>('');
  const [dailyStreak, setDailyStreak] = useState(0);

  // Monthly View State
  const [monthlySettings, setMonthlySettings] = useState(initialMonthlySettings);
  const [totalMonthOks, setTotalMonthOks] = useState({ main: 0, electricity: 0 });
  const [monthlyChartData, setMonthlyChartData] = useState<CounterState>(initialCounterState);

  // Achievements State
  const [achievements, setAchievements] = useState<Record<AchievementId, Achievement>>(() => {
      const initial: Partial<Record<AchievementId, Achievement>> = {};
      allAchievements.forEach(a => {
          initial[a.id] = { ...a, unlocked: false, unlockedDate: null };
      });
      return initial as Record<AchievementId, Achievement>;
  });

  // --- Effects ---

  // Load all data on startup and date change
  useEffect(() => {
    // Theme
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    setTheme(savedTheme || 'light');
    
    // Daily
    const dailyKey = getDailyStorageKey(currentDate);
    const savedDailyData = localStorage.getItem(dailyKey);
    setCounts(savedDailyData ? JSON.parse(savedDailyData) : initialCounterState);

    // Monthly
    const monthlyKey = getMonthlyStorageKey(currentDate);
    const savedMonthlyData = localStorage.getItem(monthlyKey);
    setMonthlySettings(savedMonthlyData ? JSON.parse(savedMonthlyData) : initialMonthlySettings);
    
    // Achievements
    const savedAchievements = localStorage.getItem(getAchievementsStorageKey());
    if (savedAchievements) {
        setAchievements(prev => ({...prev, ...JSON.parse(savedAchievements)}));
    }
    
    // Streak
    const savedStreak = localStorage.getItem(getStreakStorageKey());
    const streakData = savedStreak ? JSON.parse(savedStreak) : { count: 0, date: '' };
    const todayStr = ymdLocal(new Date());
    const yesterdayStr = ymdLocal(new Date(Date.now() - 86400000));
    if (streakData.date === todayStr || streakData.date === yesterdayStr) {
      setDailyStreak(streakData.count);
    } else {
      setDailyStreak(0); // Reset if streak is older than yesterday
    }

  }, [currentDate]);
  
  // Theme management
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Save daily counts
  useEffect(() => {
    localStorage.setItem(getDailyStorageKey(currentDate), JSON.stringify(counts));
    const now = new Date();
    setLastSaveTime(`自動保存: ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
  }, [counts, currentDate]);
  
  // Save monthly settings
  useEffect(() => {
    localStorage.setItem(getMonthlyStorageKey(currentDate), JSON.stringify(monthlySettings));
  }, [monthlySettings, currentDate]);

  // Save achievements
  useEffect(() => {
    localStorage.setItem(getAchievementsStorageKey(), JSON.stringify(achievements));
  }, [achievements]);
  
  // Save streak
  useEffect(() => {
    const todayStr = ymdLocal(new Date());
    localStorage.setItem(getStreakStorageKey(), JSON.stringify({ count: dailyStreak, date: todayStr }));
  }, [dailyStreak]);
  
  const dailyMainGoal = useMemo(() => {
    const { goals, workdays } = monthlySettings;
    const remainingGoals = goals.main - totalMonthOks.main;
    const remainingWorkdays = workdays.total - workdays.completed;
    if (remainingGoals <= 0) return 0;
    if (remainingWorkdays <= 0) return remainingGoals;
    const goal = Math.ceil(remainingGoals / remainingWorkdays);
    return goal > 0 ? goal : 0;
  }, [monthlySettings, totalMonthOks]);
  
  // Calculate monthly totals & check achievements
  useEffect(() => {
      let totalMain = 0;
      let totalElec = 0;
      let totalCalls = 0;
      const aggregatedMonthData: CounterState = { ...initialCounterState };

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ap_day_v3_')) {
          const savedData = localStorage.getItem(key);
          if (savedData) {
              const parsed: Partial<CounterState> = JSON.parse(savedData);
              totalCalls += parsed.callsMade || 0;
              const datePart = key.substring('ap_day_v3_'.length);
              const [year, month] = datePart.split('-').map(Number);
              if (year === currentDate.getFullYear() && (month - 1) === currentDate.getMonth()) {
                totalMain += parsed.okMain || 0;
                totalElec += parsed.okElectricity || 0;
                Object.keys(aggregatedMonthData).forEach(cat => {
                    (aggregatedMonthData as any)[cat] += parsed[cat as keyof CounterState] || 0;
                });
              }
          }
        }
      }
      const finalTotalMonthOks = { 
        main: totalMain + monthlySettings.adjustments.main,
        electricity: totalElec + monthlySettings.adjustments.electricity 
      };
      setTotalMonthOks(finalTotalMonthOks);
      setMonthlyChartData(aggregatedMonthData);

      // --- Achievement & Streak Checks ---
      const newAchievements = { ...achievements };
      const unlockAchievement = (id: AchievementId) => {
          if (!newAchievements[id].unlocked) {
              newAchievements[id] = { ...newAchievements[id], unlocked: true, unlockedDate: ymdLocal(new Date()) };
          }
      };

      if (counts.okMain >= 1) unlockAchievement('FIRST_OK_MAIN');
      if (counts.okMain >= 10) unlockAchievement('TEN_OK_MAIN');
      if (finalTotalMonthOks.main >= monthlySettings.goals.main && monthlySettings.goals.main > 0) unlockAchievement('MONTHLY_GOAL_MAIN');
      if (totalCalls >= 100) unlockAchievement('TOTAL_CALLS_100');
      if (totalCalls >= 1000) unlockAchievement('TOTAL_CALLS_1000');
      
      const currentOks = counts.okMain + counts.okElectricity;
      if (dailyMainGoal > 0 && currentOks >= dailyMainGoal) {
          const savedStreak = localStorage.getItem(getStreakStorageKey());
          const streakData = savedStreak ? JSON.parse(savedStreak) : { count: 0, date: '' };
          const todayStr = ymdLocal(new Date());
          
          if (streakData.date !== todayStr) {
             const yesterdayStr = ymdLocal(new Date(Date.now() - 86400000));
             const newStreak = streakData.date === yesterdayStr ? streakData.count + 1 : 1;
             setDailyStreak(newStreak);
          }
      }
      if (dailyStreak >= 5) unlockAchievement('STREAK_5');

      setAchievements(newAchievements);

  }, [counts, monthlySettings, currentDate, dailyMainGoal, dailyStreak]);

  const previewText = useMemo(() => {
    const d = ymdLocal(currentDate);
    const totalOks = counts.okMain + counts.okElectricity;
    const mainOkAndNg = counts.okMain + counts.ng;
    const effectiveRate = mainOkAndNg > 0 ? (counts.okMain / mainOkAndNg) * 100 : 0;
    const conversionRate = counts.callsMade > 0 ? (totalOks / counts.callsMade) * 100 : 0;

    return `${d} 業務報告 ${userName}\n` +
           `【成果】OK ${totalOks}件 (主:${counts.okMain} / 電:${counts.okElectricity}), NG ${counts.ng}件, 見込み ${counts.ps}件\n` +
           `【指標】成約率: ${conversionRate.toFixed(1)}%, 有効率: ${effectiveRate.toFixed(1)}%\n` +
           `【その他】留守 ${counts.na}件, 対象外 ${counts.ex}件\n` +
           `【稼働】架電 ${counts.callsMade}件, 入電 ${counts.callsReceived}件`;
  }, [counts, currentDate, userName]);
  

  const handleIncrement = useCallback((category: keyof CounterState) => setCounts(p => ({...p, [category]: p[category] + 1})), []);
  const handleDecrement = useCallback((category: keyof CounterState) => setCounts(p => ({...p, [category]: Math.max(0, p[category] - 1)})), []);
  const handleCountChange = useCallback((category: keyof CounterState, value: number) => setCounts(p => ({...p, [category]: Math.max(0, value)})), []);
  const handleClearDailyData = useCallback(() => { if(window.confirm('本日のカウンターをすべてリセットしますか？')) setCounts(initialCounterState); }, []);
  const handleOneClickAction = useCallback((category: OneClickActionCategory) => {
    setCounts(prev => {
        const newCounts = { ...prev, callsMade: prev.callsMade + 1 };
        if (category === 'ok') newCounts.okMain += 1;
        else newCounts[category] += 1;
        return newCounts;
    });
  }, []);

  const handleMonthlySettingsChange = useCallback(<K extends keyof typeof initialMonthlySettings, T extends keyof (typeof initialMonthlySettings)[K]>(
    section: K, field: T, value: number
  ) => setMonthlySettings(p => ({...p, [section]: {...p[section], [field]: isNaN(value) ? 0 : value }})), []);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <TopBar 
        userName={userName}
        activeView={view} 
        onViewChange={setView} 
        theme={theme}
        onThemeChange={setTheme}
      />
      
      {view === 'daily' && (
        <DailyView 
          onOneClickAction={handleOneClickAction}
          counts={counts}
          dailyGoal={dailyMainGoal}
          dailyStreak={dailyStreak}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onCountChange={handleCountChange}
          onClear={handleClearDailyData}
          lastSaveTime={lastSaveTime}
          previewText={previewText}
        />
      )}
      {view === 'monthly' && (
        <MonthlyView
          currentDate={currentDate}
          counts={counts}
          monthlySettings={monthlySettings}
          onSettingsChange={handleMonthlySettingsChange}
          totalMonthOks={totalMonthOks}
          monthlyChartData={monthlyChartData}
        />
      )}
      {view === 'achievements' && (
        <AchievementsView achievements={Object.values(achievements)} />
      )}

       <footer className="text-center text-sm text-color-light pt-6 border-t border-[var(--shadow-dark)] mt-6">
        <p>Sales Dashboard v7.0 - Gamification Edition</p>
        <p className="mt-1">©toyosystem</p>
      </footer>
    </div>
  );
};

export default App;
