import connectDb from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/users";
import countries from "i18n-iso-countries"
import en from "i18n-iso-countries/langs/en.json"

countries.registerLocale(en);

export async function POST(req: NextRequest) {
 await connectDb();

 const { userId } = await req.json();
 const countryCode = req.headers.get('x-vercel-ip-country');

 if (!userId) {
  return NextResponse.json({ error: "userId is required" }, { status: 400 });
 }

 const user = await User.findOne({ userId });

 if(!user) {
  return NextResponse.json({ error: "userId is required" }, { status: 404 });
 }

 const country = countryCode ? countries.getName(countryCode, "en") : null;

 await User.updateOne(
  {userId},
  {
   $set: { country }
  }
 );

 return NextResponse.json({ success: true, country }, { status: 200 });
}

export async function GET() {
 try {
  await connectDb();

  const countries = await User.aggregate([
   {
    $match: {
     country: { $nin: [null, ''] },
    },
   },
   {
    $group: {
     _id: '$country',
     count: { $sum: 1 },
    },
   },
   {
    $project: {
     _id: 0,
     country: '$_id',
     count: 1,
    },
   },
   {
    $sort: { count: -1 }, // biggest audience first
   },
  ]);

  const sorted = countries.sort((a, b) => a.localeCompare(b));

  return NextResponse.json({ countries: sorted }, { status: 200 });
 } catch (err) {
  console.error("Error fetching countries:", err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
 }
}