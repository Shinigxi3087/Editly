"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

import { deleteDocument } from "@/lib/actions/room.actions";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";

type DeleteModalProps = { roomId: string };

export const DeleteModal = ({ roomId }: DeleteModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();

  const deleteDocumentHandler = async () => {
    if (loading) return;
    setLoading(true);
    setErr(null);

    try {
      await deleteDocument(roomId);
      setOpen(false);
      // Optional: refresh or redirect after delete
      router.refresh?.();
    } catch (error) {
      console.error("Delete error:", error);
      setErr("Couldn't delete the document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !loading && setOpen(o)}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Delete document"
          className="group relative inline-flex min-w-9 items-center justify-center rounded-xl p-2 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20"
        >
          <motion.span
            whileHover={prefersReducedMotion ? undefined : { rotate: -8, scale: 1.05 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
            className="inline-flex"
          >
            <Image
              src="/assets/icons/delete.svg"
              alt=""
              width={20}
              height={20}
              className="mt-1 opacity-90"
            />
          </motion.span>

          {/* subtle glow */}
          <span className="pointer-events-none absolute inset-0 -z-10 rounded-xl opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-b from-black/[0.03] to-transparent dark:from-white/[0.06]" />
        </button>
      </DialogTrigger>

      <DialogContent
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-black/5 bg-white/80 p-0 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/70"
        aria-busy={loading}
      >
        {/* Animated shell */}
        <motion.div
          initial={prefersReducedMotion ? false : { y: 8, opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <DialogHeader className="px-5 pb-2 pt-5">
            <motion.div
              initial={prefersReducedMotion ? false : { scale: 0.9, opacity: 0 }}
              animate={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 ring-1 ring-red-100 dark:bg-red-500/10 dark:ring-red-500/20"
            >
              <Image
                src="/assets/icons/delete-modal.svg"
                alt=""
                width={28}
                height={28}
                className="opacity-90"
              />
            </motion.div>

            <DialogTitle className="text-base font-semibold">
              Delete document
            </DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete this document? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {err && (
            <div
              role="alert"
              className="mx-5 mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
            >
              {err}
            </div>
          )}

          <DialogFooter className="gap-2 px-5 pb-5">
            <DialogClose asChild>
              <Button
                type="button"
                className="w-full rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-white/90"
                disabled={loading}
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="button"
              variant="destructive"
              onClick={deleteDocumentHandler}
              disabled={loading}
              className="w-full rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-80"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
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
                    <path
                      d="M4 12a8 8 0 0 1 8-8"
                      fill="currentColor"
                      className="opacity-80"
                    />
                  </svg>
                  Deleting…
                </span>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
