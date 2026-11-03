import React, { useState } from 'react';
import { Copy, Check, Delete, RotateCcw } from 'lucide-react';
import { AngleMode } from '../types/calculator';
import { formatNumberWithCommas, toPersianDigits } from '../utils/persianDigits';

interface DisplayProps {
  expression: string;
  currentInput: string;
  livePreview: string | null;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  hasMemory: boolean;
  usePersianDigits: boolean;
  onClear: () => void;
  onBackspace: () => void;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  currentInput,
  livePreview,
  angleMode,
  onToggleAngleMode,
  hasMemory,
  usePersianDigits,
  onClear,
  onBackspace,
}) => {
  const [copied, setCopied] = useState(false);

  const displayValue = currentInput || '0';

  // Dynamic font sizing based on length to prevent layout breakage
  const getFontSize = (val: string) => {
    const len = val.length;
    if (len <= 9) return 'text-4xl sm:text-5xl';
    if (len <= 14) return 'text-3xl sm:text-4xl';
    if (len <= 18) return 'text-2xl sm:text-3xl';
    return 'text-xl sm:text-2xl';
  };

  const handleCopy = () => {
    const textToCopy = displayValue.replace(/,/g, '');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format expression for readability
  const formattedExpression = usePersianDigits
    ? toPersianDigits(expression)
    : expression;

  // Format main value
  const formattedDisplay = formatNumberWithCommas(displayValue, usePersianDigits);

  // Format live preview
  const formattedPreview = livePreview
    ? formatNumberWithCommas(livePreview, usePersianDigits)
    : null;

  return (
    <div className="w-full bg-slate-900/90 dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-inner flex flex-col justify-between gap-3 relative overflow-hidden transition-all">
      {/* Top Indicators Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          {/* Deg / Rad Switcher */}
          <button
            onClick={onToggleAngleMode}
            className="px-2 py-0.5 rounded font-mono text-[11px] font-semibold tracking-wider uppercase transition-colors bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700/60"
            title="تغییر حالت زاویه (درجه / رادیان)"
          >
            {angleMode === 'deg' ? 'DEG' : 'RAD'}
          </button>

          {/* Memory Active Indicator */}
          {hasMemory && (
            <span className="font-mono text-[11px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              M
            </span>
          )}
        </div>

        {/* Action icons: Copy, Backspace, Clear */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            title="کپی کردن مقدار"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 text-[11px]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">کپی شد</span>
              </>
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={onBackspace}
            title="حذف آخرین رقم (Backspace)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-slate-800 transition-colors"
          >
            <Delete className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClear}
            title="پاک کردن (C / Esc)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expression line with subtle horizontal scrolling */}
      <div
        className="text-right text-xs sm:text-sm text-slate-400 font-mono overflow-x-auto whitespace-nowrap scrollbar-none min-h-[20px] select-text tracking-wide"
        dir="ltr"
      >
        {formattedExpression || <span className="opacity-0">0</span>}
      </div>

      {/* Main Number Display & Live Preview */}
      <div className="flex flex-col items-end justify-end select-text">
        {/* Live Preview line if calculating */}
        {formattedPreview && formattedPreview !== formattedDisplay && (
          <div className="text-sm font-mono text-amber-400/80 mb-1 select-none flex items-center gap-1" dir="ltr">
            <span className="text-slate-500">=</span>
            <span>{formattedPreview}</span>
          </div>
        )}

        {/* Primary Large Result */}
        <div
          className={`font-mono-numbers font-semibold text-slate-100 tracking-tight transition-all duration-100 text-right w-full overflow-x-auto whitespace-nowrap scrollbar-none ${getFontSize(
            formattedDisplay
          )}`}
          dir="ltr"
        >
          {formattedDisplay}
        </div>
      </div>
    </div>
  );
};
