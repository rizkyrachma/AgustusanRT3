import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Committee from "@/models/Committee";
import { auth } from "@/auth";

export async function GET() {
  try {
    await dbConnect();
    const committee = await Committee.find({}).sort({ createdAt: -1 });
    return NextResponse.json(committee);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch committee" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    
    if (!body.name || !body.role) {
      return NextResponse.json({ error: "Name and role are required" }, { status: 400 });
    }

    const member = await Committee.create(body);
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create committee member" }, { status: 500 });
  }
}
