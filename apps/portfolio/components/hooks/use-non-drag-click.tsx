import { useRef } from "react";

const approxEq = (a: number, b: number) => Math.abs(a - b) < 10;

export const useNonDragClick = <E extends { clientX: number; clientY: number }>(
  cb: (e: E) => void
): Record<"onPointerDown" | "onPointerUp", (e: E) => void> => {
  const ref = useRef<[number, number] | null>(null);
  return {
    onPointerDown: (e) => {
      ref.current = [e.clientX, e.clientY];
    },

    onPointerUp: (e) => {
      if (!ref.current) return;
      const [x, y] = ref.current;
      const [x2, y2] = [e.clientX, e.clientY];
      if (approxEq(x, x2) && approxEq(y, y2)) {
        cb(e);
      }
      ref.current = null;
    },
  };
};
