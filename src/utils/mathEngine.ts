/**
 * Mathematical Engine for Standard and Scientific Calculations
 * Tokenizes and evaluates expressions safely with proper precedence,
 * trigonometric angle conversions (DEG/RAD), and floating-point sanitation.
 */

import { AngleMode } from '../types/calculator';

// Factorial calculation
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity; // Exceeds JS Number limit
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

// Convert angle based on mode
function toRadians(angle: number, mode: AngleMode): number {
  return mode === 'deg' ? (angle * Math.PI) / 180 : angle;
}

function fromRadians(angleRad: number, mode: AngleMode): number {
  return mode === 'deg' ? (angleRad * 180) / Math.PI : angleRad;
}

// Clean floating point rounding errors like 0.1 + 0.2 = 0.30000000000000004
export function sanitizeNumber(num: number): number {
  if (Number.isNaN(num) || !Number.isFinite(num)) return num;
  // If very close to 0
  if (Math.abs(num) < 1e-14) return 0;
  // If very close to an integer
  const round = Math.round(num);
  if (Math.abs(num - round) < 1e-12) return round;
  // Limit to 12 decimal places
  const fixed = Number(num.toPrecision(12));
  return parseFloat(fixed.toString());
}

/**
 * Preprocess user expression string into valid JS mathematical syntax
 */
export function sanitizeExpression(expr: string, angleMode: AngleMode): string {
  let cleaned = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, `${Math.PI}`)
    .replace(/e(?![a-z])/g, `${Math.E}`);

  // Replace percentage: x% -> (x / 100)
  cleaned = cleaned.replace(/(\d+(\.\d+)?)%/g, '($1 / 100)');

  // Power operator ^ -> **
  cleaned = cleaned.replace(/\^/g, '**');

  return cleaned;
}

/**
 * Evaluate single unary operations directly on current value
 */
