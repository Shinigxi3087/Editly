// components/Header.tsx
"use client";

import { cn } from "@/lib/utils";
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
        "sticky top-0 z-50 border-b border-indigo-500/20 dark:border-indigo-300/20",
        "bg-[rgba(30,27,75,0.75)] dark:bg-[rgba(17,24,39,0.75)] backdrop-blur-md supports-[backdrop-filter]:bg-[rgba(30,27,75,0.65)]",
        className
      )}
    >
      {/* Skip link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm dark:bg-indigo-300 dark:text-black"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-14 md:h-16 max-w-screen-2xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Go to homepage"
          className="group relative inline-flex items-center"
        >
          {/* Text-based logo */}
          <motion.span
            whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            className="font-bold tracking-tight text-xl md:text-2xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Editly
          </motion.span>

          {/* Subtle glow on hover */}
          <span className="pointer-events-none absolute -inset-2 -z-10 rounded-xl opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
        </Link>

        {/* Divider bubble on large screens */}
        <div className="hidden md:block h-8 w-px bg-gradient-to-b from-transparent via-indigo-400/30 to-transparent dark:via-purple-300/30" />

        {/* Right-side actions */}
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
        className="h-px w-full origin-left bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent dark:via-purple-300/30"
      />
    </motion.header>
  );
};

export default Header;
