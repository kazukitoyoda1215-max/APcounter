import React, { useState, useCallback } from 'react';
import { CopyIcon, ChatworkIcon } from './icons';

interface ReportingConsoleProps {
  textToCopy: string;
}

const ReportingConsole: React.FC<ReportingConsoleProps> = ({ textToCopy }) => {
  const [copyStatus, setCopyStatus] = useState<string>('');

  const showStatus = (msg: string) => {
    setCopyStatus(msg);
    setTimeout(() => setCopyStatus(''), 2500);
  };

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      showStatus('コピーしました！');
    } catch (err) {
      showStatus('コピーに失敗しました');
    }
  }, [textToCopy]);
  
  const handlePostToChatwork = useCallback(() => {
    // This is a simplified implementation. It copies the text and opens Chatwork.
    // A real implementation would use Chatwork's API.
    handleCopy();
    window.open('https://www.chatwork.com/', '_blank', 'noopener,noreferrer');
  }, [handleCopy]);


  return (
    <section className="neumorphic-card p-4 sm:p-5 space-y-3">
      <h2 className="text-lg font-semibold text-color-dark">報告コンソール</h2>
      <div>
        <label htmlFor="preview-textarea" className="block text-sm mb-1 text-color-light">プレビュー</label>
        <textarea
          id="preview-textarea"
          className="w-full rounded-md p-3 font-mono text-xs bg-transparent neumorphic-card-inner resize-none"
          rows={5}
          value={textToCopy}
          readOnly
        />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={handleCopy} className="btn-gradient px-4 py-2 flex items-center gap-2">
            <CopyIcon className="w-5 h-5" />
            <span>テキストをコピー</span>
        </button>
        <button onClick={handlePostToChatwork} className="btn-gradient px-4 py-2 flex items-center gap-2">
            <ChatworkIcon className="w-5 h-5" />
            <span>Chatworkへ投稿</span>
        </button>
        <span className="text-sm text-gradient h-5 flex-grow text-right">{copyStatus}</span>
      </div>
    </section>
  );
};

export default ReportingConsole;
