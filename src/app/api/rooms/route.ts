import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { rooms } from "@/db/schema";
import { asc } from "drizzle-orm";

// GET /api/rooms — list all rooms
export async function GET() {
  try {
    const allRooms = await db.select().from(rooms).orderBy(asc(rooms.createdAt));
    return NextResponse.json(allRooms);
  } catch (err) {
    console.error("[GET /api/rooms]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/rooms — create a new room
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description } = body as { name: string; description?: string };

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const created = await db
      .insert(rooms)
      .values({ name: name.trim(), description: description?.trim() })
      .returning();

    return NextResponse.json(created[0]);
  } catch (err) {
    console.error("[POST /api/rooms]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
