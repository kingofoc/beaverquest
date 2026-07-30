import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/users";
import connectDb from "@/lib/mongodb";

export async function GET(request: NextRequest) {
 await connectDb();

 const { searchParams } = new URL(request.url);
 const userId = Number(searchParams.get("userId"));

 if (!userId) {
  return NextResponse.json({ error: "userId not found" }, { status: 400 });
 }

 const user = await User.findOne({ userId });

 if(!user) {
  return NextResponse.json({ error: "userId not found" }, { status: 404 });
 }

 return NextResponse.json({
  userId: user.userId,
  userName: user.userName,
  firstName: user.firstName,
  profileURL: user.profileURL,
  referralId: user.referralId,
  referralLink: user.referralLink,
  country: user.country,
  language: user.language,
  balance: user.balance,
  telegramStars: user.telegramStars,
  ton: user.ton,
  airdrop: user.airdrop,
  tonWallet: user.tonWallet,
  level: user.level,
  community: user.community,
  referredBy: user.referredBy,
  referrals: user.referrals,
  referredUsers: user.referredUsers,
  taskCompleted: user.taskCompleted,
  taskCompletedList: user.taskCompletedList,
  taskVerified: user.taskVerified,
  taskClaimed: user.taskClaimed,
  taskStarted: user.taskStarted,
  taskPublished: user.taskPublished,
  totalTaskPublished: user.totalTaskPublished,
  taskSettled: user.taskSettled,
  totalTaskSettled: user.totalTaskSettled,
  checkInAds: user.checkInAds,
  lastCheckInAdsAt: user.lastCheckInAdsAt,
  adsCheckInClaimedAt: user.adsCheckInClaimedAt,
  rewardAds: user.rewardAds,
  lastRewardAdsAt: user.lastRewardAdsAt,
  totalAdsWatched: user.totalAdsWatched,
  checkInStarsPaid: user.checkInStarsPaid,
  checkInStarsPaidAt: user.checkInStarsPaidAt,
  totalStarsPaid: user.totalStarsPaid,
  checkInTonPaid: user.checkInTonPaid,
  checkInTonPaidAt: user.checkInTonPaidAt,
  totalTonPaid: user.totalTonPaid,
  taskBooster: user.taskBooster,
  checkInBooster: user.checkInBooster,
  airdropBooster: user.airdropBooster,
 })
}