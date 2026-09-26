"use client";

import { OnlineUser } from "@/types/chat";
import { Avatar } from "./Avatar";

type OnlineUsersProps = {
  users: OnlineUser[];
  currentUserId: string;
};

export function OnlineUsers({ users, currentUserId }: OnlineUsersProps) {
  return (
    <aside className="w-52 flex-shrink-0 bg-white border-l border-slate-200 flex flex-col h-full">
      <div className="px-4 py-3.5 border-b border-slate-100">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Online — {users.length}
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-50 transition"
          >
            <Avatar username={user.username} color={user.avatarColor} size="sm" online={true} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">
                {user.username}
                {user.id === currentUserId && (
                  <span className="ml-1 text-xs text-slate-400">(you)</span>
                )}
              </p>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4">No one online</p>
        )}
      </div>
    </aside>
  );
}
