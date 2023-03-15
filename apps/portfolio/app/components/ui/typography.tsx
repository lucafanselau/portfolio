import { cn } from "@/utils";
import { cva, VariantProps } from "class-variance-authority";
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
          "scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700",
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
          "scroll-m-20 text-2xl font-semibold tracking-tight",
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
          "scroll-m-20 text-xl font-semibold tracking-tight",
          className
        )}
      />
    );
  }
);

const paragraph = cva("leading-7", {
  variants: {
    color: {
      lighter: "text-zinc-500 dark:text-zinc-400",
    },
    align: {
      center: "text-center",
      right: "text-right",
    },
  },
});

export const P = forwardRef<
  HTMLParagraphElement,
  JSX.IntrinsicElements["p"] & VariantProps<typeof paragraph>
>(({ className, ...props }, ref) => {
  return <p ref={ref} {...props} className={cn(paragraph(props), className)} />;
});
