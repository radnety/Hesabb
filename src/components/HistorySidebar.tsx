import React, { useState } from 'react';
import { X, Trash2, Copy, Check, CornerDownLeft, Clock } from 'lucide-react';
import { HistoryItem } from '../types/calculator';
import { formatNumberWithCommas, toPersianDigits } from '../utils/persianDigits';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
  usePersianDigits: boolean;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
  onDeleteHistoryItem,
  usePersianDigits,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const timeStr = d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return usePersianDigits ? timeStr : d.toLocaleTimeString('en-US', { hour12: false });
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Slide-in Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-full sm:w-96 bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ease-out`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-slate-100">تاریخچه محاسبات</h2>
            <span className="text-xs text-slate-500 font-mono">
              ({usePersianDigits ? toPersianDigits(history.length) : history.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                title="پاک کردن تمام تاریخچه"
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>پاکسازی</span>
              </button>
            )}

            <button
              onClick={onClose}
              title="بستن"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin">
          {history.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <Clock className="w-12 h-12 stroke-[1.5] mb-3 text-slate-600" />
              <p className="text-sm font-medium text-slate-400 mb-1">
                تاریخچه‌ای وجود ندارد
              </p>
              <p className="text-xs text-slate-500">
                هر محاسبه‌ای که انجام دهید به‌صورت خودکار اینجا ذخیره می‌شود.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectHistoryItem(item)}
                className="group relative p-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/60 border border-slate-800/80 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono">{formatTime(item.timestamp)}</span>
                  <span className="capitalize text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400">
                    {item.mode === 'scientific' ? 'علمی' : 'استاندارد'}
                  </span>
                </div>

                {/* Expression */}
                <div
                  className="text-right text-xs text-slate-400 font-mono overflow-x-auto whitespace-nowrap scrollbar-none"
                  dir="ltr"
                >
                  {usePersianDigits ? toPersianDigits(item.expression) : item.expression} =
                </div>

                {/* Result */}
                <div
                  className="text-right text-lg font-bold font-mono-numbers text-amber-400 overflow-x-auto whitespace-nowrap scrollbar-none"
                  dir="ltr"
                >
                  {formatNumberWithCommas(item.result, usePersianDigits)}
                </div>

                {/* Hover Quick Actions */}
                <div className="flex items-center justify-end gap-1 pt-1.5 border-t border-slate-800/50">
                  <button
                    onClick={(e) => handleCopy(e, item.result, item.id)}
                    title="کپی نتیجه"
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors text-xs flex items-center gap-1"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] text-emerald-400">کپی شد</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">کپی</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectHistoryItem(item);
                    }}
                    title="بارگذاری در ماشین حساب"
                    className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-700/60 transition-colors text-xs flex items-center gap-1"
                  >
                    <CornerDownLeft className="w-3.5 h-3.5" />
                    <span className="text-[11px]">استفاده</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteHistoryItem(item.id);
                    }}
                    title="حذف این مورد"
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-700/60 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
};
