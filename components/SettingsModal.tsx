
import React, { useState, useEffect, useCallback } from 'react';
import type { ShortcutConfig, ShortcutActionId } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ShortcutConfig;
  onConfigChange: (newConfig: ShortcutConfig) => void;
}

const ACTION_MAP: Record<ShortcutActionId, string> = {
  okMain_inc: 'OK (主商材) +', okMain_dec: 'OK (主商材) -',
  okElectricity_inc: 'OK (電気) +', okElectricity_dec: 'OK (電気) -',
  ng_inc: 'NG +', ng_dec: 'NG -',
  ps_inc: '見込み +', ps_dec: '見込み -',
  na_inc: '留守 +', na_dec: '留守 -',
  ex_inc: '対象外 +', ex_dec: '対象外 -',
  callsMade_inc: 'コール数 +', callsMade_dec: 'コール数 -',
  callsReceived_inc: '入電数 +', callsReceived_dec: '入電数 -',
  oneClick_ok: 'OK獲得 (ワンクリック)',
  oneClick_ng: 'NG (ワンクリック)',
  oneClick_ps: '見込み (ワンクリック)',
  oneClick_na: '留守 (ワンクリック)',
  timer_start: 'タイマー開始',
  timer_stop: 'タイマー停止',
};

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onConfigChange }) => {
  const [listeningFor, setListeningFor] = useState<ShortcutActionId | null>(null);

  const handleKeydown = useCallback((event: KeyboardEvent) => {
    if (!listeningFor) return;

    event.preventDefault();
    event.stopPropagation();

    const newKey = event.key;

    // Unset key if Escape is pressed
    if (newKey === 'Escape') {
      const newConfig = { ...config };
      delete newConfig[listeningFor];
      onConfigChange(newConfig);
      setListeningFor(null);
      return;
    }
    
    // Check for conflicts
    const existingAction = (Object.entries(config) as [ShortcutActionId, string][]).find(([, key]) => key === newKey);
    if (existingAction && existingAction[0] !== listeningFor) {
        if (!window.confirm(`キー "${newKey}" は既に "${ACTION_MAP[existingAction[0]]}" に割り当てられています。上書きしますか？`)) {
            setListeningFor(null);
            return;
        }
    }
    
    const newConfig = { ...config, [listeningFor]: newKey };
    
    // Remove previous assignment if it existed
    if(existingAction) {
        delete newConfig[existingAction[0]];
    }

    onConfigChange(newConfig);
    setListeningFor(null);
  }, [listeningFor, config, onConfigChange]);

  useEffect(() => {
    if (listeningFor) {
      window.addEventListener('keydown', handleKeydown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [listeningFor, handleKeydown]);

  if (!isOpen) return null;

  const renderKey = (actionId: ShortcutActionId) => {
    const key = config[actionId];
    if (listeningFor === actionId) return 'キーを押してください...';
    return key ? `"${key}"` : '未設定';
  };
  
  const sections: {title: string, actions: ShortcutActionId[]}[] = [
      { title: 'ワンクリックアクション', actions: ['oneClick_ok', 'oneClick_ng', 'oneClick_ps', 'oneClick_na'] },
      { title: 'タイマー', actions: ['timer_start', 'timer_stop'] },
      { title: 'カウンター (+)', actions: ['okMain_inc', 'okElectricity_inc', 'ng_inc', 'ps_inc', 'na_inc', 'ex_inc', 'callsMade_inc', 'callsReceived_inc'] },
      { title: 'カウンター (-)', actions: ['okMain_dec', 'okElectricity_dec', 'ng_dec', 'ps_dec', 'na_dec', 'ex_dec', 'callsMade_dec', 'callsReceived_dec'] },
  ]

  return (
    <div
      className="fixed inset-0 bg-[var(--shadow-dark)] bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="neumorphic-card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gradient">ショートカットキー設定</h2>
            <button onClick={onClose} className="btn-neumorphic rounded-full p-2 w-8 h-8 flex items-center justify-center">
              &times;
            </button>
          </div>
          <p className="text-sm text-color-light">各アクションにキーボードのキーを割り当てます。設定したいアクションのボタンをクリックし、割り当てたいキーを押してください。Escキーで設定を解除できます。</p>
          
          {sections.map(({title, actions}) => (
            <div key={title} className="neumorphic-card-inner p-4 space-y-3">
                <h3 className="font-semibold text-color-dark">{title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(actions as ShortcutActionId[]).map(actionId => (
                    <div key={actionId} className="flex flex-col gap-1">
                    <span className="text-sm text-color-light">{ACTION_MAP[actionId]}</span>
                    <button
                        onClick={() => setListeningFor(actionId)}
                        className={`btn-neumorphic py-2 truncate ${listeningFor === actionId ? 'active' : ''}`}
                    >
                        {renderKey(actionId)}
                    </button>
                    </div>
                ))}
                </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
