/**
 * Solar Hijri (Jalali / شمسی) and Gregorian Date Conversion & Age Calculation
 */

export interface JalaliDate {
  jy: number; // Jalali Year (e.g. 1403)
  jm: number; // Jalali Month (1..12)
  jd: number; // Jalali Day (1..31)
}

export interface GregorianDate {
  gy: number;
  gm: number; // 1..12
  gd: number; // 1..31
}

// Convert Gregorian to Jalali
export function gregorianToJalali(gy: number, gm: number, gd: number): JalaliDate {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    (365 * gy) +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1];

  let jy = -1595 + (33 * Math.floor(days / 12053));
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  let jm: number;
  let jd: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }

  return { jy, jm, jd };
}

// Convert Jalali to Gregorian
export function jalaliToGregorian(jy: number, jm: number, jd: number): GregorianDate {
  const jyAdjusted = jy - 979;
  const jmAdjusted = jm - 1;
  const jdAdjusted = jd - 1;

  let j_day_no =
    365 * jyAdjusted +
    Math.floor(jyAdjusted / 33) * 8 +
    Math.floor(((jyAdjusted % 33) + 3) / 4);

  for (let i = 0; i < jmAdjusted; ++i) {
    j_day_no += i < 6 ? 31 : 30;
  }
  j_day_no += jdAdjusted;

  let g_day_no = j_day_no + 79;

  let gy = 1600 + 400 * Math.floor(g_day_no / 146097);
  g_day_no = g_day_no % 146097;

  let leap = true;
  if (g_day_no >= 36525) {
    g_day_no--;
    gy += 100 * Math.floor(g_day_no / 36524);
    g_day_no = g_day_no % 36524;

    if (g_day_no >= 365) {
      g_day_no++;
    } else {
      leap = false;
    }
  }

  gy += 4 * Math.floor(g_day_no / 1461);
  g_day_no %= 1461;

  if (g_day_no >= 366) {
    leap = false;
    g_day_no--;
    gy += Math.floor(g_day_no / 365);
    g_day_no = g_day_no % 365;
  }

  const g_days_in_month = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  while (gm < 12 && g_day_no >= g_days_in_month[gm]) {
    g_day_no -= g_days_in_month[gm];
    gm++;
  }

  return { gy, gm: gm + 1, gd: g_day_no + 1 };
}

export const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد',
  'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر',
  'دی', 'بهمن', 'اسفند'
];

export const PERSIAN_WEEKDAYS = [
  'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'
];

/**
 * Calculate age breakdown and milestones
 */
export function calculateAge(birthDate: Date): {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  dayOfWeek: string;
  daysToNextBirthday: number;
} {
  const now = new Date();
  const diffTime = now.getTime() - birthDate.getTime();
  const totalDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = Math.floor(diffTime / (1000 * 60 * 60));

  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const dayOfWeek = PERSIAN_WEEKDAYS[birthDate.getDay()];

  // Next birthday calculation
  const nextBday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBday < now) {
    nextBday.setFullYear(now.getFullYear() + 1);
  }
  const daysToNextBirthday = Math.ceil(
    (nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    totalDays,
    totalWeeks,
    totalHours,
    dayOfWeek,
    daysToNextBirthday,
  };
}
