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
