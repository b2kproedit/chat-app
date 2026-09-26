// Global SSE subscriber store — survives hot reloads in dev via globalThis
type Subscriber = {
  controller: ReadableStreamDefaultController;
  roomId: string;
  userId: string;
};

type EventPayload = {
  type: string;
  data: unknown;
};

const globalForSSE = globalThis as typeof globalThis & {
  __sseSubscribers?: Map<string, Subscriber>;
};

if (!globalForSSE.__sseSubscribers) {
  globalForSSE.__sseSubscribers = new Map();
}

export const subscribers = globalForSSE.__sseSubscribers;

export function addSubscriber(
  id: string,
  controller: ReadableStreamDefaultController,
  roomId: string,
  userId: string
) {
  subscribers.set(id, { controller, roomId, userId });
}

export function removeSubscriber(id: string) {
  subscribers.delete(id);
}

export function broadcastToRoom(roomId: string, payload: EventPayload) {
  const encoder = new TextEncoder();
  const msg = `data: ${JSON.stringify(payload)}\n\n`;
  for (const [, sub] of subscribers) {
    if (sub.roomId === roomId) {
      try {
        sub.controller.enqueue(encoder.encode(msg));
      } catch {
        // subscriber disconnected
      }
    }
  }
}

export function broadcastToAll(payload: EventPayload) {
  const encoder = new TextEncoder();
  const msg = `data: ${JSON.stringify(payload)}\n\n`;
  for (const [, sub] of subscribers) {
    try {
      sub.controller.enqueue(encoder.encode(msg));
    } catch {
      // subscriber disconnected
    }
  }
}

export function getRoomOnlineUsers(roomId: string): string[] {
  const userIds = new Set<string>();
  for (const [, sub] of subscribers) {
    if (sub.roomId === roomId) {
      userIds.add(sub.userId);
    }
  }
  return Array.from(userIds);
}
