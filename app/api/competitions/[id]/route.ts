import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Competition from "@/models/Competition";
import { auth } from "@/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const body = await req.json();
    const competition = await Competition.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!competition) return NextResponse.json({ error: "Competition not found" }, { status: 404 });
    return NextResponse.json(competition);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update competition" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const competition = await Competition.findByIdAndDelete(id);
    if (!competition) return NextResponse.json({ error: "Competition not found" }, { status: 404 });
    return NextResponse.json({ message: "Competition deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete competition" }, { status: 500 });
  }
}
