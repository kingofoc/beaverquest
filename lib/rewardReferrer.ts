import { User } from '@/models/users';
import connectDb from '@/lib/mongodb';

const REFERRER_REWARD = 1000;
const REF_ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

// generate referral ID
function generateRefId(length: number = 8): string {

 let refId = "";
 for (let i = 0; i < length; i++) {
  const randomIndex = Math.floor(Math.random() * REF_ID_CHARS.length)
  refId += REF_ID_CHARS [randomIndex]
 }
 return refId;
};

export async function generateUniqueRefId(): Promise<string> {
 let userRefId = "";
  let isUnique = false;

  while (isUnique) {
   userRefId = generateRefId();
   const existingUser = await User.findOne({ userRefId });
   if (!existingUser) isUnique = true
  }

  return userRefId;
}

export async function rewardReferrer(userId: number, referralId: string) {
 await connectDb();

 const user = await User.findOne({ userId });
 const referrer = await User.findOne({ userRefId: referralId});

 // rewards referrals
 if (referrer && !referrer.referredUsers.includes(userId)) {
  referrer.referredUsers.push(userId);
  referrer.referrals += 1;
  referrer. balance += REFERRER_REWARD;

  await referrer.save

  user.referredBy = referrer.userId;
  await user.save()
 }
}
