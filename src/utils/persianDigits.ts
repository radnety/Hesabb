/**
 * Persian number conversion and formatting utilities
 */

const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function toPersianDigits(input: string | number): string {
  const str = String(input);
  return str.replace(/[0-9]/g, (w) => persianDigits[+w]);
}

export function fromPersianDigits(input: string): string {
  let str = input;
  for (let i = 0; i < 10; i++) {
    str = str.replace(new RegExp(persianDigits[i], 'g'), englishDigits[i]);
  }
  // Also support Arabic-Indic numerals
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  for (let i = 0; i < 10; i++) {
    str = str.replace(new RegExp(arabicDigits[i], 'g'), englishDigits[i]);
  }
  return str;
}

/**
 * Format a number string or numeric value with thousand separators
 * and optional Persian digits
 */
export function formatNumberWithCommas(
  val: string | number,
  usePersianDigits = false
): string {
  if (val === '' || val === null || val === undefined) return '';
  const str = String(val);

  // If it's not a standard number (contains operator expressions or error)
  if (isNaN(Number(str)) && !str.includes('.')) {
    return usePersianDigits ? toPersianDigits(str) : str;
  }

  const parts = str.split('.');
  const intPart = parts[0];
  const decPart = parts.length > 1 ? parts[1] : null;

  // Add commas to integer part
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const res = decPart !== null ? `${formattedInt}.${decPart}` : formattedInt;

  return usePersianDigits ? toPersianDigits(res) : res;
}
