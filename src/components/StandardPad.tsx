import React from 'react';
import { toPersianDigits } from '../utils/persianDigits';

interface StandardPadProps {
  onDigit: (digit: string) => void;
  onOperator: (op: string) => void;
  onEquals: () => void;
  onClear: () => void;
  onAllClear: () => void;
  onNegate: () => void;
  onPercent: () => void;
  onDecimal: () => void;
  onParenthesis: (p: string) => void;
  // Memory actions
  onMemoryClear: () => void;
  onMemoryRecall: () => void;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
  onMemoryStore: () => void;
  hasMemory: boolean;
  usePersianDigits: boolean;
}

export const StandardPad: React.FC<StandardPadProps> = ({
  onDigit,
  onOperator,
  onEquals,
  onAllClear,
  onNegate,
  onPercent,
  onDecimal,
  onParenthesis,
  onMemoryClear,
  onMemoryRecall,
  onMemoryAdd,
  onMemorySubtract,
  onMemoryStore,
  hasMemory,
  usePersianDigits,
}) => {
  const d = (val: string) => (usePersianDigits ? toPersianDigits(val) : val);

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {/* Memory Row */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        <button
          onClick={onMemoryClear}
          disabled={!hasMemory}
          className="h-10 rounded-xl text-xs font-mono font-medium transition-all flex items-center justify-center bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none active:scale-95"
          title="پاک کردن حافظه (MC)"
        >
          MC
        </button>
        <button
          onClick={onMemoryRecall}
          disabled={!hasMemory}
          className="h-10 rounded-xl text-xs font-mono font-medium transition-all flex items-center justify-center bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-amber-400 disabled:opacity-30 disabled:pointer-events-none active:scale-95"
          title="فراخوانی حافظه (MR)"
        >
          MR
        </button>
        <button
          onClick={onMemoryAdd}
          className="h-10 rounded-xl text-xs font-mono font-medium transition-all flex items-center justify-center bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200 active:scale-95"
          title="افزودن به حافظه (M+)"
        >
          M+
        </button>
        <button
          onClick={onMemorySubtract}
          className="h-10 rounded-xl text-xs font-mono font-medium transition-all flex items-center justify-center bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200 active:scale-95"
          title="کسر از حافظه (M-)"
        >
          M-
        </button>
        <button
          onClick={onMemoryStore}
          className="h-10 rounded-xl text-xs font-mono font-medium transition-all flex items-center justify-center bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-amber-400 active:scale-95"
          title="ذخیره در حافظه (MS)"
        >
          MS
        </button>
      </div>

      {/* Main Standard Grid: 4 columns */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {/* Row 1 */}
        <button
          onClick={onAllClear}
          className="h-14 sm:h-16 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 font-bold text-lg sm:text-xl border border-rose-500/20 active:scale-[0.97] transition-all flex items-center justify-center shadow-sm"
          title="پاک کردن کامل (AC / Esc)"
        >
          AC
        </button>
        <button
          onClick={() => onParenthesis('(')}
          className="h-14 sm:h-16 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-mono font-medium text-lg sm:text-xl border border-slate-700/50 active:scale-[0.97] transition-all flex items-center justify-center shadow-sm"
        >
          ( )
        </button>
        <button
          onClick={onPercent}
          className="h-14 sm:h-16 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-medium text-lg sm:text-xl border border-slate-700/50 active:scale-[0.97] transition-all flex items-center justify-center shadow-sm"
        >
          %
        </button>
        <button
          onClick={() => onOperator('÷')}
          className="h-14 sm:h-16 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-2xl border border-amber-500/30 active:scale-[0.97] transition-all flex items-center justify-center shadow-sm"
        >
          ÷
        </button>

        {/* Row 2: 7, 8, 9, × */}
        <button
          onClick={() => onDigit('7')}
          className="h-14 sm:h-16 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-mono-numbers font-semibold text-xl sm:text-2xl border border-slate-700/60 active:scale-[0.97] transition-all flex items-center justify-center shadow-sm"
        >
          {d('7')}
        </button>
        <button
          onClick={() => onDigit('8')}
          className="h-14 sm:h-16 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-mono-numbers font-semibold text-xl sm:text-2xl border border-slate-700/60 active:scale-[0.97] transition-all flex items-center justify-center shadow-sm"
        >
          {d('8')}
        </button>
        <button
          onClick={() => onDigit('9')}
          className="h-14 sm:h-16 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-mono-numbers font-semibold text-xl sm:text-2xl border border-slate-700/60 active:scale-[0.97] transition-all flex items-center justify-center shadow-sm"
        >
          {d('9')}
        </button>
        <button
          onClick={() => onOperator('×')}
          className="h-14 sm:h-16 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-2xl border border-amber-500/30 active:scale-[0.97] transition-all flex items-center justify-center shadow-sm"
        >
          ×
        </button>

        {/* Row 3: 4, 5, 6, − */}
        <button
          onClick={() => onDigit('4')}
          className="h-14 sm:h-16 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-mono-numbers font-semibold text-xl sm:text-2xl border border-slate-700/60 active:scale-[0.97] transition-all flex items-center justify-center shadow-sm"
        >
          {d('4')}
        </button>
        <button
          onClick={() => onDigit('5')}
          className="h-14 sm:h-16 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-mono-numbers font-semibold text-xl sm:text-2xl border border-slate-700/60 active:scale-[0.97] transition-all flex items-center justify-center shadow-sm"
        >
          {d('5')}
        </button>
        <button
          onClick={() => onDigit('6')}
          className="h-14 sm:h-16 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-mono-numbers font-semibold text-xl sm:text-2xl border border-slate-700/60 active:scale-[0.97] transition-all flex items-center justify-center shadow-sm"
        >
          {d('6')}
        </button>
        <button
          onClick={() => onOperator('−')}
          className="h-14 sm:h-16 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-2xl border border-amber-500/30 active:scale-[0.97] transition-all flex items-center justify-center shadow-sm"
        >
          −
        </button>

        {/* Row 4: 1, 2, 3, + */}
        <button
          onClick={() => onDigit('1')}
          className="h-14 sm:h-16 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-mono-numbers font-semibold text-xl sm:text-2xl border border-slate-700/60 active:scale-[0.97] transition-all flex items-center justify-center shadow-sm"
        >
          {d('1')}
        </button>
        <button
          onClick={() => onDigit('2')}
          className="h-14 sm:h-16 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-mono-numbers font-semibold text-xl sm:text-2xl border border-slate-700/60 active:scale-[0.97] transition-all flex items-center justify-center shadow-sm"
        >
          {d('2')}
        </button>
        <button
          onClick={() => onDigit('3')}
          className="h-14 sm:h-16 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-mono-numbers font-semibold text-xl sm:text-2xl border border-slate-700/60 active:scale-[0.97] transition-all flex items-center justify-center shadow-sm"
        >
          {d('3')}
        </button>
        <button
          onClick={() => onOperator('+')}
          className="h-14 sm:h-16 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-2xl border border-amber-500/30 active:scale-[0.97] transition-all flex items-center justify-center shadow-sm"
        >
          +
        </button>

        {/* Row 5: ±, 0, ., = */}
        <button
          onClick={onNegate}
          className="h-14 sm:h-16 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-medium text-lg sm:text-xl border border-slate-700/50 active:scale-[0.97] transition-all flex items-center justify-center shadow-sm"
        >
          ±
        </button>
        <button
          onClick={() => onDigit('0')}
          className="h-14 sm:h-16 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-mono-numbers font-semibold text-xl sm:text-2xl border border-slate-700/60 active:scale-[0.97] transition-all flex items-center justify-center shadow-sm"
        >
          {d('0')}
        </button>
        <button
          onClick={onDecimal}
          className="h-14 sm:h-16 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-bold text-2xl border border-slate-700/60 active:scale-[0.97] transition-all flex items-center justify-center shadow-sm"
        >
          .
        </button>
        <button
          onClick={onEquals}
          className="h-14 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-2xl sm:text-3xl active:scale-[0.97] transition-all flex items-center justify-center shadow-md shadow-amber-500/25"
          title="محاسبه نتیجه (Enter / =)"
        >
          =
        </button>
      </div>
    </div>
  );
};
