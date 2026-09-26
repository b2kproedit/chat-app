import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// POST /api/users — create or retrieve user by sessionId
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, username, avatarColor } = body as {
      sessionId: string;
      username: string;
      avatarColor: string;
    };

    if (!sessionId || !username) {
      return NextResponse.json(
        { error: "sessionId and username are required" },
        { status: 400 }
      );
    }

    // Check existing user
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.sessionId, sessionId))
      .limit(1);

    if (existing.length > 0) {
      // Update online status
      const updated = await db
        .update(users)
        .set({ isOnline: true, lastSeen: new Date(), username })
        .where(eq(users.sessionId, sessionId))
        .returning();
      return NextResponse.json(updated[0]);
    }

    // Create new user
    const created = await db
      .insert(users)
      .values({
        sessionId,
        username,
        avatarColor: avatarColor || "#6366f1",
        isOnline: true,
        lastSeen: new Date(),
      })
      .returning();

    return NextResponse.json(created[0]);
  } catch (err) {
    console.error("[POST /api/users]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/users — update username
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, username } = body as { userId: string; username: string };

    if (!userId || !username) {
      return NextResponse.json(
        { error: "userId and username are required" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(users)
      .set({ username })
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (err) {
    console.error("[PATCH /api/users]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
