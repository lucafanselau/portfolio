import { cn } from "@ui/utils";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
import { forwardRef, useId } from "react";

export const H1 = forwardRef<HTMLParagraphElement, JSX.IntrinsicElements["h1"]>(
  ({ className, ...props }, ref) => {
    return (
      <h1
        ref={ref}
        {...props}
        className={cn(
          "scroll-m-20 text-2xl font-extrabold tracking-tight",
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
          "scroll-m-20 pb-2 text-xl font-semibold tracking-tight transition-colors first:mt-0",
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
          "scroll-m-20 text-lg font-semibold tracking-tight",
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

const paragraph = cva("leading-snug", {
  variants: {
    color: {
      lighter: "text-muted-foreground",
    },
    align: {
      center: "text-center",
      right: "text-right",
    },
    size: {
      "2xs": "text-2xs",
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

export const P = forwardRef<
  HTMLParagraphElement,
  JSX.IntrinsicElements["p"] & VariantProps<typeof paragraph>
>(({ className, ...props }, ref) => {
  return <p ref={ref} {...props} className={cn(paragraph(props), className)} />;
});

export const InlineCode = forwardRef<
  HTMLElement,
  JSX.IntrinsicElements["code"]
>(({ className, ...props }, ref) => {
  return (
    <code
      {...props}
      ref={ref}
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium",
        className
      )}
    />
  );
});

export const List = forwardRef<
  HTMLUListElement,
  JSX.IntrinsicElements["ul"] & { elements: ReactNode[] }
>(({ className, elements, ...props }, ref) => {
  const id = useId();
  return (
    <ul
      {...props}
      ref={ref}
      className={cn("my-6 ml-6 list-disc text-sm [&>li]:mt-2", className)}
    >
      {elements.map((node, index) => (
        <li key={`ul-item-${id}-${index}`}>{node}</li>
      ))}
    </ul>
  );
});
