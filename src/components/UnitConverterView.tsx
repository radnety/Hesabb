import React, { useState, useMemo } from 'react';
import {
  ArrowDownUp,
  Ruler,
  Scale,
  Thermometer,
  Square,
  Box,
  HardDrive,
  Gauge,
  Clock,
  Copy,
  Check,
} from 'lucide-react';
import { UNIT_CATEGORIES, convertUnit } from '../utils/converters';
import { formatNumberWithCommas, toPersianDigits, fromPersianDigits } from '../utils/persianDigits';

interface UnitConverterViewProps {
  usePersianDigits: boolean;
}

export const UnitConverterView: React.FC<UnitConverterViewProps> = ({ usePersianDigits }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('length');
  const [fromValue, setFromValue] = useState<string>('1');
  const [fromUnitId, setFromUnitId] = useState<string>('m');
  const [toUnitId, setToUnitId] = useState<string>('cm');
  const [copied, setCopied] = useState(false);

  const category = useMemo(
    () => UNIT_CATEGORIES.find((c) => c.id === selectedCategoryId) || UNIT_CATEGORIES[0],
    [selectedCategoryId]
  );

  // When category changes, set sensible defaults
  const handleSelectCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    const cat = UNIT_CATEGORIES.find((c) => c.id === catId);
    if (cat && cat.units.length >= 2) {
      setFromUnitId(cat.units[0].id);
      setToUnitId(cat.units[1].id);
    }
  };

  // Convert
  const numericInput = parseFloat(fromPersianDigits(fromValue)) || 0;
  const convertedValue = useMemo(() => {
    return convertUnit(numericInput, fromUnitId, toUnitId, selectedCategoryId);
  }, [numericInput, fromUnitId, toUnitId, selectedCategoryId]);

  const handleSwap = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(String(convertedValue));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Ruler': return <Ruler className="w-4 h-4" />;
      case 'Scale': return <Scale className="w-4 h-4" />;
      case 'Thermometer': return <Thermometer className="w-4 h-4" />;
      case 'Square': return <Square className="w-4 h-4" />;
      case 'Box': return <Box className="w-4 h-4" />;
      case 'HardDrive': return <HardDrive className="w-4 h-4" />;
      case 'Gauge': return <Gauge className="w-4 h-4" />;
      case 'Clock': return <Clock className="w-4 h-4" />;
      default: return <Ruler className="w-4 h-4" />;
    }
  };

  const fromUnit = category.units.find((u) => u.id === fromUnitId);
  const toUnit = category.units.find((u) => u.id === toUnitId);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {UNIT_CATEGORIES.map((cat) => {
          const isActive = cat.id === selectedCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 border ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-semibold border-amber-400 shadow-sm'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              {getCategoryIcon(cat.icon)}
              <span>{cat.nameFa}</span>
            </button>
          );
        })}
      </div>

      {/* Main Conversion Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        {/* Source Unit Card */}
        <div className="flex flex-col gap-3 p-4 bg-slate-950/80 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>تبدیل از</span>
            <span className="font-mono text-amber-400">{fromUnit?.symbol}</span>
          </div>

          <input
            type="text"
            inputMode="decimal"
            value={usePersianDigits ? toPersianDigits(fromValue) : fromValue}
            onChange={(e) => setFromValue(fromPersianDigits(e.target.value))}
            placeholder="0"
            className="w-full text-2xl sm:text-3xl font-mono-numbers font-bold bg-transparent text-slate-100 focus:outline-none border-b border-slate-800 focus:border-amber-500 pb-2 transition-colors"
            dir="ltr"
          />

          <select
            value={fromUnitId}
            onChange={(e) => setFromUnitId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
          >
            {category.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nameFa} ({u.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            title="جابجایی واحدها"
            className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 flex items-center justify-center transition-all active:rotate-180 shadow-md"
          >
            <ArrowDownUp className="w-5 h-5" />
          </button>
        </div>

        {/* Target Unit Card */}
        <div className="flex flex-col gap-3 p-4 bg-slate-950/80 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>تبدیل به</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-amber-400">{toUnit?.symbol}</span>
              <button
                onClick={handleCopy}
                title="کپی نتیجه"
                className="hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div
            className="w-full text-2xl sm:text-3xl font-mono-numbers font-bold text-amber-400 select-all overflow-x-auto whitespace-nowrap scrollbar-none border-b border-slate-800 pb-2"
            dir="ltr"
          >
            {formatNumberWithCommas(convertedValue, usePersianDigits)}
          </div>

          <select
            value={toUnitId}
            onChange={(e) => setToUnitId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
          >
            {category.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nameFa} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Reference Table for Current Category */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center justify-between">
          <span>جدول مقایسه همزمان واحدها</span>
          <span className="text-xs text-slate-400 font-normal">
            معادل مقدار ورودی ({fromValue || 0} {fromUnit?.nameFa})
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {category.units.map((u) => {
            const val = convertUnit(numericInput, fromUnitId, u.id, selectedCategoryId);
            return (
              <div
                key={u.id}
                onClick={() => setToUnitId(u.id)}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  u.id === toUnitId
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-200">{u.nameFa}</span>
                  <span className="text-[11px] text-slate-500 font-mono">{u.symbol}</span>
                </div>
                <span className="font-mono-numbers text-sm font-semibold" dir="ltr">
                  {formatNumberWithCommas(val, usePersianDigits)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
