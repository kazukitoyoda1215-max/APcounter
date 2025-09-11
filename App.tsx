
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import CounterSection from './components/CounterSection';
import CopySection from './components/CopySection';
import SummarySection from './components/SummarySection';
import IndependentCounterSection from './components/IndependentCounterSection';
import ProgressTrackerSection from './components/ProgressTrackerSection';
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

// --- API Helper ---
const API_ENDPOINT = "https://script.google.com/macros/s/AKfycbzxi7ldoGPbAjVH7VIeh3BOH-V56m3Rg1y2YpRlcFqm3WaWNehR61lW8xoRQaCbCaBdqw/exec";

async function api<T = any>(
  action: string,
  payload: Record<string, any>,
  timeoutMs = 10000
): Promise<{ ok: boolean; data?: T; token?: string; error?: { code: number; message: string; }; }> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            body: JSON.stringify({ action, ...payload }),
            signal: controller.signal
        });
        clearTimeout(id);

        let responseData: any;
        try {
            responseData = await response.json();
        } catch {
            return { ok: false, error: { code: 0, message: 'Invalid JSON from server' } };
        }
        
        return responseData;

    } catch (err: any) {
        clearTimeout(id);
        const message = err?.name === 'AbortError' ? 'Timeout' : String(err);
        return { ok: false, error: { code: -1, message } };
    }
}


// --- Auth Section Component ---
interface AuthSectionProps {
    isLoggedIn: boolean;
    currentName: string;
    name: string;
    onNameChange: (value: string) => void;
    password: any;
    onPasswordChange: (value: string) => void;
    message: string;
    isRegisterPrompt: boolean;
    onLogin: () => void;
    onRegister: () => void;
    onLogout: () => void;
    onSave: () => void;
    onLoad: () => void;
}

