"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  InboxNotification,
  InboxNotificationList,
  LiveblocksUIConfig,
} from "@liveblocks/react-ui";
import {
  useInboxNotifications,
  useUnreadInboxNotificationsCount,
} from "@liveblocks/react/suspense";
import Image from "next/image";
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

const Notifications = () => {
  const { inboxNotifications } = useInboxNotifications();
  const { count } = useUnreadInboxNotificationsCount();
  const prefersReducedMotion = useReducedMotion();

  const unreadNotifications = inboxNotifications.filter(
    (n) => !n.readAt
  );
  const hasUnread = count > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          type="button"
          aria-label={hasUnread ? `Notifications (${count} unread)` : "Notifications"}
          className="relative flex size-10 items-center justify-center rounded-lg bg-transparent hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
          whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
        >
          <Image
            src="/assets/icons/bell.svg"
            alt=""
            width={24}
            height={24}
            className="opacity-90"
          />

          {hasUnread && (
            <>
              {/* ping */}
              <span className="absolute right-1.5 top-1.5 inline-flex">
                <span className="absolute inline-flex size-4 rounded-full bg-blue-500/40 animate-ping" />
              </span>

              {/* badge */}
              <motion.span
                initial={prefersReducedMotion ? false : { scale: 0.8, opacity: 0 }}
                animate={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="absolute right-1 top-1 z-20 min-w-4 h-4 px-1 rounded-full bg-blue-600 text-white text-[10px] leading-4 text-center font-semibold shadow-sm"
              >
                {count > 9 ? "9+" : count}
              </motion.span>
            </>
          )}
        </motion.button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="p-0 w-80 sm:w-96 overflow-hidden border border-black/5 dark:border-white/10 rounded-xl bg-white/80 dark:bg-neutral-900/70 backdrop-blur-xl shadow-xl"
      >
        <motion.div
          initial={prefersReducedMotion ? false : { y: -6, opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex max-h-96 flex-col"
        >
          <div className="sticky top-0 z-10 bg-gradient-to-b from-white/90 to-white/50 dark:from-neutral-900/90 dark:to-neutral-900/60 backdrop-blur px-4 py-3 border-b border-black/5 dark:border-white/10">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Notifications</p>
              {hasUnread && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {count} unread
                </span>
              )}
            </div>
          </div>

          <LiveblocksUIConfig
            overrides={{
              INBOX_NOTIFICATION_TEXT_MENTION: (user: React.ReactNode) => (
                <>{user} mentioned you.</>
              ),
            }}
          >
            <InboxNotificationList className="max-h-96 overflow-auto px-1 py-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/10 dark:[&::-webkit-scrollbar-thumb]:bg-white/10">
              {unreadNotifications.length <= 0 && (
                <div className="grid place-items-center px-6 py-12 text-center">
                  <Image
                    src="/assets/icons/inbox-empty.svg"
                    alt=""
                    width={56}
                    height={56}
                    className="mb-3 opacity-70"
                  />
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    No new notifications
                  </p>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    You’ll see mentions, comments, and access updates here.
                  </p>
                </div>
              )}

              {unreadNotifications.length > 0 &&
                unreadNotifications.map((notification) => (
                  <InboxNotification
                    key={notification.id}
                    inboxNotification={notification}
                    href={`/documents/${notification.roomId}`}
                    showActions={false}
                    className="bg-transparent text-inherit hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors rounded-lg"
                    kinds={{
                      thread: (props) => (
                        <InboxNotification.Thread
                          {...props}
                          showActions={false}
                          showRoomName={false}
                        />
                      ),
                      textMention: (props) => (
                        <InboxNotification.TextMention
                          {...props}
                          showRoomName={false}
                        />
                      ),
                      $documentAccess: (props) => (
                        <InboxNotification.Custom
                          {...props}
                          title={
                            props.inboxNotification?.activities?.[0]?.data?.title ?? "Document access"
                          }
                          aside={
                            <InboxNotification.Icon className="bg-transparent">
                              <Image
                                // @ts-expect-error – activity data shape from Liveblocks custom event
                                src={
                                  props.inboxNotification?.activities?.[0]?.data?.avatar || "/assets/icons/user-fallback.png"
                                }
                                width={36}
                                height={36}
                                alt="avatar"
                                className="rounded-full"
                              />
                            </InboxNotification.Icon>
                          }
                        >
                          {props.children}
                        </InboxNotification.Custom>
                      ),
                    }}
                  />
                ))}
            </InboxNotificationList>
          </LiveblocksUIConfig>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
