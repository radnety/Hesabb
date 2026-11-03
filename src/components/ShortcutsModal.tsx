import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: '0 - 9', desc: 'ورود ارقام و اعداد' },
  { key: '+ , - , * , /', desc: 'چهار عمل اصلی ریاضی (جمع، تفریق، ضرب، تقسیم)' },
  { key: 'Enter یا =', desc: 'محاسبه نتیجه نهایی' },
  { key: 'Backspace', desc: 'حذف آخرین رقم وارد شده' },
  { key: 'Esc یا C', desc: 'پاک کردن کامل صفحه (All Clear)' },
  { key: '( و )', desc: 'پرانتز باز و بسته' },
  { key: '%', desc: 'محاسبه درصد' },
  { key: '^', desc: 'عملگر توان (Power)' },
  { key: '.', desc: 'ممیز اعشار' },
  { key: 'p', desc: 'عدد پی (π)' },
  { key: 'e', desc: 'عدد نپر (e)' },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">کلیدهای میانبر کیبورد</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          برای کارایی و سرعت بیشتر، می‌توانید مستقیماً از کلیدهای صفحه‌کلید خود استفاده کنید:
        </p>

        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto scrollbar-thin pr-1">
          {SHORTCUTS.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80"
            >
              <span className="text-xs text-slate-300">{s.desc}</span>
              <kbd className="px-2.5 py-1 text-xs font-mono font-semibold bg-slate-800 text-amber-400 rounded-lg border border-slate-700 shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-xl transition-colors"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
};
