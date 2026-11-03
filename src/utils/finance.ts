/**
 * Financial calculation algorithms
 * - Bank loan amortization (اقساط وام)
 * - Compound interest (سود مرکب)
 * - Discount and VAT (تخفیف و ارزش افزوده)
 * - Gold 18k / Mithqal converter (طلا و مظنه)
 */

import { LoanCalcResult } from '../types/calculator';

/**
 * Standard Bank Loan Installment Amortization
 * @param principal Loan total amount
 * @param annualRatePercent Annual interest rate (e.g. 23% or 4% for Qarz-al-Hasana)
 * @param months Number of installment months
 */
export function calculateLoan(
  principal: number,
  annualRatePercent: number,
  months: number
): LoanCalcResult {
  if (principal <= 0 || months <= 0) {
    return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0, schedule: [] };
  }

  // 0% interest or purely fee based
  if (annualRatePercent === 0) {
    const monthlyPayment = principal / months;
    return {
      monthlyPayment,
      totalPayment: principal,
      totalInterest: 0,
      schedule: Array.from({ length: Math.min(months, 60) }, (_, i) => ({
        month: i + 1,
        payment: monthlyPayment,
        principal: monthlyPayment,
        interest: 0,
        remainingBalance: Math.max(0, principal - monthlyPayment * (i + 1)),
      })),
    };
  }

  const monthlyRate = annualRatePercent / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, months);
  const monthlyPayment = (principal * monthlyRate * factor) / (factor - 1);
  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - principal;

  // Generate amortization preview (first 60 months max for UI performance)
  let balance = principal;
  const schedule = [];
  const previewLimit = Math.min(months, 60);

  for (let m = 1; m <= previewLimit; m++) {
    const interest = balance * monthlyRate;
    const princ = monthlyPayment - interest;
    balance -= princ;
    schedule.push({
      month: m,
      payment: monthlyPayment,
      principal: princ,
      interest: interest,
      remainingBalance: Math.max(0, balance),
    });
  }

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    schedule,
  };
}

/**
 * Compound Interest calculation
 */
export function calculateCompoundInterest(
  principal: number,
  monthlyContribution: number,
  annualRatePercent: number,
  years: number
): {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
} {
  const r = annualRatePercent / 100 / 12;
  const totalMonths = years * 12;

  let balance = principal;
  let totalDeposited = principal;

  for (let m = 0; m < totalMonths; m++) {
    balance += monthlyContribution;
    totalDeposited += monthlyContribution;
    balance += balance * r;
  }

  return {
    futureValue: balance,
    totalContributions: totalDeposited,
    totalInterest: balance - totalDeposited,
  };
}

/**
 * Discount and Tax / VAT Calculation
 */
export function calculateDiscountAndTax(
  originalPrice: number,
  discountPercent: number,
  taxPercent: number
): {
  discountAmount: number;
  priceAfterDiscount: number;
  taxAmount: number;
  finalPrice: number;
} {
  const discountAmount = originalPrice * (discountPercent / 100);
  const priceAfterDiscount = Math.max(0, originalPrice - discountAmount);
  const taxAmount = priceAfterDiscount * (taxPercent / 100);
  const finalPrice = priceAfterDiscount + taxAmount;

  return {
    discountAmount,
    priceAfterDiscount,
    taxAmount,
    finalPrice,
  };
}

/**
 * Gold calculation helpers (Iranian market: Mithqal to 18k Gram)
 * 1 Mithqal 17k (مظنه) = 4.6083 grams 18k gold * (750 / 705)
 */
export function calculateGoldPrice(
  mazanehPerMithqal: number,
  weightInGrams: number,
  makingFeePercent: number,
  profitPercent: number,
  taxPercent: number
): {
  gram18kPrice: number;
  baseGoldCost: number;
  makingFeeCost: number;
  profitCost: number;
  taxCost: number;
  totalCustomerPrice: number;
} {
  // 1 Mithqal gold standard is 4.6083 grams of 705 karat (عیار ۱۷).
  // Gram 18k (750) = Mazaneh / (4.6083 * 705 / 750) = Mazaneh / 4.3318
  const gram18kPrice = mazanehPerMithqal > 0 ? mazanehPerMithqal / 4.3318 : 0;
  const baseGoldCost = gram18kPrice * weightInGrams;
  const makingFeeCost = baseGoldCost * (makingFeePercent / 100);
  const profitCost = (baseGoldCost + makingFeeCost) * (profitPercent / 100);
  // According to current Iranian regulation, VAT applies only to making fee + profit, not base gold!
  const taxCost = (makingFeeCost + profitCost) * (taxPercent / 100);
  const totalCustomerPrice = baseGoldCost + makingFeeCost + profitCost + taxCost;

  return {
    gram18kPrice,
    baseGoldCost,
    makingFeeCost,
    profitCost,
    taxCost,
    totalCustomerPrice,
  };
}
