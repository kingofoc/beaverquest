import connectDb from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/users";

export async function POST(req: NextRequest) {
 await connectDb();

 const { userId } = await req.json();
 const country = req.headers.get('x-vercel-ip-country');

 if (!userId) {
  return NextResponse.json({ error: "userId is required" }, { status: 400 });
 }

 const user = await User.findOne({ userId });

 if(!user) {
  return NextResponse.json({ error: "userId is required" }, { status: 404 });
 }

 await User.updateOne(
  {userId},
  {
   $set: {
    country
   }
  }
 );

 return NextResponse.json({ success: true, country }, { status: 200 });
}