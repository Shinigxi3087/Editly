"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

/* ---------- Overlay ---------- */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // glassy dim with blur
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm supports-[backdrop-filter]:bg-black/40",
      // nice fade; respects reduced motion
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
      "motion-reduce:!animate-none",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/* ---------- Content variants ---------- */
const contentVariants = cva(
  [
    "fixed left-1/2 top-1/2 z-50 grid w-full gap-4",
    "-translate-x-1/2 -translate-y-1/2",
    "rounded-2xl border shadow-xl",
    "bg-white/85 dark:bg-neutral-950/80",
    "border-black/5 dark:border-white/10",
    "backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:dark:bg-neutral-950/70",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "max-w-sm p-5",
        md: "max-w-md p-6",
        lg: "max-w-lg p-7",
        xl: "max-w-2xl p-8",
      },
      mobileFull: {
        true:
          // on small screens, slide-up sheet feel
          "sm:rounded-2xl sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg p-6 " +
          "max-sm:inset-x-0 max-sm:bottom-0 max-sm:top-auto max-sm:left-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-t-2xl max-sm:p-5",
        false: "",
      },
    },
    defaultVariants: {
      size: "lg",
      mobileFull: false,
    },
  }
)

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof contentVariants> {}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, size, mobileFull, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        contentVariants({ size, mobileFull }),
        // entrance animation (fade+zoom or slide-up on mobile sheet)
        "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
        "max-sm:data-[state=open]:slide-in-from-bottom-2 max-sm:data-[state=closed]:slide-out-to-bottom-2",
        className
      )}
      {...props}
    >
      {children}

      {/* Close button */}
      <DialogPrimitive.Close
        className={cn(
          "absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg",
          "bg-black/0 hover:bg-black/5 dark:hover:bg-white/10",
          "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20"
        )}
      >
        <X className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

/* ---------- Header / Footer / Body ---------- */
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col gap-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "mt-2 flex flex-col-reverse gap-2 sm:mt-4 sm:flex-row sm:justify-end",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-base sm:text-lg font-semibold tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-neutral-600 dark:text-neutral-400", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

// Optional: scrollable body section with thin scrollbar
const DialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "max-h-[60vh] overflow-auto pr-1",
      "[scrollbar-width:thin] [&::-webkit-scrollbar]:w-2",
      "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/10",
      "dark:[&::-webkit-scrollbar-thumb]:bg-white/10",
      className
    )}
    {...props}
  />
)
DialogBody.displayName = "DialogBody"

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogBody,
}
