"use client";

import { cn } from "@ui/utils";
import { forwardRef, createContext, useContext } from "react";

const ButtonGroupContext = createContext({
  value: null as string | null,
  onValueChange: (value: string) => {},
});

const List = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string | null;
    onValueChange: (value: string) => void;
  }
>(({ className, value, onValueChange, ...props }, ref) => (
  <ButtonGroupContext.Provider value={{ value, onValueChange }}>
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-zinc-100 p-1 dark:bg-zinc-800",
        className
      )}
      {...props}
    />
  </ButtonGroupContext.Provider>
));
List.displayName = "ButtonGroup.List";

const Trigger = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, ...props }, ref) => {
  const { value, onValueChange } = useContext(ButtonGroupContext);

  return (
    <button
      data-state={value === props.value ? "active" : "inactive"}
      onClick={() => onValueChange(props.value)}
      className={cn(
        "inline-flex min-w-[100px] items-center justify-center rounded-[0.185rem] px-3 py-1.5  text-sm font-medium text-zinc-700 transition-all  disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm dark:text-zinc-200 dark:data-[state=active]:bg-zinc-900 dark:data-[state=active]:text-zinc-100",
        className
      )}
      {...props}
      ref={ref}
    />
  );
});
Trigger.displayName = "ButtonGroup.Trigger";

export const ButtonGroup = { List, Trigger };