export function evaluateUnary(
  val: number,
  operation: string,
  angleMode: AngleMode
): { result: number; exprLabel: string } {
  switch (operation) {
    case 'sqr':
      return { result: sanitizeNumber(val * val), exprLabel: `sqr(${val})` };
    case 'cube':
      return { result: sanitizeNumber(val * val * val), exprLabel: `cube(${val})` };
    case 'sqrt':
      if (val < 0) return { result: NaN, exprLabel: `√(${val})` };
      return { result: sanitizeNumber(Math.sqrt(val)), exprLabel: `√(${val})` };
    case 'cbrt':
      return { result: sanitizeNumber(Math.cbrt(val)), exprLabel: `∛(${val})` };
    case 'recip':
      if (val === 0) return { result: NaN, exprLabel: `1/(${val})` };
      return { result: sanitizeNumber(1 / val), exprLabel: `1/(${val})` };
    case 'percent':
      return { result: sanitizeNumber(val / 100), exprLabel: `${val}%` };
    case 'negate':
      return { result: sanitizeNumber(-val), exprLabel: `-(${val})` };
    case 'abs':
      return { result: sanitizeNumber(Math.abs(val)), exprLabel: `|${val}|` };
    case 'fact':
      return { result: factorial(val), exprLabel: `fact(${val})` };
    case 'ln':
      if (val <= 0) return { result: NaN, exprLabel: `ln(${val})` };
      return { result: sanitizeNumber(Math.log(val)), exprLabel: `ln(${val})` };
    case 'log':
      if (val <= 0) return { result: NaN, exprLabel: `log(${val})` };
      return { result: sanitizeNumber(Math.log10(val)), exprLabel: `log(${val})` };
    case 'log2':
      if (val <= 0) return { result: NaN, exprLabel: `log2(${val})` };
      return { result: sanitizeNumber(Math.log2(val)), exprLabel: `log2(${val})` };
    case 'exp':
      return { result: sanitizeNumber(Math.exp(val)), exprLabel: `e^(${val})` };
    case 'tenPow':
      return { result: sanitizeNumber(Math.pow(10, val)), exprLabel: `10^(${val})` };
    case 'sin': {
      const rad = toRadians(val, angleMode);
      return { result: sanitizeNumber(Math.sin(rad)), exprLabel: `sin(${val})` };
    }
    case 'cos': {
      const rad = toRadians(val, angleMode);
      return { result: sanitizeNumber(Math.cos(rad)), exprLabel: `cos(${val})` };
    }
    case 'tan': {
      const rad = toRadians(val, angleMode);
      // Check for undefined values at 90 deg, 270 deg etc.
      if (angleMode === 'deg' && Math.abs(val % 180) === 90) {
        return { result: NaN, exprLabel: `tan(${val})` };
      }
      return { result: sanitizeNumber(Math.tan(rad)), exprLabel: `tan(${val})` };
    }
    case 'cot': {
      const rad = toRadians(val, angleMode);
      const t = Math.tan(rad);
      if (Math.abs(t) < 1e-15) return { result: NaN, exprLabel: `cot(${val})` };
      return { result: sanitizeNumber(1 / t), exprLabel: `cot(${val})` };
    }
    case 'asin': {
      if (val < -1 || val > 1) return { result: NaN, exprLabel: `asin(${val})` };
      const rad = Math.asin(val);
      return { result: sanitizeNumber(fromRadians(rad, angleMode)), exprLabel: `asin(${val})` };
    }
    case 'acos': {
      if (val < -1 || val > 1) return { result: NaN, exprLabel: `acos(${val})` };
      const rad = Math.acos(val);
      return { result: sanitizeNumber(fromRadians(rad, angleMode)), exprLabel: `acos(${val})` };
    }
    case 'atan': {
      const rad = Math.atan(val);
      return { result: sanitizeNumber(fromRadians(rad, angleMode)), exprLabel: `atan(${val})` };
    }
    case 'sinh':
      return { result: sanitizeNumber(Math.sinh(val)), exprLabel: `sinh(${val})` };
    case 'cosh':
      return { result: sanitizeNumber(Math.cosh(val)), exprLabel: `cosh(${val})` };
    case 'tanh':
      return { result: sanitizeNumber(Math.tanh(val)), exprLabel: `tanh(${val})` };
    default:
      return { result: val, exprLabel: String(val) };
  }
}

/**
 * Safe mathematical expression evaluator using standard shunting-yard algorithm
 * or recursive parsing to guarantee security without using `eval()`.
 */
