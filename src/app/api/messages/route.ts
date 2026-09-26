import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages, users, rooms } from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { broadcastToRoom } from "@/lib/sse-store";

// GET /api/messages?roomId=xxx — fetch messages for a room
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  if (!roomId) {
    return NextResponse.json({ error: "roomId is required" }, { status: 400 });
  }

  try {
    const msgs = await db
      .select({
        id: messages.id,
        content: messages.content,
        createdAt: messages.createdAt,
        roomId: messages.roomId,
        userId: messages.userId,
        username: users.username,
        avatarColor: users.avatarColor,
      })
      .from(messages)
      .innerJoin(users, eq(messages.userId, users.id))
      .where(eq(messages.roomId, roomId))
      .orderBy(asc(messages.createdAt))
      .limit(100);

    return NextResponse.json(msgs);
  } catch (err) {
    console.error("[GET /api/messages]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/messages — send a message
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, userId, content } = body as {
      roomId: string;
      userId: string;
      content: string;
    };

    if (!roomId || !userId || !content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "roomId, userId, and content are required" },
        { status: 400 }
      );
    }

    // Verify room and user exist
    const [room] = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [created] = await db
      .insert(messages)
      .values({ roomId, userId, content: content.trim() })
      .returning();

    const fullMessage = {
      id: created.id,
      content: created.content,
      createdAt: created.createdAt,
      roomId: created.roomId,
      userId: created.userId,
      username: user.username,
      avatarColor: user.avatarColor,
    };

    // Broadcast to all subscribers in this room
    broadcastToRoom(roomId, {
      type: "message",
      data: fullMessage,
    });

    return NextResponse.json(fullMessage);
  } catch (err) {
    console.error("[POST /api/messages]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
