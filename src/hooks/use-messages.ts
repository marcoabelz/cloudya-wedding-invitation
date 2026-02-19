"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Message, MessageInsert } from "@/types";

const RATE_LIMIT_MS = 30000; // 30 detik antar submit

interface UseMessagesOptions {
  initialMessages?: Message[];
}

export function useMessages(options: UseMessagesOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(
    options.initialMessages ?? []
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const lastSubmitTime = useRef<number>(0);

  // Real-time subscription (optional - works if enabled in Supabase)
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new as Message;
          // Avoid duplicates (in case optimistic update already added it)
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) {
              return prev;
            }
            return [newMessage, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const submitMessage = useCallback(async (data: MessageInsert) => {
    setError(null);

    // Rate limiting - prevent spam
    const now = Date.now();
    if (now - lastSubmitTime.current < RATE_LIMIT_MS) {
      const secondsLeft = Math.ceil(
        (RATE_LIMIT_MS - (now - lastSubmitTime.current)) / 1000
      );
      setError(`Tunggu ${secondsLeft} detik sebelum mengirim lagi`);
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createClient();
        const { data: newMessage, error: insertError } = await supabase
          .from("messages")
          .insert(data)
          .select()
          .single();

        if (insertError) {
          throw new Error(insertError.message);
        }

        // Add to local state immediately (optimistic update)
        if (newMessage) {
          setMessages((prev) => [newMessage, ...prev]);
        }

        lastSubmitTime.current = Date.now();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal mengirim ucapan");
      }
    });
  }, []);

  return {
    messages,
    submitMessage,
    isPending,
    error,
  };
}
