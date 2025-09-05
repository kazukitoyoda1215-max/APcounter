export type CounterCategory = 'okMain' | 'okElectricity' | 'ng' | 'ps' | 'na' | 'ex';
export type IndependentCounterCategory = 'callsMade' | 'callsReceived';

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
