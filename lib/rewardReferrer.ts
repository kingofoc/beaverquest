import { IUser, User } from '@/models/users';
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

  while (!isUnique) {
    userRefId = generateRefId();
    const existingUser = await User.findOne({ referralId: userRefId });
    if (!existingUser) isUnique = true
  }

  return userRefId;
}

export async function rewardReferrer(user: IUser, referralId: string) {
  if (!referralId) return;

  await connectDb();
  const referrer = await User.findOne({ referralId});

  // rewards referrals
  if (referrer && !referrer.referredUsers.includes(user.userId)) {
    referrer.referredUsers.push(user.userId);
    referrer.referrals = (referrer.referrals ?? 0) + 1;
    referrer.balance = (referrer.balance ?? 0) + REFERRER_REWARD;

    await referrer.save();

    user.referredBy = referrer.userId;
    await user.save();
  }
}