const AuthSection: React.FC<AuthSectionProps> = ({
    isLoggedIn, currentName, name, onNameChange, password, onPasswordChange,
    message, isRegisterPrompt, onLogin, onRegister, onLogout, onSave, onLoad
}) => {
    return (
        <section className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">アカウント &amp; データ同期</h2>
            
            {!isLoggedIn ? (
                <div className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">ユーザー</label>
                            <input type="text" id="name" value={name} onChange={e => onNameChange(e.target.value)} className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="pw" className="block text-sm font-medium text-slate-600 mb-1">パスワード</label>
                            <input type="password" id="pw" value={password} onChange={e => onPasswordChange(e.target.value)} className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <button onClick={onLogin} className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">ログイン</button>
                        {isRegisterPrompt && (
                             <button onClick={onRegister} className="px-4 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">はい、登録します</button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <p className="text-slate-700">ようこそ、<span className="font-bold">{currentName}</span>さん</p>
                     <div className="flex items-center gap-3 flex-wrap">
                        <button onClick={onSave} className="px-4 py-2 rounded-md bg-sky-600 text-white font-semibold hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">データをクラウドに保存</button>
                        <button onClick={onLoad} className="px-4 py-2 rounded-md bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">データをクラウドから復元</button>
                        <button onClick={onLogout} className="px-4 py-2 rounded-md bg-slate-500 text-white font-semibold hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400">ログアウト</button>
                    </div>
                </div>
            )}
            
            {message && (
                <div className="text-sm text-slate-600 pt-2 border-t mt-3">{message}</div>
            )}
        </section>
    );
};


// --- Main App Component ---
const App: React.FC = () => {
  const [counts, setCounts] = useState<CounterState>(initialState);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [lastSaveTime, setLastSaveTime] = useState<string>('');
  const [goals, setGoals] = useState<{ main: number; electricity: number }>({ main: 0, electricity: 0 });
  const [totalWorkdays, setTotalWorkdays] = useState<number>(1);
  const [completedWorkdays, setCompletedWorkdays] = useState<number>(0);
  const [okAdjustments, setOkAdjustments] = useState<{ main: number; electricity: number }>({ main: 0, electricity: 0 });

  // Auth state
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [currentName, setCurrentName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [isRegisterPrompt, setIsRegisterPrompt] = useState(false);
  const [lastTried, setLastTried] = useState<{name: string, password: string} | null>(null);

  // Logic to handle automatic reset of monthly settings
  const handleMonthChange = useCallback((date: Date) => {
    const currentMonth = ymdLocal(date).substring(0, 7);
    
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        // If the saved month is different from the current month, reset settings
        if (parsed.lastLoadedMonth !== currentMonth) {
          setGoals({ main: 0, electricity: 0 });
          setTotalWorkdays(1);
          setCompletedWorkdays(0);
          setOkAdjustments({ main: 0, electricity: 0 });
        } else {
          // Same month, load saved settings
          setGoals({
              main: parsed.goals?.main || 0,
              electricity: parsed.goals?.electricity || 0,
          });
          setTotalWorkdays(parsed.totalWorkdays || 1);
          setCompletedWorkdays(parsed.completedWorkdays || 0);
          setOkAdjustments(parsed.okAdjustments || { main: 0, electricity: 0 });
        }
      }
    } catch {
      // On error, do nothing; initial state will be used
    }
  }, []);


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

    // Check if the month has changed and reset settings if necessary
    handleMonthChange(currentDate);

    const intervalId = setInterval(() => {
      const today = new Date();
      if (ymdLocal(today) !== ymdLocal(currentDate)) {
        setCurrentDate(today);
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [currentDate, handleMonthChange]);

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
        totalWorkdays,
        completedWorkdays,
        okAdjustments,
        lastLoadedMonth: currentMonth
    };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
  }, [goals, totalWorkdays, completedWorkdays, okAdjustments, currentDate]);

  // Effect for auth check on boot
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedName = localStorage.getItem('ap_day_v3_username');
    if (token && storedName) {
        setIsLoggedIn(true);
        setCurrentName(storedName);
        setName(storedName);
        setAuthMessage(`おかえりなさい、${storedName}さん`);
    }
  }, []);

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
    const effectiveCount = counts.okMain + counts.ng + counts.ps;
    const effectiveRate = counts.callsMade > 0 ? (effectiveCount / counts.callsMade) * 100 : 0;
    return { total, rateMain, rateElectricity, effectiveRate };
  }, [counts]);

  const previewText = useMemo(() => {
    const d = ymdLocal(currentDate);
    return `${d}　OK(主) ${counts.okMain}件 / OK(電) ${counts.okElectricity}件 / NG ${counts.ng}件 / 見込み ${counts.ps}件 / 留守 ${counts.na}件 / 取次対象外 ${counts.ex}件 / コール ${counts.callsMade}件 / 入電 ${counts.callsReceived}件（合計 ${summary.total}件・成約率(主) ${summary.rateMain.toFixed(1)}% / 成約率(電) ${summary.rateElectricity.toFixed(1)}%）`;
  }, [counts, currentDate, summary]);

  // --- Auth Logic Callbacks ---
  const showAuthMessage = (msg: string, isPrompt = false) => {
    setAuthMessage(msg);
    setIsRegisterPrompt(isPrompt);
  };

  const loginFlow = useCallback(async () => {
    const trimmedName = name.trim();
    if (!trimmedName || !password) {
        return showAuthMessage('ユーザーとパスワードを入力してください');
    }
    showAuthMessage('ログイン中…');
    setLastTried({ name: trimmedName, password });

    const r = await api('/auth/login', { name: trimmedName, password });

    if (r.ok && r.token) {
        localStorage.setItem('token', r.token);
        localStorage.setItem('ap_day_v3_username', trimmedName);
        setCurrentName(trimmedName);
        setIsLoggedIn(true);
        showAuthMessage('ログイン成功！');
    } else {
        if (r.error?.code === 404) {
            showAuthMessage('このユーザーが見つかりません。新規登録しますか？', true);
        } else if (r.error?.code === 401) {
            showAuthMessage('パスワードが違います。');
        } else {
            showAuthMessage('エラー: ' + (r.error?.message || '不明なエラー'));
        }
    }
  }, [name, password]);

  const registerFlow = useCallback(async () => {
    if (!lastTried) return;
    const { name: lastName, password: lastPassword } = lastTried;
    showAuthMessage('登録中…');
    const r = await api('/auth/register', { name: lastName, password: lastPassword });
    if (!r.ok) {
        if (r.error?.code === 409) return showAuthMessage('すでに登録済みです。ログインしてください。');
        return showAuthMessage('登録エラー: ' + (r.error?.message || '不明なエラー'));
    }
    await loginFlow();
  }, [lastTried, loginFlow]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('ap_day_v3_username');
    setIsLoggedIn(false);
    setCurrentName(null);
    setName('');
    setPassword('');
    showAuthMessage('ログアウトしました');
  }, []);

  const saveDataToServer = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || !currentName) return showAuthMessage('未ログイン');
    
    showAuthMessage('保存中...');
    try {
        const dataToSave: { [key: string]: string } = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('ap_day_v3_')) {
                dataToSave[key] = localStorage.getItem(key) || '';
            }
        }
        const r = await api('/data/set', { name: currentName, data: dataToSave, authorization: token });
        if (r.ok) {
            showAuthMessage('保存しました');
        } else {
            showAuthMessage('保存エラー: ' + (r.error?.message || '不明なエラー'));
        }
    } catch (e) {
        showAuthMessage('保存中にエラーが発生しました。');
    }
  }, [currentName]);

  const loadDataFromServer = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || !currentName) return showAuthMessage('未ログイン');

    if (!confirm('サーバーからデータをロードすると、現在のローカルデータは上書きされます。よろしいですか？')) return;

    showAuthMessage('ロード中...');
    const r = await api<{ [key: string]: string }>('/data/get', { name: currentName, authorization: token });
    if (r.ok && r.data) {
        const dataToImport = r.data;
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('ap_day_v3_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        for (const key in dataToImport) {
            if (Object.prototype.hasOwnProperty.call(dataToImport, key) && key.startsWith('ap_day_v3_')) {
                localStorage.setItem(key, dataToImport[key]);
            }
        }
        alert('データのロードが完了しました。ページをリロードします。');
        window.location.reload();
    } else {
        showAuthMessage('データ取得エラー: ' + (r.error?.message || '不明なエラー'));
    }
  }, [currentName]);


  // --- Event Handlers ---
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

  const handleTotalDaysChange = useCallback((value: number) => {
    setTotalWorkdays(Math.max(1, value));
  }, []);

  const handleCompletedDaysChange = useCallback((value: number) => {
    setCompletedWorkdays(Math.max(0, value));
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
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">進捗確認くん</h1>
        <p className="text-slate-600 mt-2">日々の活動を記録し、ワンクリックで報告テキストをコピーします。（当日データ自動保存）</p>
      </header>

      <AuthSection
        isLoggedIn={isLoggedIn}
        currentName={currentName || ''}
        name={name}
        onNameChange={setName}
        password={password}
        onPasswordChange={setPassword}
        message={authMessage}
        isRegisterPrompt={isRegisterPrompt}
        onLogin={loginFlow}
        onRegister={registerFlow}
        onLogout={logout}
        onSave={saveDataToServer}
        onLoad={loadDataFromServer}
      />

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
          totalWorkdays={totalWorkdays}
          completedWorkdays={completedWorkdays}
          totalMonthOks={totalMonthOks}
          onGoalChange={handleGoalChange}
          onTotalDaysChange={handleTotalDaysChange}
          onCompletedDaysChange={handleCompletedDaysChange}
          okAdjustments={okAdjustments}
          onAdjustmentChange={handleAdjustmentChange}
        />
        <SummarySection
          date={ymdLocal(currentDate)}
          total={summary.total}
          rateMain={summary.rateMain}
          rateElectricity={summary.rateElectricity}
          effectiveRate={summary.effectiveRate}
        />
        <CopySection textToCopy={previewText} />
      </main>

       <footer className="text-center text-sm text-slate-500 pt-6 border-t mt-6">
        <p>Minimal Counter Copier v3.0 - React Edition with Daily Persistence</p>
        <p className="mt-1">©toyosystem</p>
      </footer>
    </div>
  );
};

export default App;
