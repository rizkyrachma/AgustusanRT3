import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Category from "@/models/Category";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    Category.schema; // Prevent tree-shaking
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const query = type ? { type } : {};
    const transactions = await Transaction.find(query)
      .populate("categoryId", "name")
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    
    // Auto attach user ID
    const transaction = await Transaction.create({
      ...body,
      userId: session.user.id,
    });
    
    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    console.error("Create transaction error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create transaction" },
      { status: 500 }
    );
  }
}
