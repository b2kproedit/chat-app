"use client";

import { ChatMessage } from "@/types/chat";
import { Avatar } from "./Avatar";
import { formatDistanceToNow } from "date-fns";

type MessageBubbleProps = {
  message: ChatMessage;
  isMine: boolean;
  showAvatar: boolean;
};

export function MessageBubble({ message, isMine, showAvatar }: MessageBubbleProps) {
  const time = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });

  if (isMine) {
    return (
      <div className="flex items-end justify-end gap-2 group">
        <div className="flex flex-col items-end max-w-[75%]">
          {showAvatar && (
            <span className="text-xs text-slate-400 mb-1 mr-1">You</span>
          )}
          <div
            className="px-4 py-2.5 rounded-2xl rounded-br-sm text-white text-sm leading-relaxed shadow-sm"
            style={{ backgroundColor: message.avatarColor }}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          <span className="text-xs text-slate-400 mt-1 mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {time}
          </span>
        </div>
        {showAvatar && (
          <Avatar username={message.username} color={message.avatarColor} size="sm" />
        )}
        {!showAvatar && <div className="w-7" />}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 group">
      {showAvatar ? (
        <Avatar username={message.username} color={message.avatarColor} size="sm" />
      ) : (
        <div className="w-7" />
      )}
      <div className="flex flex-col max-w-[75%]">
        {showAvatar && (
          <span className="text-xs text-slate-500 mb-1 ml-1 font-medium">
            {message.username}
          </span>
        )}
        <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm bg-white text-slate-800 text-sm leading-relaxed shadow-sm border border-slate-100">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <span className="text-xs text-slate-400 mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {time}
        </span>
      </div>
    </div>
  );
}
