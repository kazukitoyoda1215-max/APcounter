
import React, { useState, useCallback } from 'react';

interface CopySectionProps {
  textToCopy: string;
}

const CopySection: React.FC<CopySectionProps> = ({ textToCopy }) => {
  const [copyStatus, setCopyStatus] = useState<string>('');

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyStatus('コピーしました');
    } catch (err) {
      setCopyStatus('コピー失敗: テキストを選択しました');
      const textarea = document.getElementById('preview-textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.select();
      }
    }
    setTimeout(() => setCopyStatus(''), 2500);
  }, [textToCopy]);

  return (
    <section className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 space-y-3">
      <h2 className="text-lg font-semibold text-slate-800">テキストコピー</h2>
      <div className="flex items-center gap-3 flex-wrap">
        <button 
            onClick={handleCopy} 
            className="px-5 py-2 rounded-md bg-slate-800 text-white font-semibold hover:bg-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
        >
          テキストをコピー
        </button>
        <span className="text-sm text-slate-500 hidden sm:inline">※ 指定の1行形式で出力します</span>
        <span className="text-sm text-indigo-600 h-5 flex-grow text-right">{copyStatus}</span>
      </div>
      <div>
        <label htmlFor="preview-textarea" className="block text-sm mb-1 text-slate-600">プレビュー</label>
        <textarea
          id="preview-textarea"
          className="w-full border rounded-md p-3 font-mono text-xs bg-slate-100 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={3}
          value={textToCopy}
          readOnly
        />
      </div>
    </section>
  );
};

export default CopySection;
