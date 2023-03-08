import { cn } from "@/utils";
import { forwardRef } from "react";

export const H1 = forwardRef<HTMLParagraphElement, JSX.IntrinsicElements["h1"]>(
  ({ className, ...props }, ref) => {
    return (
      <h1
        ref={ref}
        {...props}
        className={cn(
          "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
          className
        )}
      />
    );
  }
);

export const H2 = forwardRef<HTMLParagraphElement, JSX.IntrinsicElements["h2"]>(
  ({ className, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        {...props}
        className={cn(
          "mt-10 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700",
          className
        )}
      />
    );
  }
);

export const H3 = forwardRef<HTMLParagraphElement, JSX.IntrinsicElements["h3"]>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        {...props}
        className={cn(
          "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
          className
        )}
      />
    );
  }
);

export const H4 = forwardRef<HTMLParagraphElement, JSX.IntrinsicElements["h4"]>(
  ({ className, ...props }, ref) => {
    return (
      <h4
        ref={ref}
        {...props}
        className={cn(
          "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
          className
        )}
      />
    );
  }
);

export const P = forwardRef<HTMLParagraphElement, JSX.IntrinsicElements["p"]>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        {...props}
        className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      />
    );
  }
);
