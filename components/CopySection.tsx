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
    <section className="neumorphic-card p-4 sm:p-5 space-y-3">
      <h2 className="text-lg font-semibold text-color-dark">テキストコピー</h2>
      <div className="flex items-center gap-3 flex-wrap">
        <button 
            onClick={handleCopy} 
            className="btn-gradient px-5 py-2"
        >
          テキストをコピー
        </button>
        <span className="text-sm text-color-light hidden sm:inline">※ 指定の1行形式で出力します</span>
        <span className="text-sm text-gradient h-5 flex-grow text-right">{copyStatus}</span>
      </div>
      <div>
        <label htmlFor="preview-textarea" className="block text-sm mb-1 text-color-light">プレビュー</label>
        <textarea
          id="preview-textarea"
          className="w-full rounded-md p-3 font-mono text-xs form-input-neumorphic"
          rows={3}
          value={textToCopy}
          readOnly
        />
      </div>
    </section>
  );
};

export default CopySection;