import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Competition from "@/models/Competition";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const competitions = await Competition.find({}).sort({ createdAt: -1 });
    return NextResponse.json(competitions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch competitions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const competition = await Competition.create(body);
    return NextResponse.json(competition, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create competition" }, { status: 500 });
  }
}