export function evaluateExpression(expr: string, angleMode: AngleMode): number {
  if (!expr || expr.trim() === '') return 0;

  // Normalize tokens
  let s = expr
    .replace(/\s+/g, '')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, `(${Math.PI})`)
    .replace(/\be\b/g, `(${Math.E})`);

  // Handle implicit multiplication like 2(3) or (2)(3) or 2π
  s = s.replace(/(\d)(\()/g, '$1*(');
  s = s.replace(/(\))(\d)/g, ')*$2');
  s = s.replace(/(\))(\()/g, ')*(');

  // Auto-close missing parentheses if user pressed '=' before closing
  let openCount = 0;
  for (const char of s) {
    if (char === '(') openCount++;
    if (char === ')') openCount--;
  }
  while (openCount > 0) {
    s += ')';
    openCount--;
  }

  // Tokenizer
  const tokens: string[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];

    // Numbers including decimals
    if ((c >= '0' && c <= '9') || c === '.') {
      let numStr = c;
      i++;
      while (i < s.length && ((s[i] >= '0' && s[i] <= '9') || s[i] === '.')) {
        numStr += s[i];
        i++;
      }
      tokens.push(numStr);
      continue;
    }

    // Function names like sin, cos, etc.
    if (c >= 'a' && c <= 'z') {
      let fnStr = c;
      i++;
      while (i < s.length && s[i] >= 'a' && s[i] <= 'z') {
        fnStr += s[i];
        i++;
      }
      tokens.push(fnStr);
      continue;
    }

    // Power operator ** or ^
    if (c === '^') {
      tokens.push('^');
      i++;
      continue;
    }

    if (c === '*' && s[i + 1] === '*') {
      tokens.push('^');
      i += 2;
      continue;
    }

    // Operators and parentheses
    if (['+', '-', '*', '/', '%', '(', ')'].includes(c)) {
      // Check for unary negative
      if (
        c === '-' &&
        (tokens.length === 0 ||
          ['+', '-', '*', '/', '%', '^', '('].includes(tokens[tokens.length - 1]))
      ) {
        tokens.push('neg');
      } else {
        tokens.push(c);
      }
      i++;
      continue;
    }

    i++;
  }

  // Shunting-Yard Algorithm to convert Infix to RPN
  const outputQueue: string[] = [];
  const operatorStack: string[] = [];

  const precedence: Record<string, number> = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '%': 2,
    '^': 3,
    'neg': 4,
  };

  const isRightAssociative: Record<string, boolean> = {
    '^': true,
    'neg': true,
  };

  const functions = new Set([
    'sin', 'cos', 'tan', 'cot', 'asin', 'acos', 'atan',
    'sinh', 'cosh', 'tanh', 'ln', 'log', 'log2', 'sqrt', 'cbrt', 'abs', 'fact'
  ]);

  for (const token of tokens) {
    if (!isNaN(Number(token))) {
      outputQueue.push(token);
    } else if (functions.has(token)) {
      operatorStack.push(token);
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== '('
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] === '(') {
        operatorStack.pop(); // Discard '('
      }
      if (
        operatorStack.length > 0 &&
        functions.has(operatorStack[operatorStack.length - 1])
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
    } else if (token in precedence) {
      const o1 = token;
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== '(' &&
        ((!isRightAssociative[o1] &&
          precedence[o1] <= precedence[operatorStack[operatorStack.length - 1]]) ||
          (isRightAssociative[o1] &&
            precedence[o1] < precedence[operatorStack[operatorStack.length - 1]]))
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(o1);
    }
  }

  while (operatorStack.length > 0) {
    const op = operatorStack.pop()!;
    if (op !== '(' && op !== ')') {
      outputQueue.push(op);
    }
  }

  // RPN Evaluator
  const evalStack: number[] = [];

  for (const token of outputQueue) {
    if (!isNaN(Number(token))) {
      evalStack.push(Number(token));
    } else if (token === 'neg') {
      const a = evalStack.pop() ?? 0;
      evalStack.push(-a);
    } else if (functions.has(token)) {
      const a = evalStack.pop() ?? 0;
      const res = evaluateUnary(a, token, angleMode).result;
      evalStack.push(res);
    } else {
      const b = evalStack.pop() ?? 0;
      const a = evalStack.pop() ?? 0;

      let r = 0;
      switch (token) {
        case '+':
          r = a + b;
          break;
        case '-':
          r = a - b;
          break;
        case '*':
          r = a * b;
          break;
        case '/':
          r = b !== 0 ? a / b : NaN;
          break;
        case '%':
          r = a % b;
          break;
        case '^':
          r = Math.pow(a, b);
          break;
      }
      evalStack.push(r);
    }
  }

  const finalVal = evalStack.length > 0 ? evalStack[0] : 0;
  return sanitizeNumber(finalVal);
}

/**
 * Attempt to compute a live preview of the current expression
 * Returns null if expression is incomplete or invalid
 */
export function getLivePreview(expr: string, angleMode: AngleMode): string | null {
  if (!expr || expr.length === 0) return null;
  // If expr ends with an operator, preview what we have so far without trailing operator
  let testExpr = expr.trim();
  if (['+', '-', '*', '×', '/', '÷', '^'].includes(testExpr.slice(-1))) {
    testExpr = testExpr.slice(0, -1).trim();
  }
  if (!testExpr || !/\d/.test(testExpr)) return null;

  try {
    const val = evaluateExpression(testExpr, angleMode);
    if (isNaN(val) || !isFinite(val)) return null;
    return String(val);
  } catch {
    return null;
  }
}
