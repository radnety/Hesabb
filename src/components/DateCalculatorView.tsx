import React, { useState, useMemo } from 'react';
import { Cake, CalendarDays, Hourglass, Sparkles } from 'lucide-react';
import {
  calculateAge,
  jalaliToGregorian,
  gregorianToJalali,
  PERSIAN_MONTHS,
} from '../utils/dateCalc';
import { formatNumberWithCommas, toPersianDigits } from '../utils/persianDigits';

interface DateCalculatorViewProps {
  usePersianDigits: boolean;
}

export const DateCalculatorView: React.FC<DateCalculatorViewProps> = ({ usePersianDigits }) => {
  // Current Jalali date for default
  const now = new Date();
  const currentJalali = gregorianToJalali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );

  // Age calculation inputs (Solar Hijri)
  const [birthYear, setBirthYear] = useState('1375');
  const [birthMonth, setBirthMonth] = useState('6');
  const [birthDay, setBirthDay] = useState('15');

  // Convert to Gregorian date
  const birthDate = useMemo(() => {
    const jy = parseInt(birthYear, 10) || 1375;
    const jm = parseInt(birthMonth, 10) || 1;
    const jd = parseInt(birthDay, 10) || 1;
    const g = jalaliToGregorian(jy, jm, jd);
    return new Date(g.gy, g.gm - 1, g.gd);
  }, [birthYear, birthMonth, birthDay]);

  const ageData = useMemo(() => {
    return calculateAge(birthDate);
  }, [birthDate]);

  // Date distance between two dates
  const [d1Year, setD1Year] = useState(String(currentJalali.jy));
  const [d1Month, setD1Month] = useState('1');
  const [d1Day, setD1Day] = useState('1');

  const [d2Year, setD2Year] = useState(String(currentJalali.jy));
  const [d2Month, setD2Month] = useState(String(currentJalali.jm));
  const [d2Day, setD2Day] = useState(String(currentJalali.jd));

  const daysDifference = useMemo(() => {
    const g1 = jalaliToGregorian(
      parseInt(d1Year, 10) || 1400,
      parseInt(d1Month, 10) || 1,
      parseInt(d1Day, 10) || 1
    );
    const g2 = jalaliToGregorian(
      parseInt(d2Year, 10) || 1400,
      parseInt(d2Month, 10) || 1,
      parseInt(d2Day, 10) || 1
    );

    const date1 = new Date(g1.gy, g1.gm - 1, g1.gd);
    const date2 = new Date(g2.gy, g2.gm - 1, g2.gd);
    const diffMs = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }, [d1Year, d1Month, d1Day, d2Year, d2Month, d2Day]);

  const p = (n: number | string) => (usePersianDigits ? toPersianDigits(n) : n);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Age Calculator Card */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col gap-5">
        <div className="flex items-center gap-2 text-slate-100 font-semibold text-base border-b border-slate-800 pb-3">
          <Cake className="w-5 h-5 text-amber-400" />
          <span>محاسبه دقیق سن و جزئیات تولد (تقویم شمسی)</span>
        </div>

        {/* Date Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">روز تولد</label>
            <select
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {p(d)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">ماه تولد</label>
            <select
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
            >
              {PERSIAN_MONTHS.map((m, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {m} ({p(idx + 1)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">سال تولد</label>
            <input
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              min="1300"
              max={currentJalali.jy}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm font-mono-numbers text-slate-200 focus:outline-none focus:border-amber-500"
              dir="ltr"
            />
          </div>
        </div>

        {/* Age Primary Highlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
          <div className="flex flex-col items-center justify-center p-3 text-center">
            <span className="text-xs text-amber-300 mb-1">سن دقیق شما</span>
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono-numbers">
              {p(ageData.years)} سال
            </span>
            <span className="text-xs text-slate-300 mt-1">
              و {p(ageData.months)} ماه و {p(ageData.days)} روز
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 text-center border-t md:border-t-0 md:border-r border-amber-500/20">
            <span className="text-xs text-amber-300 mb-1">روز تولد شما در هفته</span>
            <span className="text-2xl font-bold text-slate-100 mt-1">
              {ageData.dayOfWeek}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 font-mono">
              معادل میلادی: {birthDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 text-center border-t md:border-t-0 md:border-r border-amber-500/20">
            <span className="text-xs text-amber-300 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>تا تولد بعدی</span>
            </span>
            <span className="text-2xl font-bold text-emerald-400 font-mono-numbers mt-1">
              {p(ageData.daysToNextBirthday)} روز
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              مانده تا شمع‌های بعدی!
            </span>
          </div>
        </div>

        {/* Milestone Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-1">تعداد روزهای زندگی</span>
            <span className="text-lg font-bold font-mono-numbers text-slate-100">
              {formatNumberWithCommas(ageData.totalDays, usePersianDigits)}
            </span>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-1">تعداد هفته‌های سپری شده</span>
            <span className="text-lg font-bold font-mono-numbers text-slate-100">
              {formatNumberWithCommas(ageData.totalWeeks, usePersianDigits)}
            </span>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-1">تعداد ساعات سپری شده</span>
            <span className="text-lg font-bold font-mono-numbers text-slate-100">
              {formatNumberWithCommas(ageData.totalHours, usePersianDigits)}
            </span>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-1">تعداد ماه‌های کامل</span>
            <span className="text-lg font-bold font-mono-numbers text-slate-100">
              {p(ageData.years * 12 + ageData.months)}
            </span>
          </div>
        </div>
      </div>

      {/* Date Difference Between Two Dates */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-slate-100 font-semibold text-base border-b border-slate-800 pb-3">
          <CalendarDays className="w-5 h-5 text-amber-400" />
          <span>محاسبه فاصله بین دو تاریخ</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date 1 */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-300">تاریخ اول (شمسی)</span>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="روز"
                value={d1Day}
                onChange={(e) => setD1Day(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-xs font-mono-numbers text-slate-200"
              />
              <select
                value={d1Month}
                onChange={(e) => setD1Month(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-xs text-slate-200"
              >
                {PERSIAN_MONTHS.map((m, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="سال"
                value={d1Year}
                onChange={(e) => setD1Year(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-xs font-mono-numbers text-slate-200"
              />
            </div>
          </div>

          {/* Date 2 */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-300">تاریخ دوم (شمسی)</span>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="روز"
                value={d2Day}
                onChange={(e) => setD2Day(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-xs font-mono-numbers text-slate-200"
              />
              <select
                value={d2Month}
                onChange={(e) => setD2Month(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-xs text-slate-200"
              >
                {PERSIAN_MONTHS.map((m, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="سال"
                value={d2Year}
                onChange={(e) => setD2Year(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-xs font-mono-numbers text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Distance Result */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hourglass className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-300">اختلاف زمانی:</span>
          </div>
          <div className="font-mono-numbers text-lg sm:text-xl font-bold text-amber-400">
            {formatNumberWithCommas(daysDifference, usePersianDigits)} روز
            <span className="text-xs font-normal text-slate-400 mr-2">
              (حدود {p(Math.round(daysDifference / 30))} ماه و {p(Math.floor(daysDifference / 365))} سال)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
