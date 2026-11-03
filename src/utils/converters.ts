import { UnitCategory } from '../types/calculator';

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    nameFa: 'طول و مسافت',
    nameEn: 'Length',
    icon: 'Ruler',
    units: [
      { id: 'm', nameFa: 'متر', nameEn: 'Meter', symbol: 'm', ratioToBase: 1 },
      { id: 'km', nameFa: 'کیلومتر', nameEn: 'Kilometer', symbol: 'km', ratioToBase: 1000 },
      { id: 'cm', nameFa: 'سانتی‌متر', nameEn: 'Centimeter', symbol: 'cm', ratioToBase: 0.01 },
      { id: 'mm', nameFa: 'میلی‌متر', nameEn: 'Millimeter', symbol: 'mm', ratioToBase: 0.001 },
      { id: 'mi', nameFa: 'مایل', nameEn: 'Mile', symbol: 'mi', ratioToBase: 1609.344 },
      { id: 'yd', nameFa: 'یارد', nameEn: 'Yard', symbol: 'yd', ratioToBase: 0.9144 },
      { id: 'ft', nameFa: 'فوت (پا)', nameEn: 'Foot', symbol: 'ft', ratioToBase: 0.3048 },
      { id: 'in', nameFa: 'اینچ', nameEn: 'Inch', symbol: 'in', ratioToBase: 0.0254 },
      { id: 'nmi', nameFa: 'مایل دریایی', nameEn: 'Nautical Mile', symbol: 'NM', ratioToBase: 1852 },
    ],
  },
  {
    id: 'mass',
    nameFa: 'وزن و جرم',
    nameEn: 'Mass & Weight',
    icon: 'Scale',
    units: [
      { id: 'kg', nameFa: 'کیلوگرم', nameEn: 'Kilogram', symbol: 'kg', ratioToBase: 1 },
      { id: 'g', nameFa: 'گرم', nameEn: 'Gram', symbol: 'g', ratioToBase: 0.001 },
      { id: 'mg', nameFa: 'میلی‌گرم', nameEn: 'Milligram', symbol: 'mg', ratioToBase: 0.000001 },
      { id: 'ton', nameFa: 'تن متریک', nameEn: 'Metric Ton', symbol: 't', ratioToBase: 1000 },
      { id: 'lb', nameFa: 'پوند', nameEn: 'Pound', symbol: 'lb', ratioToBase: 0.45359237 },
      { id: 'oz', nameFa: 'اونس معمولی', nameEn: 'Ounce', symbol: 'oz', ratioToBase: 0.0283495 },
      { id: 'ozt', nameFa: 'اونس طلا (تروی)', nameEn: 'Troy Ounce', symbol: 'oz t', ratioToBase: 0.0311035 },
      { id: 'mesghal', nameFa: 'مثقال (سیرابی)', nameEn: 'Mesghal', symbol: 'مثقال', ratioToBase: 0.0046083 },
      { id: 'sir', nameFa: 'سیر (۷۵ گرم)', nameEn: 'Sir', symbol: 'سیر', ratioToBase: 0.075 },
      { id: 'man', nameFa: 'من تبریز (۳ کیلو)', nameEn: 'Man', symbol: 'من', ratioToBase: 3 },
    ],
  },
  {
    id: 'temperature',
    nameFa: 'دما',
    nameEn: 'Temperature',
    icon: 'Thermometer',
    units: [
      { id: 'c', nameFa: 'سلسیوس (سانتی‌گراد)', nameEn: 'Celsius', symbol: '°C', ratioToBase: 1, offset: 0 },
      { id: 'f', nameFa: 'فارنهایت', nameEn: 'Fahrenheit', symbol: '°F', ratioToBase: 5 / 9, offset: -32 },
      { id: 'k', nameFa: 'کلوین', nameEn: 'Kelvin', symbol: 'K', ratioToBase: 1, offset: -273.15 },
    ],
  },
  {
    id: 'area',
    nameFa: 'مساحت',
    nameEn: 'Area',
    icon: 'Square',
    units: [
      { id: 'sq_m', nameFa: 'متر مربع', nameEn: 'Square Meter', symbol: 'm²', ratioToBase: 1 },
      { id: 'sq_km', nameFa: 'کیلومتر مربع', nameEn: 'Square Kilometer', symbol: 'km²', ratioToBase: 1000000 },
      { id: 'ha', nameFa: 'هکتار', nameEn: 'Hectare', symbol: 'ha', ratioToBase: 10000 },
      { id: 'acre', nameFa: 'ایکر (جریب فرنگی)', nameEn: 'Acre', symbol: 'ac', ratioToBase: 4046.8564224 },
      { id: 'sq_ft', nameFa: 'فوت مربع', nameEn: 'Square Foot', symbol: 'ft²', ratioToBase: 0.092903 },
      { id: 'jarib', nameFa: 'جریب سنتی (۱۰۰۰ متر)', nameEn: 'Traditional Jarib', symbol: 'جریب', ratioToBase: 1000 },
    ],
  },
  {
    id: 'volume',
    nameFa: 'حجم و گنجایش',
    nameEn: 'Volume',
    icon: 'Box',
    units: [
      { id: 'l', nameFa: 'لیتر', nameEn: 'Liter', symbol: 'L', ratioToBase: 1 },
      { id: 'ml', nameFa: 'میلی‌لیتر (سی‌سی)', nameEn: 'Milliliter', symbol: 'mL', ratioToBase: 0.001 },
      { id: 'cu_m', nameFa: 'متر مکعب', nameEn: 'Cubic Meter', symbol: 'm³', ratioToBase: 1000 },
      { id: 'gal_us', nameFa: 'گالن آمریکایی', nameEn: 'US Gallon', symbol: 'gal', ratioToBase: 3.78541 },
      { id: 'pt', nameFa: 'پینت', nameEn: 'Pint', symbol: 'pt', ratioToBase: 0.473176 },
      { id: 'cup', nameFa: 'فنجان (آشپزی)', nameEn: 'Cup', symbol: 'cup', ratioToBase: 0.24 },
      { id: 'tbsp', nameFa: 'قاشق غذاخوری', nameEn: 'Tablespoon', symbol: 'tbsp', ratioToBase: 0.015 },
    ],
  },
  {
    id: 'digital',
    nameFa: 'حافظه دیجیتال',
    nameEn: 'Digital Data',
    icon: 'HardDrive',
    units: [
      { id: 'b', nameFa: 'بایت', nameEn: 'Byte', symbol: 'B', ratioToBase: 1 },
      { id: 'kb', nameFa: 'کیلوبایت (KB)', nameEn: 'Kilobyte', symbol: 'KB', ratioToBase: 1024 },
      { id: 'mb', nameFa: 'مگابایت (MB)', nameEn: 'Megabyte', symbol: 'MB', ratioToBase: 1024 * 1024 },
      { id: 'gb', nameFa: 'گیگابایت (GB)', nameEn: 'Gigabyte', symbol: 'GB', ratioToBase: Math.pow(1024, 3) },
      { id: 'tb', nameFa: 'ترابایت (TB)', nameEn: 'Terabyte', symbol: 'TB', ratioToBase: Math.pow(1024, 4) },
      { id: 'pb', nameFa: 'پتابایت (PB)', nameEn: 'Petabyte', symbol: 'PB', ratioToBase: Math.pow(1024, 5) },
    ],
  },
  {
    id: 'speed',
    nameFa: 'سرعت',
    nameEn: 'Speed',
    icon: 'Gauge',
    units: [
      { id: 'kmh', nameFa: 'کیلومتر بر ساعت', nameEn: 'km/h', symbol: 'km/h', ratioToBase: 1 },
      { id: 'ms', nameFa: 'متر بر ثانیه', nameEn: 'm/s', symbol: 'm/s', ratioToBase: 3.6 },
      { id: 'mph', nameFa: 'مایل بر ساعت', nameEn: 'mph', symbol: 'mph', ratioToBase: 1.609344 },
      { id: 'knot', nameFa: 'گره دریایی', nameEn: 'Knot', symbol: 'kn', ratioToBase: 1.852 },
      { id: 'mach', nameFa: 'ماخ (صوت)', nameEn: 'Mach', symbol: 'M', ratioToBase: 1234.8 },
    ],
  },
  {
    id: 'time',
    nameFa: 'زمان',
    nameEn: 'Time',
    icon: 'Clock',
    units: [
      { id: 'sec', nameFa: 'ثانیه', nameEn: 'Second', symbol: 's', ratioToBase: 1 },
      { id: 'min', nameFa: 'دقیقه', nameEn: 'Minute', symbol: 'min', ratioToBase: 60 },
      { id: 'hr', nameFa: 'ساعت', nameEn: 'Hour', symbol: 'h', ratioToBase: 3600 },
      { id: 'day', nameFa: 'روز', nameEn: 'Day', symbol: 'd', ratioToBase: 86400 },
      { id: 'wk', nameFa: 'هفته', nameEn: 'Week', symbol: 'wk', ratioToBase: 604800 },
      { id: 'mo', nameFa: 'ماه (۳۰ روز)', nameEn: 'Month', symbol: 'mo', ratioToBase: 2592000 },
      { id: 'yr', nameFa: 'سال (۳۶۵ روز)', nameEn: 'Year', symbol: 'yr', ratioToBase: 31536000 },
    ],
  },
];

