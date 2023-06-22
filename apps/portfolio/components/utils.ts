export const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start }, (_, k) => k + start);

export const toArray = <T>(value: T | T[]): T[] =>
  Array.isArray(value) ? value : [value];

export const isSome = <T>(value: T | null | undefined): value is T =>
  value !== undefined && value !== null;
export const isNone = <T>(
  value: T | null | undefined
): value is null | undefined => !isSome<T>(value);
