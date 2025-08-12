'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { DeleteModal } from '@/components/DeleteModal';
import { dateConverter } from '@/lib/utils';

type RawDate =
  | Date
  | string
  | number
  | { seconds: number; nanoseconds?: number }
  | null
  | undefined;

export type AnimatedDocItem = {
  id: string;
  title?: string | null;
  createdAt?: RawDate;
};

export default function AnimatedDocumentList({ docs }: { docs: AnimatedDocItem[] }) {
  const prefersReducedMotion = useReducedMotion();

  /** Normalize any RawDate into a millisecond timestamp or null */
  const toMs = React.useCallback((d: RawDate): number | null => {
    if (d == null) return null;
    if (typeof d === 'number') {
      // treat small numbers as seconds (e.g., Firestore serverTimestamp)
      return d < 1_000_000_000_000 ? d * 1000 : d;
    }
    if (typeof d === 'string') {
      const t = Date.parse(d);
      return Number.isNaN(t) ? null : t;
    }
    if (d instanceof Date) return d.getTime();
    if (typeof d === 'object' && 'seconds' in d) {
      const secs = Number(d.seconds ?? 0);
      const nanos = Number(d.nanoseconds ?? 0);
      return secs * 1000 + Math.floor(nanos / 1_000_000);
    }
    return null;
  }, []);

  const items = React.useMemo(() => {
    return [...docs]
      .map((d) => {
        const ms = toMs(d.createdAt ?? null);
        return { ...d, _createdMs: ms as number | null };
      })
      .sort((a, b) => (b._createdMs ?? 0) - (a._createdMs ?? 0));
  }, [docs, toMs]);

  return (
    <motion.ul
      role="list"
      initial={prefersReducedMotion ? undefined : 'hidden'}
      animate={prefersReducedMotion ? undefined : 'show'}
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
      }}
      className="divide-y divide-black/5 rounded-2xl border border-black/5 bg-white/70 backdrop-blur dark:divide-white/10 dark:border-white/10 dark:bg-neutral-900/60"
    >
      {items.map(({ id, title, _createdMs }) => (
        <motion.li
          key={id}
          variants={{
            hidden: { opacity: 0, y: 6 },
            show: { opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } },
          }}
          className="group flex items-center gap-4 px-4 py-3 sm:px-5"
        >
          <Link
            href={`/documents/${id}`}
            className="flex flex-1 items-center gap-4 rounded-lg outline-none ring-offset-2 transition hover:bg-black/[0.03] focus-visible:ring-2 focus-visible:ring-black/20 dark:hover:bg-white/[0.06] dark:focus-visible:ring-white/20"
          >
            <div className="hidden rounded-md bg-black/5 p-2 dark:bg-white/10 sm:block">
              <Image src="/assets/icons/doc.svg" alt="" width={40} height={40} />
            </div>

            <div className="min-w-0 space-y-0.5 py-2">
              <p className="line-clamp-1 text-[15px] font-medium sm:text-base">
                {title ?? 'Untitled'}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {_createdMs
                  ? `Created about ${dateConverter(new Date(_createdMs).toISOString())}`
                  : 'Created date unknown'}
              </p>
            </div>
          </Link>

          <div className="opacity-0 transition group-hover:opacity-100">
            <DeleteModal roomId={id} />
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
