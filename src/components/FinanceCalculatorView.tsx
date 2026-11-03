import React, { useState } from 'react';
import {
  Coins,
  TrendingUp,
  Percent,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import {
  calculateLoan,
  calculateCompoundInterest,
  calculateDiscountAndTax,
  calculateGoldPrice,
} from '../utils/finance';
import { formatNumberWithCommas, toPersianDigits, fromPersianDigits } from '../utils/persianDigits';

interface FinanceCalculatorViewProps {
  usePersianDigits: boolean;
}

type FinanceTab = 'loan' | 'compound' | 'discount' | 'gold';

export const FinanceCalculatorView: React.FC<FinanceCalculatorViewProps> = ({
  usePersianDigits,
}) => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('loan');

  // Loan state
  const [loanAmount, setLoanAmount] = useState('100000000'); // 100M
  const [loanRate, setLoanRate] = useState('23'); // 23% standard bank loan
  const [loanMonths, setLoanMonths] = useState('36'); // 36 months

  // Compound Interest state
  const [compInitial, setCompInitial] = useState('50000000');
  const [compMonthly, setCompMonthly] = useState('5000000');
  const [compRate, setCompRate] = useState('25');
  const [compYears, setCompYears] = useState('5');

  // Discount & VAT state
  const [discPrice, setDiscPrice] = useState('1250000');
  const [discPercent, setDiscPercent] = useState('15');
  const [discTax, setDiscTax] = useState('10');

  // Gold state
  const [goldMazaneh, setGoldMazaneh] = useState('18500000'); // 18.5M per mithqal
  const [goldWeight, setGoldWeight] = useState('4.25'); // 4.25 grams
  const [goldMakingFee, setGoldMakingFee] = useState('12'); // 12% ojrat
  const [goldProfit, setGoldProfit] = useState('7'); // 7% profit
  const [goldTax, setGoldTax] = useState('9'); // 9% tax on fee+profit

  // Calculations
  const loanResult = calculateLoan(
    parseFloat(fromPersianDigits(loanAmount)) || 0,
    parseFloat(fromPersianDigits(loanRate)) || 0,
    parseInt(fromPersianDigits(loanMonths), 10) || 0
  );

  const compResult = calculateCompoundInterest(
    parseFloat(fromPersianDigits(compInitial)) || 0,
    parseFloat(fromPersianDigits(compMonthly)) || 0,
    parseFloat(fromPersianDigits(compRate)) || 0,
    parseFloat(fromPersianDigits(compYears)) || 0
  );

  const discResult = calculateDiscountAndTax(
    parseFloat(fromPersianDigits(discPrice)) || 0,
    parseFloat(fromPersianDigits(discPercent)) || 0,
    parseFloat(fromPersianDigits(discTax)) || 0
  );

  const goldResult = calculateGoldPrice(
    parseFloat(fromPersianDigits(goldMazaneh)) || 0,
    parseFloat(fromPersianDigits(goldWeight)) || 0,
    parseFloat(fromPersianDigits(goldMakingFee)) || 0,
    parseFloat(fromPersianDigits(goldProfit)) || 0,
    parseFloat(fromPersianDigits(goldTax)) || 0
  );

  const fmt = (num: number) => formatNumberWithCommas(Math.round(num), usePersianDigits);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Sub Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('loan')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap border ${
            activeTab === 'loan'
              ? 'bg-amber-500 text-slate-950 font-semibold border-amber-400'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>محاسبه اقساط وام بانکی</span>
        </button>

        <button
          onClick={() => setActiveTab('compound')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap border ${
            activeTab === 'compound'
              ? 'bg-amber-500 text-slate-950 font-semibold border-amber-400'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>سود مرکب و سرمایه‌گذاری</span>
        </button>

        <button
          onClick={() => setActiveTab('discount')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap border ${
            activeTab === 'discount'
              ? 'bg-amber-500 text-slate-950 font-semibold border-amber-400'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>تخفیف و مالیات (ارزش افزوده)</span>
        </button>

        <button
          onClick={() => setActiveTab('gold')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap border ${
            activeTab === 'gold'
              ? 'bg-amber-500 text-slate-950 font-semibold border-amber-400'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>محاسبه طلا و مظنه</span>
        </button>
      </div>

      {/* Tab 1: Loan Installments */}
      {activeTab === 'loan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Inputs Card */}
          <div className="lg:col-span-1 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-200">اطلاعات وام</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">مبلغ کل وام (تومان)</label>
              <input
                type="text"
                value={usePersianDigits ? toPersianDigits(loanAmount) : loanAmount}
                onChange={(e) => setLoanAmount(fromPersianDigits(e.target.value.replace(/,/g, '')))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-base font-mono-numbers text-slate-100 focus:outline-none focus:border-amber-500"
                dir="ltr"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                {formatNumberWithCommas(loanAmount, usePersianDigits)} تومان
              </span>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">نرخ سود سالانه (درصد)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={loanRate}
                  onChange={(e) => setLoanRate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-base font-mono-numbers text-slate-100 focus:outline-none focus:border-amber-500"
                  dir="ltr"
                />
              </div>
              <div className="flex gap-1.5 mt-2">
                {['4', '18', '23'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setLoanRate(r)}
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    {usePersianDigits ? toPersianDigits(r) : r}٪ {r === '4' ? '(قرض‌الحسنه)' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">مدت بازپرداخت (ماه)</label>
              <input
                type="number"
                value={loanMonths}
                onChange={(e) => setLoanMonths(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-base font-mono-numbers text-slate-100 focus:outline-none focus:border-amber-500"
                dir="ltr"
              />
              <div className="flex gap-1.5 mt-2">
                {['12', '24', '36', '48', '60'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setLoanMonths(m)}
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    {usePersianDigits ? toPersianDigits(m) : m} ماه
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary & Table */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">مبلغ هر قسط ماهانه</span>
                <span className="text-xl sm:text-2xl font-bold font-mono-numbers text-amber-400">
                  {fmt(loanResult.monthlyPayment)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">تومان در ماه</span>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">کل سود پرداختی</span>
                <span className="text-xl sm:text-2xl font-bold font-mono-numbers text-rose-400">
                  {fmt(loanResult.totalInterest)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">تومان سود</span>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">مجموع کل بازپرداخت</span>
                <span className="text-xl sm:text-2xl font-bold font-mono-numbers text-emerald-400">
                  {fmt(loanResult.totalPayment)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">اصل وام + کل سود</span>
              </div>
            </div>

            {/* Schedule Preview */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col gap-3">
              <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span>جدول زمان‌بندی اقساط (پیش‌نمایش ماهانه)</span>
              </h4>

              <div className="overflow-x-auto max-h-64 scrollbar-thin">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-slate-400 sticky top-0">
                    <tr>
                      <th className="p-2.5">ماه</th>
                      <th className="p-2.5">مبلغ قسط</th>
                      <th className="p-2.5">اصل وام</th>
                      <th className="p-2.5">سود ماهانه</th>
                      <th className="p-2.5">مانده بدهی</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono-numbers">
                    {loanResult.schedule.map((row) => (
                      <tr key={row.month} className="hover:bg-slate-800/40 text-slate-300">
                        <td className="p-2.5 text-amber-400 font-semibold">{usePersianDigits ? toPersianDigits(row.month) : row.month}</td>
                        <td className="p-2.5">{fmt(row.payment)}</td>
                        <td className="p-2.5 text-emerald-400">{fmt(row.principal)}</td>
                        <td className="p-2.5 text-rose-400">{fmt(row.interest)}</td>
                        <td className="p-2.5 text-slate-400">{fmt(row.remainingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Compound Interest */}
      {activeTab === 'compound' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-200">ورودی‌های سرمایه‌گذاری</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">مبلغ اولیه (تومان)</label>
              <input
                type="text"
                value={usePersianDigits ? toPersianDigits(compInitial) : compInitial}
                onChange={(e) => setCompInitial(fromPersianDigits(e.target.value.replace(/,/g, '')))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-base font-mono-numbers text-slate-100 focus:outline-none focus:border-amber-500"
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">واریز ماهانه مستمر (تومان)</label>
              <input
                type="text"
                value={usePersianDigits ? toPersianDigits(compMonthly) : compMonthly}
                onChange={(e) => setCompMonthly(fromPersianDigits(e.target.value.replace(/,/g, '')))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-base font-mono-numbers text-slate-100 focus:outline-none focus:border-amber-500"
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">نرخ بازده سالانه (درصد)</label>
              <input
                type="number"
                value={compRate}
                onChange={(e) => setCompRate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-base font-mono-numbers text-slate-100 focus:outline-none focus:border-amber-500"
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">مدت زمان (سال)</label>
              <input
                type="number"
                value={compYears}
                onChange={(e) => setCompYears(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-base font-mono-numbers text-slate-100 focus:outline-none focus:border-amber-500"
                dir="ltr"
              />
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">ارزش کل نهایی</span>
                <span className="text-2xl font-bold font-mono-numbers text-emerald-400">
                  {fmt(compResult.futureValue)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">تومان پس از {compYears} سال</span>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">کل آورده شما</span>
                <span className="text-2xl font-bold font-mono-numbers text-slate-200">
                  {fmt(compResult.totalContributions)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">سرمایه اصلی واریزی</span>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">کل سود خالص حاصل</span>
                <span className="text-2xl font-bold font-mono-numbers text-amber-400">
                  {fmt(compResult.totalInterest)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">سود مرکب دریافتی</span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
              <span className="text-amber-400 font-semibold">قدرت سود مرکب:</span> با پس‌انداز منظم ماهانه{' '}
              {fmt(parseFloat(fromPersianDigits(compMonthly)) || 0)} تومان و سرمایه اولیه{' '}
              {fmt(parseFloat(fromPersianDigits(compInitial)) || 0)} تومان با نرخ سالانه {compRate}٪، در پایان{' '}
              {compYears} سال، سود خالص شما بیش از{' '}
              {Math.round(
                (compResult.totalInterest / (compResult.totalContributions || 1)) * 100
              )}
              ٪ نسبت به کل پول واریزی‌تان اضافه خواهد شد!
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Discount & VAT */}
      {activeTab === 'discount' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-200">ورودی‌های قیمت و تخفیف</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">قیمت اصلی کالا یا خدمت (تومان)</label>
              <input
                type="text"
                value={usePersianDigits ? toPersianDigits(discPrice) : discPrice}
                onChange={(e) => setDiscPrice(fromPersianDigits(e.target.value.replace(/,/g, '')))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-base font-mono-numbers text-slate-100 focus:outline-none focus:border-amber-500"
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">درصد تخفیف</label>
              <input
                type="number"
                value={discPercent}
                onChange={(e) => setDiscPercent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-base font-mono-numbers text-slate-100 focus:outline-none focus:border-amber-500"
                dir="ltr"
              />
              <div className="flex gap-1.5 mt-2">
                {['5', '10', '15', '20', '30', '50'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setDiscPercent(p)}
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    {usePersianDigits ? toPersianDigits(p) : p}٪
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">نرخ مالیات بر ارزش افزوده (VAT)</label>
              <input
                type="number"
                value={discTax}
                onChange={(e) => setDiscTax(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-base font-mono-numbers text-slate-100 focus:outline-none focus:border-amber-500"
                dir="ltr"
              />
              <div className="flex gap-1.5 mt-2">
                {['0', '9', '10'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setDiscTax(t)}
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    {usePersianDigits ? toPersianDigits(t) : t}٪
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between gap-4">
            <h3 className="text-sm font-semibold text-slate-200">فاکتور نهایی محاسبات</h3>

            <div className="flex flex-col gap-3 font-mono-numbers">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400">قیمت اولیه:</span>
                <span className="text-base font-semibold text-slate-200">
                  {fmt(parseFloat(fromPersianDigits(discPrice)) || 0)} تومان
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400">میزان سود و تخفیف شما:</span>
                <span className="text-base font-semibold text-emerald-400">
                  - {fmt(discResult.discountAmount)} تومان
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400">قیمت پس از اعمال تخفیف:</span>
                <span className="text-base font-semibold text-slate-200">
                  {fmt(discResult.priceAfterDiscount)} تومان
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400">مالیات بر ارزش افزوده ({discTax}٪):</span>
                <span className="text-base font-semibold text-rose-400">
                  + {fmt(discResult.taxAmount)} تومان
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-sm font-bold text-amber-300">مبلغ نهایی قابل پرداخت:</span>
                <span className="text-xl sm:text-2xl font-bold text-amber-400">
                  {fmt(discResult.finalPrice)} تومان
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Gold & Mazaneh */}
      {activeTab === 'gold' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-200">فرمول خرید طلا (۱۸ عیار)</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">مظنه هر مثقال طلا (تومان)</label>
              <input
                type="text"
                value={usePersianDigits ? toPersianDigits(goldMazaneh) : goldMazaneh}
                onChange={(e) => setGoldMazaneh(fromPersianDigits(e.target.value.replace(/,/g, '')))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-base font-mono-numbers text-slate-100 focus:outline-none focus:border-amber-500"
                dir="ltr"
              />
              <span className="text-[11px] text-amber-400 mt-1 block">
                معادل هر گرم ۱۸ عیار خام:{' '}
                {fmt(goldResult.gram18kPrice)} تومان
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">وزن طلا (گرم)</label>
                <input
                  type="number"
                  step="0.01"
                  value={goldWeight}
                  onChange={(e) => setGoldWeight(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-base font-mono-numbers text-slate-100 focus:outline-none focus:border-amber-500"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5">اجرت ساخت (درصد)</label>
                <input
                  type="number"
                  value={goldMakingFee}
                  onChange={(e) => setGoldMakingFee(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-base font-mono-numbers text-slate-100 focus:outline-none focus:border-amber-500"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">سود طلافروش (درصد، قانوناً ۷٪)</label>
                <input
                  type="number"
                  value={goldProfit}
                  onChange={(e) => setGoldProfit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-base font-mono-numbers text-slate-100 focus:outline-none focus:border-amber-500"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5">مالیات اجرت و سود (درصد)</label>
                <input
                  type="number"
                  value={goldTax}
                  onChange={(e) => setGoldTax(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-base font-mono-numbers text-slate-100 focus:outline-none focus:border-amber-500"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between gap-4">
            <h3 className="text-sm font-semibold text-slate-200">محاسبه دقیق فاکتور طلا</h3>

            <div className="flex flex-col gap-2.5 font-mono-numbers">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400">قیمت طلای خام:</span>
                <span className="text-sm font-semibold text-slate-200">
                  {fmt(goldResult.baseGoldCost)} تومان
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400">اجرت ساخت ({goldMakingFee}٪):</span>
                <span className="text-sm font-semibold text-amber-300">
                  {fmt(goldResult.makingFeeCost)} تومان
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400">سود فروشنده ({goldProfit}٪):</span>
                <span className="text-sm font-semibold text-slate-300">
                  {fmt(goldResult.profitCost)} تومان
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400">مالیات ارزش افزوده (روی اجرت + سود):</span>
                <span className="text-sm font-semibold text-slate-400">
                  {fmt(goldResult.taxCost)} تومان
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/15 border border-amber-500/40 mt-1">
                <span className="text-sm font-bold text-amber-300">مبلغ کل پرداختی مشتری:</span>
                <span className="text-xl sm:text-2xl font-bold text-amber-400">
                  {fmt(goldResult.totalCustomerPrice)} تومان
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
