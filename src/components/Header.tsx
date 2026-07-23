import { ShoppingBag, Globe, User, LogOut, Settings } from 'lucide-react';
import { TranslationSet } from '../translations';
import { UserSession } from '../types';

interface HeaderProps {
  t: TranslationSet;
  currentLang: 'ko' | 'vi';
  setLang: (lang: 'ko' | 'vi') => void;
  cartCount: number;
  onOpenCart: () => void;
  userSession: UserSession;
  onToggleUserSession: () => void;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  onLogoClick?: () => void;
}

export default function Header({
  t,
  currentLang,
  setLang,
  cartCount,
  onOpenCart,
  userSession,
  onToggleUserSession,
  isAdminMode,
  onToggleAdminMode,
  onLogoClick,
}: HeaderProps) {
  const isDevEnv = (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || Boolean((import.meta as any).env?.DEV);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={onLogoClick}
          className="flex items-center gap-3 cursor-pointer group"
          title={currentLang === 'ko' ? '메인 홈으로 이동' : 'Về trang chủ'}
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-[#0066FF] to-[#00D1FF] rounded-lg flex items-center justify-center shadow-lg shadow-[#0066FF]/15">
            <span className="font-mono text-xl font-black text-white">L</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 font-sans">
              {t.brand}
            </h1>
            <p className="text-[9px] tracking-widest text-[#0066FF] uppercase font-mono hidden sm:block">
              Premium Tech Heritage
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Language Selector Toggler */}
          <button
            onClick={() => setLang(currentLang === 'ko' ? 'vi' : 'ko')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-mono text-slate-700 hover:text-[#0066FF] hover:border-[#0066FF] transition-all duration-300 bg-slate-50 hover:bg-[#0066FF]/5 cursor-pointer"
            title="Switch Language"
            id="lang-toggle-btn"
          >
            <Globe className="w-3.5 h-3.5 text-[#0066FF]" />
            <span>{currentLang === 'ko' ? '한국어' : 'Tiếng Việt'}</span>
          </button>

          {/* Admin Toggle Toggler (Shown only in development environment) */}
          {isDevEnv && (
            <button
              onClick={onToggleAdminMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 font-mono text-xs cursor-pointer ${
                isAdminMode
                  ? 'bg-rose-50 border-rose-300 text-rose-600 hover:bg-rose-100 font-semibold shadow-sm shadow-rose-100'
                  : 'bg-slate-50 border-slate-200 text-slate-650 hover:text-[#0066FF] hover:border-[#0066FF] hover:bg-[#0066FF]/5'
              }`}
              id="admin-toggle-btn"
              title="Toggle Admin Mode"
            >
              <Settings className={`w-3.5 h-3.5 ${isAdminMode ? 'animate-spin' : ''}`} />
              <span>{currentLang === 'ko' ? (isAdminMode ? '관리자 종료' : '관리자 모드') : (isAdminMode ? 'Thoát Admin' : 'Chế độ Admin')}</span>
            </button>
          )}

          {/* Member Authenticate Simulation Button */}
          <div className="flex items-center gap-2">
            {userSession.isLoggedIn ? (
              <div className="flex items-center gap-2 bg-[#0066FF]/5 px-3 py-1.5 rounded-full border border-[#0066FF]/20">
                <div className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
                <span className="text-xs text-[#0066FF] font-semibold font-sans">
                  VIP {userSession.name}
                </span>
                <button
                  onClick={onToggleUserSession}
                  className="text-slate-500 hover:text-red-500 transition-colors ml-1"
                  title={t.logout}
                  id="logout-btn"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onToggleUserSession}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:border-[#0066FF] text-xs text-slate-750 hover:text-[#0066FF] transition-all duration-300 font-sans"
                id="login-simulate-btn"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.memberLogin.split(' ')[0]}</span>
              </button>
            )}
          </div>

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-[#0066FF] text-slate-700 hover:text-[#0066FF] transition-all duration-300 shadow-sm group"
            id="cart-toggle-btn"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#0066FF] to-[#00D1FF] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-bounce border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
