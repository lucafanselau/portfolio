import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start }, (_, k) => k + start);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
