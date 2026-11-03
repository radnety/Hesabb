import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { Display } from './components/Display';
import { StandardPad } from './components/StandardPad';
import { ScientificPad } from './components/ScientificPad';
import { UnitConverterView } from './components/UnitConverterView';
import { FinanceCalculatorView } from './components/FinanceCalculatorView';
import { DateCalculatorView } from './components/DateCalculatorView';
import { HistorySidebar } from './components/HistorySidebar';
import { ShortcutsModal } from './components/ShortcutsModal';
import {
  CalculatorMode,
  AppTheme,
  HistoryItem,
  AngleMode,
} from './types/calculator';
import {
  evaluateExpression,
  evaluateUnary,
  getLivePreview,
  sanitizeNumber,
} from './utils/mathEngine';
import { playKeySound } from './utils/audio';

export default function App() {
  // App settings & persistence
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('calc_theme') as AppTheme) || 'dark';
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('calc_sound') !== 'false';
  });
  const [usePersianDigits, setUsePersianDigits] = useState<boolean>(() => {
    return localStorage.getItem('calc_persian_digits') === 'true';
  });

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Core Calculator state
  const [expression, setExpression] = useState('');
  const [currentInput, setCurrentInput] = useState('0');
  const [isResultState, setIsResultState] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');

  // Sync settings with localStorage
  useEffect(() => {
    localStorage.setItem('calc_theme', theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    } else {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('calc_sound', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('calc_persian_digits', String(usePersianDigits));
  }, [usePersianDigits]);

  useEffect(() => {
    localStorage.setItem('calc_history', JSON.stringify(history));
  }, [history]);

  // Live preview evaluation
  const livePreview = useMemo(() => {
    if (mode !== 'standard' && mode !== 'scientific') return null;
    const fullExpr = expression ? `${expression} ${currentInput}` : currentInput;
    return getLivePreview(fullExpr, angleMode);
  }, [expression, currentInput, angleMode, mode]);

  // Handler: Digits 0-9
  const handleDigit = useCallback(
    (digit: string) => {
      playKeySound('number', soundEnabled);
      if (isResultState) {
        setCurrentInput(digit);
        setExpression('');
        setIsResultState(false);
        return;
      }
      if (currentInput === '0' || currentInput === 'Error') {
        setCurrentInput(digit);
      } else {
        if (currentInput.length < 18) {
          setCurrentInput((prev) => prev + digit);
        }
      }
    },
    [currentInput, isResultState, soundEnabled]
  );

  // Handler: Decimal point
  const handleDecimal = useCallback(() => {
    playKeySound('number', soundEnabled);
    if (isResultState) {
      setCurrentInput('0.');
      setExpression('');
      setIsResultState(false);
      return;
    }
    if (!currentInput.includes('.')) {
      setCurrentInput((prev) => prev + '.');
    }
  }, [currentInput, isResultState, soundEnabled]);

  // Handler: Backspace
  const handleBackspace = useCallback(() => {
    playKeySound('operator', soundEnabled);
    if (isResultState) {
      setExpression('');
      setIsResultState(false);
      return;
    }
    if (currentInput.length > 1) {
      setCurrentInput((prev) => prev.slice(0, -1));
    } else {
      setCurrentInput('0');
    }
  }, [currentInput, isResultState, soundEnabled]);

  // Handler: Clear current input
  const handleClear = useCallback(() => {
    playKeySound('clear', soundEnabled);
    setCurrentInput('0');
    setIsResultState(false);
  }, [soundEnabled]);

  // Handler: All Clear (AC)
  const handleAllClear = useCallback(() => {
    playKeySound('clear', soundEnabled);
    setCurrentInput('0');
    setExpression('');
    setIsResultState(false);
  }, [soundEnabled]);

  // Handler: Operators (+, -, ×, ÷)
  const handleOperator = useCallback(
    (op: string) => {
      playKeySound('operator', soundEnabled);
      if (currentInput === 'Error') return;

      if (isResultState) {
        setExpression(`${currentInput} ${op}`);
        setCurrentInput('0');
        setIsResultState(false);
        return;
      }

      if (expression && expression.endsWith(' ') && currentInput === '0') {
        // Replace operator if another operator is clicked
        const parts = expression.trim().split(' ');
        parts[parts.length - 1] = op;
        setExpression(parts.join(' ') + ' ');
      } else {
        setExpression((prev) => (prev ? `${prev} ${currentInput} ${op}` : `${currentInput} ${op}`));
        setCurrentInput('0');
      }
    },
    [currentInput, expression, isResultState, soundEnabled]
  );

  // Handler: Parentheses
  const handleParenthesis = useCallback(
    (p: string) => {
      playKeySound('operator', soundEnabled);
      if (p === '(') {
        if (currentInput === '0' || isResultState) {
          setExpression((prev) => (prev ? `${prev} (` : '('));
          setCurrentInput('0');
          setIsResultState(false);
        } else {
          setExpression((prev) => (prev ? `${prev} ${currentInput} × (` : `${currentInput} × (`));
          setCurrentInput('0');
        }
      } else {
        // Closing parenthesis
        setExpression((prev) => (prev ? `${prev} ${currentInput} )` : `${currentInput} )`));
        setCurrentInput('0');
      }
    },
    [currentInput, expression, isResultState, soundEnabled]
  );

  // Handler: Equals (=)
  const handleEquals = useCallback(() => {
    if (currentInput === 'Error') return;

    const fullExpr = expression ? `${expression} ${currentInput}` : currentInput;
    if (!fullExpr) return;

    try {
      const val = evaluateExpression(fullExpr, angleMode);
      if (isNaN(val) || !isFinite(val)) {
        playKeySound('error', soundEnabled);
        setCurrentInput('Error');
        setExpression('');
        setIsResultState(true);
        return;
      }

      playKeySound('equals', soundEnabled);
      const strVal = String(val);

      // Save to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        expression: fullExpr,
        result: strVal,
        mode: mode,
      };
      setHistory((prev) => [newItem, ...prev.slice(0, 49)]);

      setCurrentInput(strVal);
      setExpression(`${fullExpr} =`);
      setIsResultState(true);
    } catch {
      playKeySound('error', soundEnabled);
      setCurrentInput('Error');
      setIsResultState(true);
    }
  }, [currentInput, expression, angleMode, mode, soundEnabled]);

  // Handler: Unary Operations (sin, cos, sqrt, sqr, ln, etc.)
  const handleUnaryOp = useCallback(
    (op: string) => {
      playKeySound('operator', soundEnabled);
      const val = parseFloat(currentInput) || 0;
      const res = evaluateUnary(val, op, angleMode);

      if (isNaN(res.result) || !isFinite(res.result)) {
        playKeySound('error', soundEnabled);
        setCurrentInput('Error');
        setIsResultState(true);
        return;
      }

      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        expression: res.exprLabel,
        result: String(res.result),
        mode: 'scientific',
      };
      setHistory((prev) => [newItem, ...prev.slice(0, 49)]);

      setCurrentInput(String(res.result));
      setExpression(`${res.exprLabel} =`);
      setIsResultState(true);
    },
    [currentInput, angleMode, soundEnabled]
  );

  // Handler: Negate (±)
  const handleNegate = useCallback(() => {
    playKeySound('operator', soundEnabled);
    if (currentInput === '0' || currentInput === 'Error') return;
    setCurrentInput((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
  }, [currentInput, soundEnabled]);

  // Handler: Percent (%)
  const handlePercent = useCallback(() => {
    playKeySound('operator', soundEnabled);
    const val = parseFloat(currentInput) || 0;
    const res = sanitizeNumber(val / 100);
    setCurrentInput(String(res));
  }, [currentInput, soundEnabled]);

  // Handler: Constants (π, e)
  const handleConstant = useCallback(
    (c: string) => {
      playKeySound('number', soundEnabled);
      const val = c === 'π' ? Math.PI : Math.E;
      setCurrentInput(String(sanitizeNumber(val)));
      setIsResultState(true);
    },
    [soundEnabled]
  );

  // Memory Operations
  const handleMemoryClear = useCallback(() => {
    playKeySound('clear', soundEnabled);
    setMemory(0);
  }, [soundEnabled]);

  const handleMemoryRecall = useCallback(() => {
    playKeySound('number', soundEnabled);
    setCurrentInput(String(memory));
    setIsResultState(true);
  }, [memory, soundEnabled]);

  const handleMemoryAdd = useCallback(() => {
    playKeySound('operator', soundEnabled);
    const val = parseFloat(currentInput) || 0;
    setMemory((prev) => sanitizeNumber(prev + val));
  }, [currentInput, soundEnabled]);

  const handleMemorySubtract = useCallback(() => {
    playKeySound('operator', soundEnabled);
    const val = parseFloat(currentInput) || 0;
    setMemory((prev) => sanitizeNumber(prev - val));
  }, [currentInput, soundEnabled]);

  const handleMemoryStore = useCallback(() => {
    playKeySound('operator', soundEnabled);
    const val = parseFloat(currentInput) || 0;
    setMemory(val);
  }, [currentInput, soundEnabled]);

  // History Selection
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setCurrentInput(item.result);
    setExpression(item.expression);
    setIsResultState(true);
    setIsHistoryOpen(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing inside an input element (e.g. in Converter or Finance)
      const target = e.target as HTMLElement;
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        handleDecimal();
      } else if (e.key === '+' || e.key === '-') {
        e.preventDefault();
        handleOperator(e.key === '-' ? '−' : '+');
      } else if (e.key === '*') {
        e.preventDefault();
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleAllClear();
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        handleParenthesis(e.key);
      } else if (e.key === '%') {
        e.preventDefault();
        handlePercent();
      } else if (e.key === '^') {
        e.preventDefault();
        handleOperator('^');
      } else if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleConstant('π');
      } else if (e.key.toLowerCase() === 'e') {
        e.preventDefault();
        handleConstant('e');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleDigit,
    handleDecimal,
    handleOperator,
    handleEquals,
    handleBackspace,
    handleAllClear,
    handleParenthesis,
    handlePercent,
    handleConstant,
  ]);

  // Theme visual classes
  const getThemeBgClass = () => {
    switch (theme) {
      case 'light':
        return 'bg-slate-100 text-slate-900';
      case 'navy':
        return 'bg-[#0a0f1d] text-slate-100';
      case 'emerald':
        return 'bg-[#06140e] text-slate-100';
      case 'amber':
        return 'bg-[#14110d] text-slate-100';
      default:
        return 'bg-slate-950 text-slate-100';
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${getThemeBgClass()}`}
    >
      {/* Top Bar */}
      <Header
        currentMode={mode}
        onSelectMode={setMode}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        usePersianDigits={usePersianDigits}
        onTogglePersianDigits={() => setUsePersianDigits(!usePersianDigits)}
        theme={theme}
        onChangeTheme={setTheme}
        historyCount={history.length}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center">
        {/* Standard Calculator Mode */}
        {mode === 'standard' && (
          <div className="w-full max-w-md flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <Display
              expression={expression}
              currentInput={currentInput}
              livePreview={livePreview}
              angleMode={angleMode}
              onToggleAngleMode={() =>
                setAngleMode((prev) => (prev === 'deg' ? 'rad' : 'deg'))
              }
              hasMemory={memory !== 0}
              usePersianDigits={usePersianDigits}
              onClear={handleClear}
              onBackspace={handleBackspace}
            />

            <StandardPad
              onDigit={handleDigit}
              onOperator={handleOperator}
              onEquals={handleEquals}
              onClear={handleClear}
              onAllClear={handleAllClear}
              onNegate={handleNegate}
              onPercent={handlePercent}
              onDecimal={handleDecimal}
              onParenthesis={handleParenthesis}
              onMemoryClear={handleMemoryClear}
              onMemoryRecall={handleMemoryRecall}
              onMemoryAdd={handleMemoryAdd}
              onMemorySubtract={handleMemorySubtract}
              onMemoryStore={handleMemoryStore}
              hasMemory={memory !== 0}
              usePersianDigits={usePersianDigits}
            />
          </div>
        )}

        {/* Scientific Calculator Mode */}
        {mode === 'scientific' && (
          <div className="w-full max-w-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <Display
              expression={expression}
              currentInput={currentInput}
              livePreview={livePreview}
              angleMode={angleMode}
              onToggleAngleMode={() =>
                setAngleMode((prev) => (prev === 'deg' ? 'rad' : 'deg'))
              }
              hasMemory={memory !== 0}
              usePersianDigits={usePersianDigits}
              onClear={handleClear}
              onBackspace={handleBackspace}
            />

            {/* Scientific Keypad Grid */}
            <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
              <ScientificPad
                onUnaryOp={handleUnaryOp}
                onBinaryOp={handleOperator}
                onConstant={handleConstant}
                onParenthesis={handleParenthesis}
                angleMode={angleMode}
                onToggleAngleMode={() =>
                  setAngleMode((prev) => (prev === 'deg' ? 'rad' : 'deg'))
                }
              />
            </div>

            {/* Standard Keypad below */}
            <StandardPad
              onDigit={handleDigit}
              onOperator={handleOperator}
              onEquals={handleEquals}
              onClear={handleClear}
              onAllClear={handleAllClear}
              onNegate={handleNegate}
              onPercent={handlePercent}
              onDecimal={handleDecimal}
              onParenthesis={handleParenthesis}
              onMemoryClear={handleMemoryClear}
              onMemoryRecall={handleMemoryRecall}
              onMemoryAdd={handleMemoryAdd}
              onMemorySubtract={handleMemorySubtract}
              onMemoryStore={handleMemoryStore}
              hasMemory={memory !== 0}
              usePersianDigits={usePersianDigits}
            />
          </div>
        )}

        {/* Unit Converter Mode */}
        {mode === 'converter' && (
          <div className="w-full max-w-4xl animate-in fade-in duration-200">
            <UnitConverterView usePersianDigits={usePersianDigits} />
          </div>
        )}

        {/* Finance Calculator Mode */}
        {mode === 'finance' && (
          <div className="w-full max-w-5xl animate-in fade-in duration-200">
            <FinanceCalculatorView usePersianDigits={usePersianDigits} />
          </div>
        )}

        {/* Date & Age Calculator Mode */}
        {mode === 'date' && (
          <div className="w-full max-w-3xl animate-in fade-in duration-200">
            <DateCalculatorView usePersianDigits={usePersianDigits} />
          </div>
        )}
      </main>

      {/* History Slide-out Sidebar */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        usePersianDigits={usePersianDigits}
      />

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Quiet Footer adhering to anti-slop guidelines */}
      <footer className="w-full py-4 px-6 border-t border-slate-800/60 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ماشین حساب پیشرفته هوشمند · محاسبه دقیق و سریع</span>
          <span className="font-mono text-[11px] text-slate-600">
            v2.4.0 · Precision Math Engine
          </span>
        </div>
      </footer>
    </div>
  );
}
