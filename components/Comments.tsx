"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { useIsThreadActive } from "@liveblocks/react-lexical";
import { Composer, Thread } from "@liveblocks/react-ui";
import { useThreads } from "@liveblocks/react/suspense";

type ThreadWrapperProps = {
  thread: any; // keep loose to match liveblocks
};

const ThreadWrapper = ({ thread }: ThreadWrapperProps) => {
  const isActive = useIsThreadActive(thread.id);
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      layout
      initial={prefersReducedMotion ? false : { y: 8, opacity: 0 }}
      animate={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn(
        "relative rounded-xl border bg-white/70 p-2 backdrop-blur dark:bg-neutral-900/60",
        "border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow"
      )}
      data-state={isActive ? "active" : undefined}
    >
      {/* active ring */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-xl ring-2 ring-transparent transition",
          isActive && "ring-blue-500/60"
        )}
      />
      <Thread
        thread={thread}
        className={cn(
          "comment-thread",
          thread.resolved && "opacity-45",
          isActive && "!border-transparent"
        )}
      />
    </motion.div>
  );
};

const Comments = () => {
  const { threads } = useThreads();
  const prefersReducedMotion = useReducedMotion();

  // show newest first, unresolved first (feel free to adjust)
  const sorted = React.useMemo(() => {
    return [...threads].sort((a, b) => {
      if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
      return (b.lastActivityAt ?? 0) - (a.lastActivityAt ?? 0);
    });
  }, [threads]);

  const count = sorted.length;

  return (
    <div className="comments-container relative flex h-full min-h-[320px] flex-col rounded-2xl border border-black/5 bg-white/60 backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/50">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 rounded-t-2xl border-b border-black/5 bg-gradient-to-b from-white/80 to-white/50 px-4 py-2.5 dark:border-white/10 dark:from-neutral-900/80 dark:to-neutral-900/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Comments</span>
          <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
            {count}
          </span>
        </div>
      </div>

      {/* Scroll area */}
      <div className="flex-1 space-y-3 overflow-auto px-3 py-3 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/10 dark:[&::-webkit-scrollbar-thumb]:bg-white/10">
        {count === 0 ? (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            className="grid place-items-center rounded-xl border border-dashed border-black/10 px-6 py-10 text-center dark:border-white/15"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              className="mb-2 opacity-70"
              aria-hidden="true"
            >
              <path
                d="M7 8h10M7 12h6M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4 4v-4H6a2 2 0 0 1-2-2V6Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              No comments yet
            </p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Start a discussion with the composer below.
            </p>
          </motion.div>
        ) : (
          sorted.map((thread) => <ThreadWrapper key={thread.id} thread={thread} />)
        )}
      </div>

      {/* Composer (sticky footer) */}
      <div className="sticky bottom-0 z-10 border-t border-black/5 bg-gradient-to-t from-white/80 to-white/50 px-3 py-2.5 backdrop-blur dark:border-white/10 dark:from-neutral-900/80 dark:to-neutral-900/50">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0.85, y: 4 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="rounded-xl border border-black/10 bg-white/80 px-2 py-2 shadow-sm dark:border-white/10 dark:bg-neutral-900/70"
        >
          <Composer className={cn("comment-composer")} />
        </motion.div>
      </div>
    </div>
  );
};

export default Comments;
