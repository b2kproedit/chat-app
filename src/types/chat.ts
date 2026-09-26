export type Room = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
};

export type ChatUser = {
  id: string;
  username: string;
  avatarColor: string;
  sessionId: string;
};

export type ChatMessage = {
  id: string;
  content: string;
  createdAt: string;
  roomId: string;
  userId: string;
  username: string;
  avatarColor: string;
};

export type OnlineUser = {
  id: string;
  username: string;
  avatarColor: string;
};
