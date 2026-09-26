"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Room, ChatUser } from "@/types/chat";
import { JoinModal } from "./JoinModal";
import { RoomSidebar } from "./RoomSidebar";
import { ChatView } from "./ChatView";

const SESSION_KEY = "livechat_session";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = uuidv4();
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export function ChatApp() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [showJoin, setShowJoin] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Load rooms
  const loadRooms = async () => {
    const res = await fetch("/api/rooms");
    const data: Room[] = await res.json();
    setRooms(data);
    return data;
  };

  // Check for existing session on mount
  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    const savedUser = localStorage.getItem("livechat_user");

    const init = async () => {
      const roomList = await loadRooms();
      if (roomList.length > 0) {
        setCurrentRoom(roomList[0]);
      }

      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser) as {
            username: string;
            avatarColor: string;
          };
          // Re-register with server
          const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              username: parsed.username,
              avatarColor: parsed.avatarColor,
            }),
          });
          const user = await res.json();
          setCurrentUser({ ...user, sessionId });
        } catch {
          setShowJoin(true);
        }
      } else {
        setShowJoin(true);
      }

      setInitializing(false);
    };

    init().catch(() => {
      setShowJoin(true);
      setInitializing(false);
    });
  }, []);

  const handleJoin = async (username: string, avatarColor: string) => {
    const sessionId = getOrCreateSessionId();
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, username, avatarColor }),
      });
      const user = await res.json();
      setCurrentUser({ ...user, sessionId });
      localStorage.setItem("livechat_user", JSON.stringify({ username, avatarColor }));
      setShowJoin(false);
    } catch {
      alert("Failed to join. Please try again.");
    }
  };

  const handleSelectRoom = (room: Room) => {
    setCurrentRoom(room);
  };

  const handleCreateRoom = async (name: string, description: string) => {
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const newRoom: Room = await res.json();
      setRooms((prev) => [...prev, newRoom]);
      setCurrentRoom(newRoom);
    } catch {
      alert("Failed to create room.");
    }
  };

  if (initializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <p className="text-slate-400 text-sm">Connecting…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showJoin && <JoinModal onJoin={handleJoin} />}

      {currentUser && (
        <div className="flex h-screen overflow-hidden bg-slate-100">
          <RoomSidebar
            rooms={rooms}
            currentRoom={currentRoom}
            currentUser={currentUser}
            onSelectRoom={handleSelectRoom}
            onCreateRoom={handleCreateRoom}
            onlineCount={0}
          />

          {currentRoom ? (
            <ChatView room={currentRoom} currentUser={currentUser} />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-slate-50">
              <div className="text-center text-slate-400">
                <svg className="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="font-medium">Select a channel to start chatting</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
