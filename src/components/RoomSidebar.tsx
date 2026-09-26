"use client";

import { useState } from "react";
import { Room, ChatUser } from "@/types/chat";
import { Avatar } from "./Avatar";

type RoomSidebarProps = {
  rooms: Room[];
  currentRoom: Room | null;
  currentUser: ChatUser;
  onSelectRoom: (room: Room) => void;
  onCreateRoom: (name: string, description: string) => void;
  onlineCount: number;
};

export function RoomSidebar({
  rooms,
  currentRoom,
  currentUser,
  onSelectRoom,
  onCreateRoom,
  onlineCount,
}: RoomSidebarProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDesc, setNewRoomDesc] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    onCreateRoom(newRoomName.trim(), newRoomDesc.trim());
    setNewRoomName("");
    setNewRoomDesc("");
    setShowCreate(false);
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-900 text-white flex flex-col h-full">
      {/* App header */}
      <div className="px-4 py-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">LiveChat</span>
        </div>
      </div>

      {/* Channels label + create */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Channels
        </span>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="w-6 h-6 rounded-md hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          title="New channel"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Create room form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="mx-3 mb-2 p-3 bg-slate-800 rounded-xl space-y-2">
          <input
            autoFocus
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Channel name"
            maxLength={30}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={newRoomDesc}
            onChange={(e) => setNewRoomDesc(e.target.value)}
            placeholder="Description (optional)"
            maxLength={80}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!newRoomName.trim()}
              className="flex-1 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium disabled:opacity-50 transition"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Room list */}
      <nav className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition group ${
              currentRoom?.id === room.id
                ? "bg-indigo-500/20 text-indigo-300"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <span className="text-lg">#</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{room.name}</p>
              {room.description && (
                <p className="text-xs text-slate-500 truncate">{room.description}</p>
              )}
            </div>
            {currentRoom?.id === room.id && (
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400" />
            )}
          </button>
        ))}
      </nav>

      {/* User profile footer */}
      <div className="px-3 py-3 border-t border-slate-700/60 bg-slate-900/80">
        <div className="flex items-center gap-2.5">
          <Avatar username={currentUser.username} color={currentUser.avatarColor} size="sm" online={true} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{currentUser.username}</p>
            <p className="text-xs text-emerald-400">● Online</p>
          </div>
          {onlineCount > 0 && (
            <span className="text-xs text-slate-500">{onlineCount} here</span>
          )}
        </div>
      </div>
    </aside>
  );
}