/**
 * Convert value between units
 */
export function convertUnit(
  val: number,
  fromUnitId: string,
  toUnitId: string,
  categoryId: string
): number {
  if (isNaN(val)) return 0;
  if (fromUnitId === toUnitId) return val;

  const category = UNIT_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return val;

  const fromUnit = category.units.find((u) => u.id === fromUnitId);
  const toUnit = category.units.find((u) => u.id === toUnitId);
  if (!fromUnit || !toUnit) return val;

  // Temperature has non-zero offsets
  if (categoryId === 'temperature') {
    // 1. Convert from source to Celsius base
    let celsius = 0;
    if (fromUnit.id === 'c') {
      celsius = val;
    } else if (fromUnit.id === 'f') {
      celsius = (val - 32) * (5 / 9);
    } else if (fromUnit.id === 'k') {
      celsius = val - 273.15;
    }

    // 2. Convert from Celsius to target
    if (toUnit.id === 'c') {
      return celsius;
    } else if (toUnit.id === 'f') {
      return celsius * (9 / 5) + 32;
    } else if (toUnit.id === 'k') {
      return celsius + 273.15;
    }
    return val;
  }

  // Linear unit conversion: val -> baseValue -> targetValue
  const baseValue = val * fromUnit.ratioToBase;
  const targetValue = baseValue / toUnit.ratioToBase;

  return parseFloat(targetValue.toPrecision(10));
}
