import connectDb from "@/lib/mongodb";
import { fetchTelegramProfilePic } from "@/lib/userProfileUrl";
import { User } from "@/models/users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
 await connectDb();

 const body = await request.json();
 const userId = Number(body.userId);
 const profileURL = body.profile_url || await fetchTelegramProfilePic(userId);

 if (!userId) {
  return NextResponse.json({ error: 'Telegram user ID is required' }, { status: 400 });
 };

 const user = await User.findOne({ userId });

 if (user) {
  await User.updateOne({ userId }, 
   { $set: {profileURL} }
  )
 }

 return NextResponse.json({ status: "OK" })
}