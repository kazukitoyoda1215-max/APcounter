import React, { useCallback, useRef } from 'react';

const DataManagementSection: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = useCallback(() => {
        try {
            const dataToExport: { [key: string]: string } = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('ap_day_v3_')) {
                    dataToExport[key] = localStorage.getItem(key) || '';
                }
            }

            if (Object.keys(dataToExport).length === 0) {
                alert('エクスポートするデータがありません。');
                return;
            }

            const jsonString = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const ymd = new Date().toISOString().slice(0, 10);
            link.href = url;
            link.download = `counter_backup_${ymd}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to export data:', error);
            alert('データのエクスポートに失敗しました。');
        }
    }, []);

    const handleImportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        if (!confirm('現在のデータを上書きして、ファイルからデータをインポートします。よろしいですか？この操作は元に戻せません。')) {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error('File content is not readable.');
                }
                const dataToImport = JSON.parse(text);

                if (typeof dataToImport !== 'object' || dataToImport === null) {
                    throw new Error('無効なファイル形式です。');
                }
                
                const keysToRemove: string[] = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('ap_day_v3_')) {
                        keysToRemove.push(key);
                    }
                }
                keysToRemove.forEach(key => localStorage.removeItem(key));

                let importedCount = 0;
                for (const key in dataToImport) {
                    if (Object.prototype.hasOwnProperty.call(dataToImport, key) && key.startsWith('ap_day_v3_')) {
                        const value = dataToImport[key];
                        if (typeof value === 'string') {
                           localStorage.setItem(key, value);
                           importedCount++;
                        }
                    }
                }
                
                if (importedCount === 0) {
                    throw new Error('ファイルに有効なデータが含まれていません。');
                }

                alert('データのインポートが完了しました。ページをリロードします。');
                window.location.reload();

            } catch (error) {
                console.error('Failed to import data:', error);
                alert(`データのインポートに失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.onerror = () => {
             alert('ファイルの読み込みに失敗しました。');
             if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <section className="glass-card rounded-2xl p-4 sm:p-5 space-y-4">
            <h2 className="text-lg font-semibold text-gray-200">ローカルデータ管理</h2>
            <p className="text-sm text-gray-400">
                現在のカウンターデータをファイルにエクスポート（バックアップ）したり、ファイルからインポート（復元）したりできます。
                インポートを行うと現在のデータはすべて上書きされますのでご注意ください。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                    onClick={handleExport}
                    className="btn-neon btn-neon-sky px-5 py-2 font-semibold"
                >
                    データをエクスポート
                </button>
                <button
                    onClick={triggerFileSelect}
                    className="btn-neon btn-neon-teal px-5 py-2 font-semibold"
                >
                    データをインポート
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImportChange}
                    accept=".json"
                    className="hidden"
                    aria-hidden="true"
                />
            </div>
        </section>
    );
};

export default DataManagementSection;
