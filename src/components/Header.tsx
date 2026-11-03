import React from 'react';
import {
  Volume2,
  VolumeX,
  History,
  Palette,
  Keyboard,
  Calculator,
  Binary,
  ArrowLeftRight,
  Landmark,
  Calendar,
} from 'lucide-react';
import { CalculatorMode, AppTheme } from '../types/calculator';

interface HeaderProps {
  currentMode: CalculatorMode;
  onSelectMode: (mode: CalculatorMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  usePersianDigits: boolean;
  onTogglePersianDigits: () => void;
  theme: AppTheme;
  onChangeTheme: (theme: AppTheme) => void;
  historyCount: number;
  onToggleHistory: () => void;
  onOpenShortcuts: () => void;
}

const THEMES: { id: AppTheme; nameFa: string; color: string }[] = [
  { id: 'dark', nameFa: 'تاریک', color: 'bg-slate-900 border-slate-700' },
  { id: 'light', nameFa: 'روشن', color: 'bg-slate-100 border-slate-300' },
  { id: 'navy', nameFa: 'نیلی', color: 'bg-indigo-950 border-indigo-700' },
  { id: 'emerald', nameFa: 'زمردی', color: 'bg-emerald-950 border-emerald-700' },
  { id: 'amber', nameFa: 'کهربایی', color: 'bg-stone-900 border-amber-600' },
];

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  soundEnabled,
  onToggleSound,
  usePersianDigits,
  onTogglePersianDigits,
  theme,
  onChangeTheme,
  historyCount,
  onToggleHistory,
  onOpenShortcuts,
}) => {
  const [showThemeMenu, setShowThemeMenu] = React.useState(false);

  const modes: { id: CalculatorMode; label: string; icon: React.ReactNode }[] = [
    { id: 'standard', label: 'استاندارد', icon: <Calculator className="w-4 h-4" /> },
    { id: 'scientific', label: 'علمی و مهندسی', icon: <Binary className="w-4 h-4" /> },
    { id: 'converter', label: 'تبدیل واحد', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'finance', label: 'محاسبات مالی و وام', icon: <Landmark className="w-4 h-4" /> },
    { id: 'date', label: 'تاریخ و سن', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <header className="w-full bg-slate-900/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
            <Calculator className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 tracking-tight leading-none">
              ماشین حساب پیشرفته
            </h1>
            <span className="text-[11px] text-slate-400 font-mono tracking-wider">
              SMART CALCULATOR
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Modes (Single-line, clean buttons) */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-800/60 rounded-xl border border-slate-700/50">
          {modes.map((m) => {
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Functional Utilities */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Persian / English Numerals Toggle */}
          <button
            onClick={onTogglePersianDigits}
            title={usePersianDigits ? 'تغییر به اعداد انگلیسی' : 'تغییر به اعداد فارسی'}
            className="h-9 px-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5"
            aria-label="Toggle Persian Digits"
          >
            <span className="font-mono text-amber-400 font-bold">
              {usePersianDigits ? '۱۲۳' : '123'}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'صدا فعال است' : 'صدا غیرفعال است'}
            className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
              soundEnabled
                ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700/60 text-amber-400'
                : 'bg-slate-800/40 border-slate-700/40 text-slate-500 hover:text-slate-300'
            }`}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              title="تغییر تم رنگی"
              className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 flex items-center justify-center transition-colors"
              aria-label="Change Theme"
            >
              <Palette className="w-4 h-4" />
            </button>

            {showThemeMenu && (
              <div
                className="absolute left-0 mt-2 w-36 bg-slate-900 border border-slate-700/80 rounded-xl shadow-xl py-1.5 z-50 text-right backdrop-blur-md"
                onMouseLeave={() => setShowThemeMenu(false)}
              >
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 border-b border-slate-800 mb-1">
                  انتخاب پوسته
                </div>
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onChangeTheme(t.id);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 text-slate-200 transition-colors ${
                      theme === t.id ? 'text-amber-400 font-medium' : ''
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full border ${t.color}`} />
                      {t.nameFa}
                    </span>
                    {theme === t.id && <span className="text-amber-400 text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Keyboard Shortcuts Guide */}
          <button
            onClick={onOpenShortcuts}
            title="کلیدهای میانبر کیبورد"
            className="hidden sm:flex w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 items-center justify-center transition-colors"
            aria-label="Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* History Panel Toggle */}
          <button
            onClick={onToggleHistory}
            title="تاریخچه محاسبات"
            className="h-9 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            aria-label="Toggle History"
          >
            <History className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">تاریخچه</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-amber-500/20 text-amber-300 font-mono rounded">
                {usePersianDigits ? historyCount.toLocaleString('fa-IR') : historyCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Mode Switcher Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-3 py-2 gap-1.5 bg-slate-900/90 border-t border-slate-800 scrollbar-none">
        {modes.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMode(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-300 bg-slate-800/60 hover:bg-slate-700/60'
              }`}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
