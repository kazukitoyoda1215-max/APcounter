
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import CounterSection from './components/CounterSection';
import CopySection from './components/CopySection';
import SummarySection from './components/SummarySection';
import IndependentCounterSection from './components/IndependentCounterSection';
import ProgressTrackerSection from './components/ProgressTrackerSection';
import DataManagementSection from './components/DataManagementSection';
import type { CounterState, CounterCategory, IndependentCounterCategory } from './types';

// --- Helper Functions ---
const ymdLocal = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const getStorageKey = (d: Date): string => `ap_day_v3_${ymdLocal(d)}`;
const SETTINGS_STORAGE_KEY = 'ap_day_v3_settings_v3';

const initialState: CounterState = { okMain: 0, okElectricity: 0, ng: 0, ps: 0, na: 0, ex: 0, callsMade: 0, callsReceived: 0 };

// --- Main App Component ---
const App: React.FC = () => {
  const [counts, setCounts] = useState<CounterState>(initialState);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [lastSaveTime, setLastSaveTime] = useState<string>('');
  const [goals, setGoals] = useState<{ main: number; electricity: number }>({ main: 0, electricity: 0 });
  const [remainingWorkdays, setRemainingWorkdays] = useState<number>(1);
  const [okAdjustments, setOkAdjustments] = useState<{ main: number; electricity: number }>({ main: 0, electricity: 0 });


  // Effect for loading data and checking for date changes
  useEffect(() => {
    const loadStateForDate = (date: Date) => {
      const key = getStorageKey(date);
      try {
        const savedData = localStorage.getItem(key);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setCounts({
            okMain: parsed.okMain || 0,
            okElectricity: parsed.okElectricity || 0,
            ng: parsed.ng || 0,
            ps: parsed.ps || 0,
            na: parsed.na || 0,
            ex: parsed.ex || 0,
            callsMade: parsed.callsMade || 0,
            callsReceived: parsed.callsReceived || 0,
          });
        } else {
          setCounts(initialState);
        }
      } catch {
        setCounts(initialState);
      }
    };

    loadStateForDate(currentDate);

    // Load settings and reset if month has changed
    try {
        const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
        const currentMonth = ymdLocal(currentDate).substring(0, 7);

        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            if (parsed.lastLoadedMonth === currentMonth) {
              // Same month, load saved settings
              setGoals({
                  main: parsed.goals?.main || 0,
                  electricity: parsed.goals?.electricity || 0,
              });
              setRemainingWorkdays(parsed.remainingWorkdays || 1);
              setOkAdjustments(parsed.okAdjustments || { main: 0, electricity: 0 });
            } else {
              // New month, reset settings state to defaults
              setGoals({ main: 0, electricity: 0 });
              setRemainingWorkdays(1);
              setOkAdjustments({ main: 0, electricity: 0 });
            }
        }
    } catch {
        // ignore errors, initial state will be used
    }


    const intervalId = setInterval(() => {
      const today = new Date();
      if (ymdLocal(today) !== ymdLocal(currentDate)) {
        setCurrentDate(today);
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [currentDate]);

  // Effect for saving daily counts
  useEffect(() => {
    const key = getStorageKey(currentDate);
    const dataToSave = { ...counts, _ts: Date.now() };
    localStorage.setItem(key, JSON.stringify(dataToSave));
    
    const now = new Date();
    setLastSaveTime(`保存: ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
  }, [counts, currentDate]);

  // Effect for saving settings
  useEffect(() => {
    const currentMonth = ymdLocal(currentDate).substring(0, 7);
    const settingsToSave = { 
        goals, 
        remainingWorkdays, 
        okAdjustments,
        lastLoadedMonth: currentMonth
    };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
  }, [goals, remainingWorkdays, okAdjustments, currentDate]);

  // Calculate total OKs for the current month
  const totalMonthOks = useMemo(() => {
    const ymd = ymdLocal(currentDate);
    const currentMonthPrefix = `ap_day_v3_${ymd.substring(0, 7)}`; // e.g., "ap_day_v3_2023-10"
    let totalMain = 0;
    let totalElectricity = 0;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Check if the key is for the current month but not for today
        if (key && key.startsWith(currentMonthPrefix) && key !== getStorageKey(currentDate)) {
            try {
                const data = JSON.parse(localStorage.getItem(key) || '{}');
                if (data) {
                    totalMain += data.okMain || 0;
                    totalElectricity += data.okElectricity || 0;
                }
            } catch (e) {
                // ignore parsing errors
            }
        }
    }
    return {
        main: totalMain + counts.okMain + okAdjustments.main,
        electricity: totalElectricity + counts.okElectricity + okAdjustments.electricity
    };
  }, [currentDate, counts.okMain, counts.okElectricity, okAdjustments]);

  const summary = useMemo(() => {
    const totalOks = counts.okMain + counts.okElectricity;
    const total = totalOks + counts.ng + counts.ps + counts.na + counts.ex;
    const base = totalOks + counts.ng + counts.ps;
    const rateMain = base ? (counts.okMain / base) * 100 : 0;
    const rateElectricity = base ? (counts.okElectricity / base) * 100 : 0;
    return { total, rateMain, rateElectricity };
  }, [counts]);

  const previewText = useMemo(() => {
    const d = ymdLocal(currentDate);
    return `${d}　OK(主) ${counts.okMain}件 / OK(電) ${counts.okElectricity}件 / NG ${counts.ng}件 / 見込み ${counts.ps}件 / 留守 ${counts.na}件 / 取次対象外 ${counts.ex}件 / コール ${counts.callsMade}件 / 入電 ${counts.callsReceived}件（合計 ${summary.total}件・成約率(主) ${summary.rateMain.toFixed(1)}% / 成約率(電) ${summary.rateElectricity.toFixed(1)}%）`;
  }, [counts, currentDate, summary]);

  const handleIncrement = useCallback((category: CounterCategory) => {
    setCounts(prevCounts => ({
      ...prevCounts,
      [category]: prevCounts[category] + 1,
    }));
  }, []);

  const handleDecrement = useCallback((category: CounterCategory) => {
    setCounts(prevCounts => ({
      ...prevCounts,
      [category]: Math.max(0, prevCounts[category] - 1),
    }));
  }, []);

  const handleCountChange = useCallback((category: CounterCategory, value: number) => {
    const numericValue = isNaN(value) ? 0 : Math.max(0, value); // ensure non-negative and is a number
    setCounts(prevCounts => ({
      ...prevCounts,
      [category]: numericValue,
    }));
  }, []);

  const handleIndependentIncrement = useCallback((category: IndependentCounterCategory) => {
    setCounts(prevCounts => ({
      ...prevCounts,
      [category]: prevCounts[category] + 1,
    }));
  }, []);

  const handleIndependentDecrement = useCallback((category: IndependentCounterCategory) => {
    setCounts(prevCounts => ({
      ...prevCounts,
      [category]: Math.max(0, prevCounts[category] - 1),
    }));
  }, []);

  const handleGoalChange = useCallback((category: 'main' | 'electricity', value: number) => {
    setGoals(prevGoals => ({
        ...prevGoals,
        [category]: Math.max(0, value),
    }));
  }, []);

  const handleDaysChange = useCallback((value: number) => {
    setRemainingWorkdays(Math.max(1, value));
  }, []);
  
  const handleAdjustmentChange = useCallback((category: 'main' | 'electricity', value: number) => {
    setOkAdjustments(prev => ({
        ...prev,
        [category]: isNaN(value) ? 0 : value,
    }));
  }, []);

  const handleClear = useCallback(() => {
    const { callsMade, callsReceived } = counts;
    setCounts({ ...initialState, callsMade, callsReceived });
  }, [counts]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <header className="text-center py-4">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">カウンター & テキストコピー</h1>
        <p className="text-slate-600 mt-2">日々の活動を記録し、ワンクリックで報告テキストをコピーします。（当日データ自動保存）</p>
      </header>

      <main className="space-y-6">
        <CounterSection
          counts={counts}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onClear={handleClear}
          lastSaveTime={lastSaveTime}
          onCountChange={handleCountChange}
        />
        <IndependentCounterSection
          callsMade={counts.callsMade}
          callsReceived={counts.callsReceived}
          onIncrement={handleIndependentIncrement}
          onDecrement={handleIndependentDecrement}
        />
        <ProgressTrackerSection
          goals={goals}
          remainingWorkdays={remainingWorkdays}
          totalMonthOks={totalMonthOks}
          onGoalChange={handleGoalChange}
          onDaysChange={handleDaysChange}
          okAdjustments={okAdjustments}
          onAdjustmentChange={handleAdjustmentChange}
        />
        <SummarySection
          date={ymdLocal(currentDate)}
          total={summary.total}
          rateMain={summary.rateMain}
          rateElectricity={summary.rateElectricity}
        />
        <CopySection textToCopy={previewText} />
        <DataManagementSection />
      </main>

       <footer className="text-center text-sm text-slate-500 pt-6 border-t mt-6">
        <p>Minimal Counter Copier v3.0 - React Edition with Daily Persistence</p>
      </footer>
    </div>
  );
};

export default App;
