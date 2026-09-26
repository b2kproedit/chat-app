import { NextRequest, NextResponse } from "next/server";
import { broadcastToRoom } from "@/lib/sse-store";

// POST /api/typing — broadcast typing indicator
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, userId, username, isTyping } = body as {
      roomId: string;
      userId: string;
      username: string;
      isTyping: boolean;
    };

    if (!roomId || !userId || !username) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    broadcastToRoom(roomId, {
      type: "typing",
      data: { userId, username, isTyping },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/typing]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
