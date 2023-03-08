import { cn } from "@/utils";
import { forwardRef } from "react";

export const Card = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "z-50 rounded-md border border-zinc-100 bg-white p-4 shadow-md outline-none dark:border-zinc-900 dark:bg-zinc-800",
          className
        )}
        {...props}
      />
    );
  }
);
