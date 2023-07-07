import { isNone } from "@components/utils";
import { useEffect, useState } from "react";

export const useRetained = <T = unknown,>(value: T): T => {
  const [retained, setRetained] = useState<T>(value);
  useEffect(() => setRetained((old) => (isNone(value) ? old : value)), [value]);
  return retained;
};
