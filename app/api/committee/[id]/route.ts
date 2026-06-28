import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Committee from "@/models/Committee";
import { auth } from "@/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const id = (await params).id;

    const member = await Committee.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!member) {
      return NextResponse.json({ error: "Committee member not found" }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update committee member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const id = (await params).id;
    const member = await Committee.findByIdAndDelete(id);

    if (!member) {
      return NextResponse.json({ error: "Committee member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete committee member" },
      { status: 500 }
    );
  }
}
