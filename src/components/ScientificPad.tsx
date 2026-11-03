import React, { useState } from 'react';
import { AngleMode } from '../types/calculator';

interface ScientificPadProps {
  onUnaryOp: (op: string) => void;
  onBinaryOp: (op: string) => void;
  onConstant: (c: string) => void;
  onParenthesis: (p: string) => void;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
}

export const ScientificPad: React.FC<ScientificPadProps> = ({
  onUnaryOp,
  onBinaryOp,
  onConstant,
  onParenthesis,
  angleMode,
  onToggleAngleMode,
}) => {
  const [isSecond, setIsSecond] = useState(false);

  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-2 w-full">
      {/* Row 1: 2nd, deg/rad, sin, cos, tan */}
      <button
        onClick={() => setIsSecond(!isSecond)}
        className={`h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold border transition-all active:scale-95 ${
          isSecond
            ? 'bg-amber-500 text-slate-950 border-amber-400'
            : 'bg-slate-800/60 hover:bg-slate-700/80 text-amber-400 border-slate-700/50'
        }`}
        title="توابع ثانویه و معکوس"
      >
        2<sup>nd</sup>
      </button>

      <button
        onClick={onToggleAngleMode}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800/60 hover:bg-slate-700/80 text-amber-400 border border-slate-700/50 transition-all active:scale-95"
        title="تغییر واحد زاویه بین درجه و رادیان"
      >
        {angleMode === 'deg' ? 'DEG' : 'RAD'}
      </button>

      <button
        onClick={() => onUnaryOp(isSecond ? 'asin' : 'sin')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 transition-all active:scale-95"
      >
        {isSecond ? 'sin⁻¹' : 'sin'}
      </button>

      <button
        onClick={() => onUnaryOp(isSecond ? 'acos' : 'cos')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 transition-all active:scale-95"
      >
        {isSecond ? 'cos⁻¹' : 'cos'}
      </button>

      <button
        onClick={() => onUnaryOp(isSecond ? 'atan' : 'tan')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 transition-all active:scale-95"
      >
        {isSecond ? 'tan⁻¹' : 'tan'}
      </button>

      {/* Row 2: x^y, x^2 / x^3, sqrt, 1/x, cot */}
      <button
        onClick={() => onBinaryOp('^')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 transition-all active:scale-95"
      >
        x<sup>y</sup>
      </button>

      <button
        onClick={() => onUnaryOp(isSecond ? 'cube' : 'sqr')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 transition-all active:scale-95"
      >
        {isSecond ? <>x<sup>3</sup></> : <>x<sup>2</sup></>}
      </button>

      <button
        onClick={() => onUnaryOp(isSecond ? 'cbrt' : 'sqrt')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 transition-all active:scale-95"
      >
        {isSecond ? '∛x' : '√x'}
      </button>

      <button
        onClick={() => onUnaryOp('recip')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 transition-all active:scale-95"
      >
        1/x
      </button>

      <button
        onClick={() => onUnaryOp('cot')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 transition-all active:scale-95"
      >
        cot
      </button>

      {/* Row 3: ln, log, e^x, 10^x, n! */}
      <button
        onClick={() => onUnaryOp('ln')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 transition-all active:scale-95"
      >
        ln
      </button>

      <button
        onClick={() => onUnaryOp(isSecond ? 'log2' : 'log')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 transition-all active:scale-95"
      >
        {isSecond ? 'log₂' : 'log₁₀'}
      </button>

      <button
        onClick={() => onUnaryOp('exp')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 transition-all active:scale-95"
      >
        e<sup>x</sup>
      </button>

      <button
        onClick={() => onUnaryOp('tenPow')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 transition-all active:scale-95"
      >
        10<sup>x</sup>
      </button>

      <button
        onClick={() => onUnaryOp('fact')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 transition-all active:scale-95"
      >
        n!
      </button>

      {/* Row 4: π, e, |x|, (, ) */}
      <button
        onClick={() => onConstant('π')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-amber-300 border border-slate-700/50 transition-all active:scale-95"
      >
        π
      </button>

      <button
        onClick={() => onConstant('e')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-amber-300 border border-slate-700/50 transition-all active:scale-95"
      >
        e
      </button>

      <button
        onClick={() => onUnaryOp('abs')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 transition-all active:scale-95"
      >
        |x|
      </button>

      <button
        onClick={() => onParenthesis('(')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 transition-all active:scale-95"
      >
        (
      </button>

      <button
        onClick={() => onParenthesis(')')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 transition-all active:scale-95"
      >
        )
      </button>

      {/* Row 5: sinh, cosh, tanh */}
      <button
        onClick={() => onUnaryOp('sinh')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50 transition-all active:scale-95 col-span-2"
      >
        sinh
      </button>

      <button
        onClick={() => onUnaryOp('cosh')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50 transition-all active:scale-95 col-span-2"
      >
        cosh
      </button>

      <button
        onClick={() => onUnaryOp('tanh')}
        className="h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50 transition-all active:scale-95"
      >
        tanh
      </button>
    </div>
  );
};
