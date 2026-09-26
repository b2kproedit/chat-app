import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { getRoomOnlineUsers } from "@/lib/sse-store";

// GET /api/users/room?roomId=xxx — get online users in a room
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  if (!roomId) {
    return NextResponse.json({ error: "roomId is required" }, { status: 400 });
  }

  try {
    const onlineUserIds = getRoomOnlineUsers(roomId);

    if (onlineUserIds.length === 0) {
      return NextResponse.json([]);
    }

    const onlineUsers = await db
      .select({
        id: users.id,
        username: users.username,
        avatarColor: users.avatarColor,
      })
      .from(users)
      .where(inArray(users.id, onlineUserIds));

    return NextResponse.json(onlineUsers);
  } catch (err) {
    console.error("[GET /api/users/room]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
