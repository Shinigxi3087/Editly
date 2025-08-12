"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group relative inline-flex items-center justify-center",
    "whitespace-nowrap rounded-xl font-medium",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none",
    "active:scale-[0.98]",
    "shadow-sm hover:shadow",
    "ring-offset-background",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-white hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
        primary:
          "bg-blue-600 text-white hover:bg-blue-600/90 focus-visible:ring-blue-600/40",
        destructive:
          "bg-red-600 text-white hover:bg-red-600/90 focus-visible:ring-red-600/40",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:text-slate-50",
        ghost:
          "bg-transparent hover:bg-slate-100 text-slate-900 dark:hover:bg-slate-800 dark:text-slate-50",
        link: "bg-transparent p-0 h-auto text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
        soft:
          "bg-slate-100/70 text-slate-900 hover:bg-slate-100/90 dark:bg-white/10 dark:text-white/90 dark:hover:bg-white/15",
        glass:
          "supports-[backdrop-filter]:backdrop-blur bg-white/30 text-slate-900 hover:bg-white/40 dark:bg-white/10 dark:text-white hover:dark:bg-white/15 border border-white/20",
        gradient:
          "text-white bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-700 hover:brightness-110 dark:from-slate-100 dark:via-slate-200 dark:to-white dark:text-slate-900",
      },
      size: {
        xs: "h-8 px-3 text-xs",
        sm: "h-9 px-3 text-sm",
        default: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        xl: "h-12 px-7 text-base",
        icon: "h-10 w-10 p-0",
      },
      shine: {
        true:
          "overflow-hidden before:absolute before:inset-y-0 before:-left-full before:w-1/3 before:bg-white/30 before:blur-md before:transition-transform before:duration-700 hover:before:translate-x-[300%]",
        false: "",
      },
      pill: {
        true: "rounded-full",
        false: "",
      },
      uppercase: {
        true: "uppercase tracking-wide",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shine: false,
      pill: false,
      uppercase: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Spinner = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4 animate-spin"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
      className="opacity-25"
    />
    <path d="M4 12a8 8 0 0 1 8-8" fill="currentColor" className="opacity-80" />
  </svg>
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, className })
        )}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        disabled={isDisabled}
        {...props}
      >
        {/* content wrapper to avoid layout shift when spinner shows */}
        <span className="inline-flex items-center gap-2">
          {loading ? (
            <>
              <Spinner />
              <span className="opacity-90">Loading…</span>
            </>
          ) : (
            <>
              {leftIcon && <span className="shrink-0">{leftIcon}</span>}
              {children}
              {rightIcon && <span className="shrink-0">{rightIcon}</span>}
            </>
          )}
        </span>
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
