export type CalculatorMode = 'standard' | 'scientific' | 'converter' | 'finance' | 'date';

export type AppTheme = 'dark' | 'light' | 'navy' | 'emerald' | 'amber';

export interface HistoryItem {
  id: string;
  timestamp: number;
  expression: string;
  result: string;
  mode: CalculatorMode;
}

export type AngleMode = 'deg' | 'rad';

export interface UnitCategory {
  id: string;
  nameFa: string;
  nameEn: string;
  icon: string;
  units: {
    id: string;
    nameFa: string;
    nameEn: string;
    symbol: string;
    ratioToBase: number; // For linear conversion: baseValue = value * ratioToBase
    offset?: number;     // For temperature
  }[];
}

export interface LoanCalcResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }[];
}
