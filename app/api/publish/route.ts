import { NextRequest, NextResponse } from "next/server";
import { Gigs } from "@/models/gigs";
import { User } from "@/models/users";
import connectDb from "@/lib/mongodb";
import { REWARD } from "@/lib/constants";

export async function POST(req: NextRequest) {
 try {
  connectDb();

  const body = await req.json();
  const {
   publisherId,
   category,
   subCategory,
   title,
   description,
   guidelines,
   country,
   url,
   iconUrl,
   max,
   verificationType,
   verificationConfig,
  } = body

  if (!publisherId || !category || !title || !description || !guidelines || !country || !url || !iconUrl || !max || !verificationType || !verificationConfig) {
   return NextResponse.json({ error: "Missing field required" }, { status: 400 });
  }

  const reward = REWARD[subCategory as keyof typeof REWARD];
  if (!reward) {
  return NextResponse.json({ error: 'Invalid subCategory' }, { status: 400 });
  }

  if (typeof reward !== "number" || reward <= 0) {
   return NextResponse.json({ error: "reward must be a positive number" }, { status: 400 });
  }

  if (typeof max !== "number" || max <= 0) {
   return NextResponse.json({ error: "max must be a positive number" }, { status: 400 });
  }

  const allowedVerificationTypes = ['telegram', 'manual'];
  const resolvedVerificationType = verificationType ?? 'manual';

  if (!allowedVerificationTypes.includes(resolvedVerificationType)) {
   return NextResponse.json({ error: 'Invalid verificationType' }, { status: 400 });
  }

  // Non-manual verification types need config (action/target) to actually verify anything
  if (resolvedVerificationType === 'telegram' && !verificationConfig?.target) {
   return NextResponse.json(
    { error: 'verificationConfig.target is required for non-manual verification types' },
    { status: 400 }
   );
  }

  const totalCost = reward * max;

  // Atomically deduct from publisher balance ONLY if they have enough.
  // This prevents race conditions from concurrent gig creation requests.
  const updatedPublisher = await User.findOneAndUpdate(
   { userId: publisherId, balance: { $gte: totalCost } },
   { $inc: { pQuestToken: -totalCost } },
   { new: true }
  );

  if (!updatedPublisher) {
   return NextResponse.json(
    { error: 'Insufficient balance to fund this gig' },
    { status: 402 }
   );
  }

  let gigs;
  try {
   gigs = await Gigs.create({
    publisherId,
    category,
    subCategory,
    title,
    description,
    guidelines,
    reward,
    country: country ?? [],
    url,
    iconUrl,
    max,
    verificationType: resolvedVerificationType,
    verificationConfig: resolvedVerificationType === 'telegram' ? verificationConfig : undefined,
   })
  } catch(createError) {
   await User.findOneAndUpdate(
    { userId: publisherId },
    { $inc: { balance: totalCost } }
   );
   throw createError;
  }

  return NextResponse.json({ success: true, gigs }, { status: 201 });

 } catch(err) {
  console.error("Error creating gig", err);
  return NextResponse.json({ err: "Internal server error" }, { status: 500 });
 }
}