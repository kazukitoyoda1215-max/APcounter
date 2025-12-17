
import React, { useState } from 'react';
import { View } from '../types';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<View>('daily');

  if (!isOpen) return null;

  const TabButton = ({ tab, label }: { tab: View; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 font-semibold text-sm rounded-lg transition-all duration-300 btn-neumorphic ${
        activeTab === tab ? 'active text-gradient' : 'text-color-light'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      className="fixed inset-0 bg-[var(--shadow-dark)] bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="neumorphic-card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gradient">使い方ガイド</h2>
            <button
              onClick={onClose}
              className="btn-neumorphic rounded-full p-2 w-8 h-8 flex items-center justify-center"
            >
              &times;
            </button>
          </div>

          <div className="flex gap-2 border-b border-[var(--shadow-dark)] pb-2">
            <TabButton tab="daily" label="デイリー" />
            <TabButton tab="monthly" label="月次設定" />
            <TabButton tab="achievements" label="実績" />
          </div>

          <div className="space-y-4">
            {activeTab === 'daily' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-semibold text-color-dark">📞 デイリー画面の使い方</h3>
                <div className="neumorphic-card-inner p-4 space-y-2">
                  <h4 className="font-bold text-color-primary">1. タイマーとネコ</h4>
                  <p className="text-sm text-color-light">
                    再生ボタン(▶)でタイマーを開始し、通話時間を計測します。タイマーが動いている間、ネコが歩きます。
                  </p>
                </div>
                <div className="neumorphic-card-inner p-4 space-y-2">
                  <h4 className="font-bold text-color-primary">2. クイックアクション</h4>
                  <p className="text-sm text-color-light">
                    「OK獲得」「NG」「留守」などのボタンを押すと、カウントが+1され、同時にタイマーが停止・リセットされます。通話終了時に便利です。
                  </p>
                </div>
                <div className="neumorphic-card-inner p-4 space-y-2">
                  <h4 className="font-bold text-color-primary">3. カウンター</h4>
                  <p className="text-sm text-color-light">
                    手動で件数を増減できます。数値をクリックすると直接入力も可能です。
                  </p>
                </div>
                <div className="neumorphic-card-inner p-4 space-y-2">
                  <h4 className="font-bold text-color-primary">4. 報告コピー</h4>
                  <p className="text-sm text-color-light">
                    画面下部の「報告コンソール」にある「テキストをコピー」ボタンで、チャット等に貼り付けられる形式の日報テキストをコピーできます。
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'monthly' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-semibold text-color-dark">📅 月次・設定の使い方</h3>
                <div className="neumorphic-card-inner p-4 space-y-2">
                  <h4 className="font-bold text-color-secondary">1. 目標設定</h4>
                  <p className="text-sm text-color-light">
                    「月次」タブの一番上にある設定エリアで、今月の「主商材」「電気」の目標件数と、稼働日数を入力してください。
                  </p>
                </div>
                <div className="neumorphic-card-inner p-4 space-y-2">
                  <h4 className="font-bold text-color-secondary">2. 進捗確認</h4>
                  <p className="text-sm text-color-light">
                    入力した目標に基づいて、達成率や「1日あと何件取ればいいか」が自動計算されます。
                    ペースが良いと緑色、遅れていると赤色で表示されます。
                  </p>
                </div>
                 <div className="neumorphic-card-inner p-4 space-y-2">
                  <h4 className="font-bold text-color-secondary">3. 補正入力</h4>
                  <p className="text-sm text-color-light">
                    もし実際の件数とアプリ上の件数がズレてしまった場合は、「補正値」欄に数字を入れて調整できます（例: -1, 5 など）。
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-semibold text-color-dark">🏆 実績・トロフィー</h3>
                <div className="neumorphic-card-inner p-4 space-y-2">
                  <h4 className="font-bold text-color-warning">モチベーションアップ！</h4>
                  <p className="text-sm text-color-light">
                    「初めてのOK」「5日連続目標達成」「累計100コール」など、特定の条件を満たすとバッジが解除されます。
                    全てのバッジ獲得を目指して頑張りましょう！
                  </p>
                </div>
                <div className="neumorphic-card-inner p-4 space-y-2">
                  <h4 className="font-bold text-color-warning">確認方法</h4>
                  <p className="text-sm text-color-light">
                    「実績」タブから獲得したバッジの一覧を確認できます。未獲得のバッジはグレーアウトされています。
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
