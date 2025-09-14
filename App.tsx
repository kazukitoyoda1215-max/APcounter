
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { CounterState, OneClickActionCategory, View, Theme, Achievement, AchievementId } from './types';
import TopBar from './components/TopBar';
import DailyView from './views/DailyView';
import MonthlyView from './views/MonthlyView';
import AchievementsView from './views/AchievementsView';
import LoginView from './views/LoginView';
import { loginUser, registerUser, getUserData, setUserData } from './services/gasService';

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

const initialAchievements = (): Record<AchievementId, Achievement> => {
    const initial: Partial<Record<AchievementId, Achievement>> = {};
    allAchievements.forEach(a => {
        initial[a.id] = { ...a, unlocked: false, unlockedDate: null };
    });
    return initial as Record<AchievementId, Achievement>;
};


// --- Main App Component ---
const App: React.FC = () => {
  // --- State ---
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [view, setView] = useState<View>('daily');
  const [theme, setTheme] = useState<Theme>('light');
  
  // Auth State
  const [userName, setUserName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [authError, setAuthError] = useState<string>('');

  // Data State
  const [appData, setAppData] = useState<Record<string, any>>({});
  const [lastSaveTime, setLastSaveTime] = useState<string>('');
  const saveTimeoutRef = useRef<number | null>(null);

  // --- Derived State ---
  const counts = useMemo<CounterState>(() => appData[getDailyStorageKey(currentDate)] || initialCounterState, [appData, currentDate]);
  const monthlySettings = useMemo(() => appData[getMonthlyStorageKey(currentDate)] || initialMonthlySettings, [appData, currentDate]);
  const achievements = useMemo<Record<AchievementId, Achievement>>(() => ({ ...initialAchievements(), ...appData[getAchievementsStorageKey()] }), [appData]);
  const dailyStreakData = useMemo(() => appData[getStreakStorageKey()] || { count: 0, date: '' }, [appData]);

  const dailyStreak = useMemo(() => {
    const todayStr = ymdLocal(new Date());
    const yesterdayStr = ymdLocal(new Date(Date.now() - 86400000));
    if (dailyStreakData.date === todayStr || dailyStreakData.date === yesterdayStr) {
      return dailyStreakData.count;
    }
    return 0; // Reset if streak is older than yesterday
  }, [dailyStreakData]);

  // --- Effects ---

  // Load theme and check for saved session on initial mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const currentTheme = savedTheme || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    setTheme(currentTheme);

    const savedUser = localStorage.getItem('gas_user');
    const savedToken = localStorage.getItem('gas_token');

    if (savedUser && savedToken) {
        setUserName(savedUser);
        setToken(savedToken);
        getUserData(savedUser, savedToken)
            .then(data => {
                setAppData(data || {});
            })
            .catch(err => {
                console.error("Session restore failed", err);
                localStorage.removeItem('gas_user');
                localStorage.removeItem('gas_token');
                setUserName(null);
                setToken(null);
            })
            .finally(() => setIsAuthenticating(false));
    } else {
        setIsAuthenticating(false);
    }
  }, []);

  // Debounced save to GAS
  useEffect(() => {
    if (isAuthenticating || !userName || !token) return;

    if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
        setUserData(userName, token, appData)
            .then(() => {
                const now = new Date();
                setLastSaveTime(`自動保存: ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
            })
            .catch(err => {
                console.error("Failed to save data to GAS", err);
                setLastSaveTime('保存失敗');
            });
    }, 1500); // 1.5 second debounce

    return () => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
    };
  }, [appData, userName, token, isAuthenticating]);

  // Theme management
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const { totalMonthOks, monthlyChartData, totalCalls } = useMemo(() => {
    let totalMain = 0;
    let totalElec = 0;
    let totalCalls = 0;
    const aggregatedMonthData: CounterState = { ...initialCounterState };

    for (const key in appData) {
      if (key && key.startsWith('ap_day_v3_')) {
        const data = appData[key] as Partial<CounterState>;
        totalCalls += data.callsMade || 0;
        
        const datePart = key.substring('ap_day_v3_'.length);
        const [year, month] = datePart.split('-').map(Number);

        if (year === currentDate.getFullYear() && (month - 1) === currentDate.getMonth()) {
          totalMain += data.okMain || 0;
          totalElec += data.okElectricity || 0;
          Object.keys(aggregatedMonthData).forEach(cat => {
            (aggregatedMonthData as any)[cat] += data[cat as keyof CounterState] || 0;
          });
        }
      }
    }
    const finalTotalMonthOks = { 
      main: totalMain + monthlySettings.adjustments.main,
      electricity: totalElec + monthlySettings.adjustments.electricity 
    };
    return { totalMonthOks: finalTotalMonthOks, monthlyChartData: aggregatedMonthData, totalCalls };
  }, [appData, currentDate, monthlySettings]);
  
  const dailyMainGoal = useMemo(() => {
    const { goals, workdays } = monthlySettings;
    const remainingGoals = goals.main - totalMonthOks.main;
    const remainingWorkdays = workdays.total - workdays.completed;
    if (remainingGoals <= 0) return 0;
    if (remainingWorkdays <= 0) return remainingGoals;
    const goal = Math.ceil(remainingGoals / remainingWorkdays);
    return goal > 0 ? goal : 0;
  }, [monthlySettings, totalMonthOks]);

  // Achievement check effect
  useEffect(() => {
    const newAchievements = { ...achievements };
    let changed = false;
    const unlockAchievement = (id: AchievementId) => {
        if (!newAchievements[id].unlocked) {
            newAchievements[id] = { ...newAchievements[id], unlocked: true, unlockedDate: ymdLocal(new Date()) };
            changed = true;
        }
    };
    
    // This calculation for totalCalls is incorrect because it's only using the current month's data.
    // A more accurate total should be calculated across all data.
    const allTimeTotalCalls = Object.values(appData)
      .filter((v): v is { callsMade: number } => typeof v === 'object' && v !== null && 'callsMade' in v && typeof v.callsMade === 'number')
      .reduce((acc, cur) => acc + cur.callsMade, 0);

    if (counts.okMain >= 1) unlockAchievement('FIRST_OK_MAIN');
    if (counts.okMain >= 10) unlockAchievement('TEN_OK_MAIN');
    if (totalMonthOks.main >= monthlySettings.goals.main && monthlySettings.goals.main > 0) unlockAchievement('MONTHLY_GOAL_MAIN');
    if (allTimeTotalCalls >= 100) unlockAchievement('TOTAL_CALLS_100');
    if (allTimeTotalCalls >= 1000) unlockAchievement('TOTAL_CALLS_1000');
    
    let newStreak = dailyStreak;
    const currentOks = counts.okMain + counts.okElectricity;
    if (dailyMainGoal > 0 && currentOks >= dailyMainGoal) {
        const todayStr = ymdLocal(new Date());
        if (dailyStreakData.date !== todayStr) {
           const yesterdayStr = ymdLocal(new Date(Date.now() - 86400000));
           newStreak = dailyStreakData.date === yesterdayStr ? dailyStreakData.count + 1 : 1;
        }
    }
    if (newStreak >= 5) unlockAchievement('STREAK_5');

    if (changed || newStreak !== dailyStreak) {
        setAppData(prev => ({
            ...prev,
            [getAchievementsStorageKey()]: newAchievements,
            ...(newStreak !== dailyStreak && { [getStreakStorageKey()]: { count: newStreak, date: ymdLocal(new Date()) }})
        }));
    }

  }, [counts, monthlySettings, totalMonthOks, dailyMainGoal, dailyStreak, appData, achievements, dailyStreakData]);

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
  
  // --- Handlers for updating state ---
  const updateDailyCount = useCallback((updater: (prev: CounterState) => CounterState) => {
    const key = getDailyStorageKey(currentDate);
    setAppData(prev => ({
      ...prev,
      [key]: updater(prev[key] || initialCounterState)
    }));
  }, [currentDate]);

  const handleIncrement = useCallback((category: keyof CounterState) => updateDailyCount(p => ({...p, [category]: p[category] + 1})), [updateDailyCount]);
  const handleDecrement = useCallback((category: keyof CounterState) => updateDailyCount(p => ({...p, [category]: Math.max(0, p[category] - 1)})), [updateDailyCount]);
  const handleCountChange = useCallback((category: keyof CounterState, value: number) => updateDailyCount(p => ({...p, [category]: Math.max(0, value)})), [updateDailyCount]);
  const handleClearDailyData = useCallback(() => { if(window.confirm('本日のカウンターをすべてリセットしますか？')) updateDailyCount(() => initialCounterState); }, [updateDailyCount]);
  
  const handleOneClickAction = useCallback((category: OneClickActionCategory) => {
    updateDailyCount(prev => {
        const newCounts = { ...prev, callsMade: prev.callsMade + 1 };
        if (category === 'ok') newCounts.okMain += 1;
        else newCounts[category] += 1;
        return newCounts;
    });
  }, [updateDailyCount]);

  const handleMonthlySettingsChange = useCallback(<K extends keyof typeof initialMonthlySettings, T extends keyof (typeof initialMonthlySettings)[K]>(
    section: K, field: T, value: number
  ) => {
    const key = getMonthlyStorageKey(currentDate);
    setAppData(p => {
        const currentSettings = p[key] || initialMonthlySettings;
        return {
            ...p,
            [key]: {
                ...currentSettings,
                [section]: {
                    ...currentSettings[section],
                    [field]: isNaN(value) ? 0 : value
                }
            }
        };
    });
  }, [currentDate]);

  // --- Auth Handlers ---
  const handleLogin = async (name: string, pass: string) => {
    setAuthError('');
    try {
      const result = await loginUser(name, pass);
      if (result.token) {
        localStorage.setItem('gas_user', name);
        localStorage.setItem('gas_token', result.token);
        setUserName(name);
        setToken(result.token);
        const data = await getUserData(name, result.token);
        setAppData(data || {});
      } else {
        throw new Error('Login failed');
      }
    } catch (err: any) {
      setAuthError(err.message || 'ログインに失敗しました。');
      console.error(err);
    }
  };

  const handleRegister = async (name: string, pass: string) => {
    setAuthError('');
    try {
      const result = await registerUser(name, pass);
      if (result.registered) {
        setAuthError('登録が完了しました。ログインしてください。');
      } else {
        throw new Error('Registration failed without an error message.');
      }
    } catch (err: any) {
      setAuthError(err.message || '登録に失敗しました。');
      console.error(err);
    }
  };

  const handleLogout = useCallback(async () => {
    // Cancel any pending debounced save.
    if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
    }

    // Attempt to save the final state before logging out.
    // This is a "fire and forget" save; we don't block logout if it fails
    // (e.g., user is offline), but we log the error.
    if (userName && token) {
        try {
            await setUserData(userName, token, appData);
        } catch (error) {
            console.error("Failed to save data on logout:", error);
        }
    }

    // Proceed with clearing local session and resetting app state.
    localStorage.removeItem('gas_user');
    localStorage.removeItem('gas_token');
    
    setUserName(null);
    setToken(null);
    setAppData({});
    setAuthError('');
    setView('daily'); // Reset to the default view for the next login
  }, [userName, token, appData]);

  // --- Render Logic ---
  if (isAuthenticating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gradient mb-4">進捗確認くん</h1>
          <p className="text-color-light">起動中...</p>
        </div>
      </div>
    );
  }

  if (!userName) {
    return <LoginView onLogin={handleLogin} onRegister={handleRegister} error={authError} />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <TopBar 
        userName={userName}
        activeView={view} 
        onViewChange={setView} 
        theme={theme}
        onThemeChange={setTheme}
        onLogout={handleLogout}
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
