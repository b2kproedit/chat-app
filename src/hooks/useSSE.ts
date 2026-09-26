"use client";

import { useEffect, useRef, useCallback } from "react";

type SSEHandler = (event: { type: string; data: unknown }) => void;

export function useSSE(
  roomId: string | null,
  userId: string | null,
  onEvent: SSEHandler
) {
  const esRef = useRef<EventSource | null>(null);
  const handlerRef = useRef<SSEHandler>(onEvent);

  // Keep handler ref up to date
  useEffect(() => {
    handlerRef.current = onEvent;
  }, [onEvent]);

  const connect = useCallback(() => {
    if (!roomId || !userId) return;

    // Close existing connection
    if (esRef.current) {
      esRef.current.close();
    }

    const url = `/api/sse?roomId=${encodeURIComponent(roomId)}&userId=${encodeURIComponent(userId)}`;
    const es = new EventSource(url);
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data) as { type: string; data: unknown };
        handlerRef.current(parsed);
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      es.close();
      // Reconnect after 3 seconds
      setTimeout(connect, 3000);
    };
  }, [roomId, userId]);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
    };
  }, [connect]);
}
