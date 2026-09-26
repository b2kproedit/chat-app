import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  addSubscriber,
  removeSubscriber,
  broadcastToRoom,
  getRoomOnlineUsers,
} from "@/lib/sse-store";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");
  const userId = searchParams.get("userId");

  if (!roomId || !userId) {
    return new Response("Missing roomId or userId", { status: 400 });
  }

  const subId = uuidv4();

  const stream = new ReadableStream({
    start(controller) {
      addSubscriber(subId, controller, roomId, userId);

      // Send initial connection event
      const encoder = new TextEncoder();
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ type: "connected", data: { subId } })}\n\n`
        )
      );

      // Broadcast updated presence to room
      const onlineUsers = getRoomOnlineUsers(roomId);
      broadcastToRoom(roomId, {
        type: "presence",
        data: { onlineUsers },
      });

      // Handle client disconnect
      req.signal.addEventListener("abort", async () => {
        removeSubscriber(subId);
        try {
          controller.close();
        } catch {
          // already closed
        }
        // Mark user offline
        try {
          await db
            .update(users)
            .set({ isOnline: false, lastSeen: new Date() })
            .where(eq(users.id, userId));
        } catch {
          // ignore
        }
        // Broadcast updated presence
        const remaining = getRoomOnlineUsers(roomId);
        broadcastToRoom(roomId, {
          type: "presence",
          data: { onlineUsers: remaining },
        });
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
