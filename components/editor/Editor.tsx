'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import Theme from './plugins/Theme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import FloatingToolbarPlugin from './plugins/FloatingToolbarPlugin';

import { HeadingNode } from '@lexical/rich-text';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

import {
  FloatingComposer,
  FloatingThreads,
  liveblocksConfig,
  LiveblocksPlugin,
  useEditorStatus,
} from '@liveblocks/react-lexical';

import { useThreads } from '@liveblocks/react/suspense';

import Loader from '../Loader';
import Comments from '../Comments';
import { DeleteModal } from '../DeleteModal';

function Placeholder() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-4 px-5 text-neutral-400 dark:text-neutral-500">
      Enter some rich text…
    </div>
  );
}

function ReadOnlyBanner() {
  return (
    <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
      You’re viewing in read-only mode. Ask the owner for edit access to make changes.
    </div>
  );
}

function EditorSkeleton() {
  // Google-Docs style skeleton while status is loading
  return (
    <div className="relative w-full max-w-[800px] rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm backdrop-blur-lg dark:border-white/10 dark:bg-neutral-900/60">
      <div className="mb-4 h-8 w-2/3 animate-pulse rounded bg-black/10 dark:bg-white/10" />
      <div className="space-y-3">
        <div className="h-4 w-full animate-pulse rounded bg-black/10 dark:bg-white/10" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-black/10 dark:bg白/10" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-black/10 dark:bg-white/10" />
        <div className="h-4 w-full animate-pulse rounded bg-black/10 dark:bg-white/10" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-black/10 dark:bg-white/10" />
      </div>
    </div>
  );
}

export function Editor({
  roomId,
  currentUserType,
}: {
  roomId: string;
  currentUserType: UserType;
}) {
  const prefersReducedMotion = useReducedMotion();
  const status = useEditorStatus();
  const { threads } = useThreads();

  const initialConfig = liveblocksConfig({
    namespace: 'Editor',
    nodes: [HeadingNode],
    onError: (error: Error) => {
      console.error(error);
      throw error;
    },
    theme: Theme,
    editable: currentUserType === 'editor',
  });

  const isLoading = status === 'not-loaded' || status === 'loading';
  const isEditor = currentUserType === 'editor';

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container flex h-full w-full flex-col">
        {/* Top row: sticky toolbar + actions */}
        <div className="toolbar-wrapper sticky top-[64px] z-30 -mx-4 mb-3 flex min-w-full items-center justify-between border-b border-black/5 bg-gradient-to-b from-white/80 to-white/50 px-4 py-2 backdrop-blur md:top-[72px] dark:border-white/10 dark:from-neutral-900/80 dark:to-neutral-900/60">
          <ToolbarPlugin />
          {isEditor && <DeleteModal roomId={roomId} />}
        </div>

        <div className="editor-wrapper mx-auto flex w-full max-w-[1200px] flex-col items-center gap-6 px-4 pb-10">
          {!isEditor && <ReadOnlyBanner />}

          {/* Document surface */}
          {isLoading ? (
            // Skeleton while loading
            prefersReducedMotion ? (
              <EditorSkeleton />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <EditorSkeleton />
              </motion.div>
            )
          ) : (
            <motion.div
              className="editor-inner relative mb-5 h-fit min-h-[1100px] w-full max-w-[800px] rounded-2xl border border-black/5 bg-white/85 shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/70"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10, scale: 0.99 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className="editor-input prose prose-neutral max-w-none min-h-[1100px] px-5 py-6 focus:outline-none dark:prose-invert"
                  />
                }
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
              />

              {isEditor && <FloatingToolbarPlugin />}
              <HistoryPlugin />
              <AutoFocusPlugin />
            </motion.div>
          )}

          {/* Liveblocks collab UI */}
          <LiveblocksPlugin>
            {/* Composer floats near selection; keep width fixed for consistency */}
            <FloatingComposer className="w-[350px]" />
            <FloatingThreads threads={threads} />
            <Comments />
          </LiveblocksPlugin>
        </div>
      </div>
    </LexicalComposer>
  );
}
