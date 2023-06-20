import { cn } from "@ui/utils";
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
        "z-50 card absolute bottom-0 left-0",
        "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out data-[state=closed]:opacity-0",
        className
      )}
      {...props}
    />
  );
});

export const Card = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("card", className)} {...props} />;
  }
);
