import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/users";
import connectDb from "@/lib/mongodb";

export async function POST(req: NextRequest) {
 try{
  await connectDb();

  const { userId, walletAddress } = await req.json();

  if (!userId || !walletAddress) {
   return NextResponse.json({ error: "userId and walletAddress are required" }, { status: 400 });
  }

  const user = await User.findOne({ userId });

  if (!user) {
   return NextResponse.json({ error: "user not found" }, { status: 404 });
  }

  await User.updateOne(
   { userId },
   { $set:
    { tonWallet: walletAddress }
    }
  );

  return NextResponse.json({ success: true }, { status: 200 });

 } catch (error) {
  console.error("Error saving wallet address:", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
 }
}