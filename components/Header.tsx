// components/Header.tsx
"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

type HeaderProps = {
  className?: string;
  children?: React.ReactNode;
};

const Header = ({ children, className }: HeaderProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.header
      role="banner"
      initial={prefersReducedMotion ? false : { y: -16, opacity: 0 }}
      animate={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
      className={cn(
        "sticky top-0 z-50 border-b border-black/5 dark:border-white/10",
        "bg-white/70 dark:bg-neutral-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/55",
        className
      )}
    >
      {/* Skip link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] rounded-lg bg-black text-white px-3 py-2 text-sm dark:bg-white dark:text-black"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-14 md:h-16 max-w-screen-2xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Go to homepage"
          className="group relative inline-flex items-center"
        >
          {/* Desktop logo */}
          <motion.span
            whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            className="hidden md:inline-flex"
          >
            <Image
              src="/assets/icons/logo.svg"
              alt="Logo with name"
              width={128}
              height={32}
              priority
              className="h-8 w-auto"
            />
          </motion.span>

          {/* Mobile mark */}
          <motion.span
            whileHover={prefersReducedMotion ? undefined : { scale: 1.05, rotate: 1 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
            className="md:hidden mr-1.5 inline-flex"
          >
            <Image
              src="/assets/icons/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
              priority
              className="h-8 w-8"
            />
          </motion.span>

          {/* Subtle glow on hover */}
          <span className="pointer-events-none absolute -inset-2 -z-10 rounded-xl opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-r from-black/5 to-black/0 dark:from-white/10" />
        </Link>

        {/* Divider bubble on large screens */}
        <div className="hidden md:block h-8 w-px bg-gradient-to-b from-transparent via-black/10 to-transparent dark:via-white/15" />

        {/* Right-side actions (search, profile, theme toggle, etc.) */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {children}
        </div>
      </div>

      {/* Bottom animated hairline */}
      <motion.div
        aria-hidden="true"
        initial={prefersReducedMotion ? false : { scaleX: 0, opacity: 0 }}
        animate={prefersReducedMotion ? undefined : { scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-px w-full origin-left bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/15"
      />
    </motion.header>
  );
};

export default Header;
