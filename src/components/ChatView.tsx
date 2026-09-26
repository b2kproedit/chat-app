"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChatMessage, ChatUser, Room, OnlineUser } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";
import { OnlineUsers } from "./OnlineUsers";
import { Avatar } from "./Avatar";
import { useSSE } from "@/hooks/useSSE";

type ChatViewProps = {
  room: Room;
  currentUser: ChatUser;
};

type TypingUser = { userId: string; username: string };

export function ChatView({ room, currentUser }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showOnline, setShowOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const typingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  // Fetch messages when room changes
  useEffect(() => {
    setLoading(true);
    setMessages([]);
    setTypingUsers([]);

    fetch(`/api/messages?roomId=${room.id}`)
      .then((r) => r.json())
      .then((data: ChatMessage[]) => {
        setMessages(data);
        setLoading(false);
        setTimeout(() => scrollToBottom(false), 50);
      })
      .catch(() => setLoading(false));

    // Fetch online users
    fetch(`/api/users/room?roomId=${room.id}`)
      .then((r) => r.json())
      .then((data: OnlineUser[]) => setOnlineUsers(data))
      .catch(() => {});
  }, [room.id, scrollToBottom]);

  // SSE event handler
  const handleSSEEvent = useCallback(
    (event: { type: string; data: unknown }) => {
      if (event.type === "message") {
        const msg = event.data as ChatMessage;
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        setTimeout(() => scrollToBottom(true), 50);
        // Clear typing indicator for this user
        setTypingUsers((prev) => prev.filter((u) => u.userId !== msg.userId));
      } else if (event.type === "typing") {
        const { userId, username, isTyping } = event.data as {
          userId: string;
          username: string;
          isTyping: boolean;
        };
        if (userId === currentUser.id) return;

        if (isTyping) {
          setTypingUsers((prev) => {
            if (prev.some((u) => u.userId === userId)) return prev;
            return [...prev, { userId, username }];
          });
          // Auto-clear after 4s
          const existing = typingTimeouts.current.get(userId);
          if (existing) clearTimeout(existing);
          const t = setTimeout(() => {
            setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
            typingTimeouts.current.delete(userId);
          }, 4000);
          typingTimeouts.current.set(userId, t);
        } else {
          setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
          const existing = typingTimeouts.current.get(userId);
          if (existing) {
            clearTimeout(existing);
            typingTimeouts.current.delete(userId);
          }
        }
      } else if (event.type === "presence") {
        const { onlineUsers: userIds } = event.data as { onlineUsers: string[] };
        if (userIds.length === 0) {
          setOnlineUsers([]);
          return;
        }
        // Fetch full user details
        fetch(`/api/users/room?roomId=${room.id}`)
          .then((r) => r.json())
          .then((data: OnlineUser[]) => setOnlineUsers(data))
          .catch(() => {});
      }
    },
    [currentUser.id, room.id, scrollToBottom]
  );

  useSSE(room.id, currentUser.id, handleSSEEvent);

  const sendTyping = useCallback(
    (typing: boolean) => {
      fetch("/api/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room.id,
          userId: currentUser.id,
          username: currentUser.username,
          isTyping: typing,
        }),
      }).catch(() => {});
    },
    [room.id, currentUser.id, currentUser.username]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    // Typing indicator
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      sendTyping(true);
    }

    if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    typingDebounceRef.current = setTimeout(() => {
      isTypingRef.current = false;
      sendTyping(false);
    }, 2000);
  };

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;

    // Stop typing indicator
    if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    isTypingRef.current = false;
    sendTyping(false);

    setInput("");
    setSending(true);

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room.id,
          userId: currentUser.id,
          content,
        }),
      });
    } catch {
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main chat area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Room header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-400">#</span>
            <div>
              <h2 className="font-semibold text-slate-800">{room.name}</h2>
              {room.description && (
                <p className="text-xs text-slate-500">{room.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span>{onlineUsers.length} online</span>
            </div>
            <button
              onClick={() => setShowOnline(!showOnline)}
              className="ml-2 p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition"
              title="Toggle online users"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-slate-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <p className="text-sm">Loading messages…</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
              <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium">No messages yet</p>
              <p className="text-xs">Be the first to say something!</p>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => {
                const prev = messages[idx - 1];
                const showAvatar =
                  !prev ||
                  prev.userId !== msg.userId ||
                  new Date(msg.createdAt).getTime() -
                    new Date(prev.createdAt).getTime() >
                    5 * 60 * 1000;
                return (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isMine={msg.userId === currentUser.id}
                    showAvatar={showAvatar}
                  />
                );
              })}
            </>
          )}

          {/* Typing indicators */}
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="flex gap-1 items-center">
                {typingUsers.slice(0, 3).map((u) => (
                  <Avatar
                    key={u.userId}
                    username={u.username}
                    color="#94a3b8"
                    size="sm"
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 bg-white rounded-2xl px-3 py-2 shadow-sm border border-slate-100">
                <span className="text-xs text-slate-500">
                  {typingUsers.length === 1
                    ? `${typingUsers[0].username} is typing`
                    : typingUsers.length === 2
                    ? `${typingUsers[0].username} and ${typingUsers[1].username} are typing`
                    : "Several people are typing"}
                </span>
                <div className="flex gap-0.5 ml-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="px-4 py-3 bg-white border-t border-slate-200 flex-shrink-0">
          <div className="flex items-end gap-2 bg-slate-50 rounded-2xl border border-slate-200 px-4 py-2.5 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition">
            <Avatar
              username={currentUser.username}
              color={currentUser.avatarColor}
              size="sm"
            />
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${room.name}… (Enter to send, Shift+Enter for newline)`}
              rows={1}
              className="flex-1 bg-transparent resize-none text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none max-h-36 leading-relaxed"
              style={{ minHeight: "1.5rem" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 144)}px`;
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="flex-shrink-0 w-8 h-8 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition active:scale-95"
            >
              {sending ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 ml-1">
            Press <kbd className="px-1 py-0.5 bg-slate-100 rounded text-slate-500 font-mono">Enter</kbd> to send ·{" "}
            <kbd className="px-1 py-0.5 bg-slate-100 rounded text-slate-500 font-mono">Shift+Enter</kbd> for newline
          </p>
        </div>
      </div>

      {/* Online users panel */}
      {showOnline && (
        <OnlineUsers users={onlineUsers} currentUserId={currentUser.id} />
      )}
    </div>
  );
}
