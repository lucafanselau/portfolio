import type { MouseEvent } from "react";

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown>
    ? DeepPartial<T[K]>
    : Partial<T[K]>;
};

export const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start }, (_, k) => k + start);

export const toArray = <T>(value: T | T[]): T[] =>
  Array.isArray(value) ? value : [value];

export const isSome = <T>(value: T | null | undefined): value is T =>
  value !== undefined && value !== null;
export const isNone = <T>(
  value: T | null | undefined
): value is null | undefined => !isSome<T>(value);

const prevent = (e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
};

export const preventProps = {
  onPointerDown: prevent,
};
