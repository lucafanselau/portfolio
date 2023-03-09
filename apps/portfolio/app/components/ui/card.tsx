import { cn } from "@/utils";
import { forwardRef } from "react";

export const AppearCard = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & { open: boolean }
>(({ className, open, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-state={open ? "open" : "closed"}
      className={cn(
        "z-50 rounded-md border border-zinc-100 bg-white p-4 shadow-md outline-none dark:border-zinc-900 dark:bg-zinc-800",
        "absolute bottom-0 left-0",
        "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out data-[state=closed]:opacity-0",
        className
      )}
      {...props}
    />
  );
});
