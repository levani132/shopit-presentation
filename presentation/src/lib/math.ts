/**
 * Tiny math helpers. Kept in one place so we don't grow ad-hoc `clamp`s scattered
 * across the codebase.
 */

export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
