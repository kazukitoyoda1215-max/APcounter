export type CounterCategory = 'okMain' | 'okElectricity' | 'ng' | 'ps' | 'na' | 'ex';
export type IndependentCounterCategory = 'callsMade' | 'callsReceived';
export type OneClickActionCategory = 'ok' | 'ng' | 'na' | 'ps';
export type View = 'daily' | 'monthly' | 'achievements';
export type Theme = 'light' | 'dark';

export interface CounterState {
  okMain: number;
  okElectricity: number;
  ng: number;
  ps: number;
  na: number;
  ex: number;
  callsMade: number;
  callsReceived: number;
}

export type AchievementId = 
  | 'FIRST_OK_MAIN'
  | 'TEN_OK_MAIN'
  | 'MONTHLY_GOAL_MAIN'
  | 'TOTAL_CALLS_100'
  | 'TOTAL_CALLS_1000'
  | 'STREAK_5'
  // New
  | 'FIRST_OK_ELEC'
  | 'TEN_OK_ELEC'
  | 'MONTHLY_GOAL_ELEC'
  | 'PERFECT_DAY'
  | 'STREAK_10'
  | 'TOTAL_OK_MAIN_100';

export interface Achievement {
    id: AchievementId;
    title: string;
    description: string;
    unlocked: boolean;
    unlockedDate: string | null;
}

export type ShortcutActionId =
  | 'okMain_inc' | 'okMain_dec'
  | 'okElectricity_inc' | 'okElectricity_dec'
  | 'ng_inc' | 'ng_dec'
  | 'ps_inc' | 'ps_dec'
  | 'na_inc' | 'na_dec'
  | 'ex_inc' | 'ex_dec'
  | 'callsMade_inc' | 'callsMade_dec'
  | 'callsReceived_inc' | 'callsReceived_dec'
  | 'oneClick_ok' | 'oneClick_ng' | 'oneClick_ps' | 'oneClick_na'
  | 'timer_start' | 'timer_stop';

export type ShortcutConfig = Partial<Record<ShortcutActionId, string>>;
