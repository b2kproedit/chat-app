"use client";

import { useState } from "react";
import { Avatar } from "./Avatar";

const AVATAR_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#ef4444", // red
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
];

const ADJECTIVES = ["Happy", "Cool", "Swift", "Bright", "Clever", "Bold", "Calm", "Eager"];
const NOUNS = ["Panda", "Fox", "Wolf", "Eagle", "Tiger", "Hawk", "Bear", "Lion"];

function randomName() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj}${noun}`;
}

type JoinModalProps = {
  onJoin: (username: string, avatarColor: string) => void;
};

export function JoinModal({ onJoin }: JoinModalProps) {
  const [username, setUsername] = useState(randomName());
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = username.trim();
    if (!name) return;
    onJoin(name, selectedColor);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-6 py-8 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome to LiveChat</h1>
          <p className="text-white/70 text-sm mt-1">Join the conversation</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Preview */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <Avatar username={username || "?"} color={selectedColor} size="lg" online={true} />
            <div>
              <p className="font-semibold text-slate-800">{username || "Your name"}</p>
              <p className="text-xs text-slate-500">Online</p>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={30}
              placeholder="Enter your name..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Avatar Color
            </label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className="w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none"
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!username.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-base shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:opacity-90 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join Chat →
          </button>
        </form>
      </div>
    </div>
  );
}
