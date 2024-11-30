'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { SidebarActions } from '@/components/sidebar-actions';
import { SidebarItem } from '@/components/sidebar-item';
import { removeChat, shareChat } from '@/lib/server-actions';
import { Chat } from '@/lib/types';

interface SidebarItemsProps {
  chats?: Chat[];
  overrideOnClickChatLink?: (
    chat: Chat,
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => void;
}

export function SidebarItems({
  chats,
  overrideOnClickChatLink,
}: SidebarItemsProps) {
  if (!chats?.length) return null;

  return (
    <AnimatePresence>
      {chats.map(
        (chat, index) =>
          chat && (
            <motion.div
              key={chat?.id}
              exit={{
                opacity: 0,
                height: 0,
              }}
            >
              <SidebarItem
                index={index}
                chat={chat}
                overrideOnClickChatLink={(e) =>
                  overrideOnClickChatLink?.(chat, e)
                }
              >
                <SidebarActions
                  chat={chat}
                  removeChat={removeChat}
                  shareChat={shareChat}
                />
              </SidebarItem>
            </motion.div>
          ),
      )}
    </AnimatePresence>
  );
}
