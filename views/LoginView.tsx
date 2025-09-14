
import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: (name: string, pass: string) => Promise<void>;
  onRegister: (name: string, pass: string) => Promise<void>;
  error?: string;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onRegister, error }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'login' | 'register' | null>(null);

  const handleSubmit = async (action: 'login' | 'register') => {
    if (name.trim() && password.trim() && !isLoading) {
      setIsLoading(true);
      setLoadingAction(action);
      try {
        if (action === 'login') {
          await onLogin(name.trim(), password.trim());
        } else {
          await onRegister(name.trim(), password.trim());
        }
      } finally {
        setIsLoading(false);
        setLoadingAction(null);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit('login');
    }
  };

  const isSuccessMessage = error?.includes('完了');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="neumorphic-card p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center text-gradient">
            進捗確認くん
          </h1>
          <p className="text-center text-color-light text-sm">
            名前とパスワードを入力してください
          </p>
          <div>
            <label htmlFor="username" className="sr-only">
              ユーザー名
            </label>
            <input
              id="username"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input-neumorphic text-center"
              placeholder="ユーザー名"
              required
              autoFocus
              aria-label="Username"
              disabled={isLoading}
            />
          </div>
           <div>
            <label htmlFor="password-input" className="sr-only">
              パスワード
            </label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="form-input-neumorphic text-center"
              placeholder="パスワード"
              required
              aria-label="Password"
              disabled={isLoading}
            />
          </div>
          {error && <p className={`text-sm text-center ${isSuccessMessage ? 'text-color-success' : 'text-color-danger'}`}>{error}</p>}
          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <button 
              type="button" 
              onClick={() => handleSubmit('register')} 
              className="w-full btn-neumorphic py-3" 
              disabled={isLoading}
            >
              {isLoading && loadingAction === 'register' ? '登録中...' : '新規登録'}
            </button>
            <button 
              type="button" 
              onClick={() => handleSubmit('login')} 
              className="w-full btn-gradient py-3" 
              disabled={isLoading}
            >
              {isLoading && loadingAction === 'login' ? 'ログイン中...' : 'ログイン'}
            </button>
          </div>
        </div>
        <footer className="text-center text-sm text-color-light pt-8">
            <p>Sales Dashboard v7.0 - Gamification Edition</p>
            <p className="mt-1">©toyosystem</p>
        </footer>
      </div>
    </div>
  );
};

export default LoginView;
