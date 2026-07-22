import { model, Schema, models, Document } from 'mongoose';

export interface IUser extends Document {
  userId: number;
  username?: string;
  firstName?: string;
  chatId?: number;
  profileURL?: string;
  referralId?: string;
  referralLink: string;
  country?: string;
  language?: string;
  balance?: number;
  telegramStars?: number;
  ton?: number;
  airdrop?: number;
  tonWallet?: string;
  level?: number;
  community?: string;
  referredBy?: number;
  referrals?: number;
  referredUsers: number[];
  taskCompleted?: number;
  taskCompletedList?: string[];
  taskVerified?: number[];
  taskClaimed?: string[];
  taskStarted?: {
    taskId: string;
    startedAt: Date;
  }[];
  taskPublished?: number[];
  totalTaskPublished?: number;
  taskSettled?: string[];
  totalTaskSettled?: number;
  checkInAds?: number;
  lastCheckInAdsAt?: Date;
  adsCheckInClaimedAt?: Date;
  rewardAds?: number;
  lastRewardAdsAt?: Date;
  totalAdsWatched?: number;
  checkInStarsPaid?: number;
  checkInStarsPaidAt?: Date;
  totalStarsPaid?: number;
  checkInTonPaid?: number;
  checkInTonPaidAt?: Date;
  totalTonPaid?: number;
  taskBooster?: number;
  checkInBooster?: number;
  airdropBooster?: number;
}


const userSchema = new Schema<IUser>({
 userId: {
  type: Number,
  required: true,
  unique: true
 },

 username: {
  type: String
 },

 firstName: {
  type: String
 },

 chatId: {
  type: Number
 },

 profileURL: {
  type: String
 },

 referralId: {
  type: String,
  unique: true
 },

 referralLink: {
  type: String,
  required: true
 },

 country: {
  type: String
 },

 language: {
  type: String
 },

 balance: {
  type: Number,
 },

 telegramStars: {
  type: Number
 },

 ton: {
  type: Number
 },

 airdrop: {
  type:  Number
 },

 tonWallet: {
  type: String,
  unique: true,
  sparse: true
 },

 level: {
  type: Number
 },

 community: {
  type: String
 },

 referredBy: {
  type: Number
 },

 referrals: {
  type: Number
 },

 referredUsers: {
  type: [Number]
 },

 taskCompleted: {
  type: Number,
 },

 taskCompletedList: {
  type: [String]
 },

 taskVerified: {
  type: [Number]
 },

 taskClaimed: {
  type: [String]
 },

 taskStarted: [{
  taskId: String,
  startedAt: Date
 }],

 taskPublished: {
  type: [Number]
 },

 totalTaskPublished: {
  type: Number
 },

 taskSettled: {
  type: [String]
 },

 totalTaskSettled: {
  type: Number
 },

 checkInAds: {
  type: Number
 },

 lastCheckInAdsAt: {
  type: Date
 },

 adsCheckInClaimedAt: {
  type: Date
 },

 rewardAds: {
  type: Number
 },

 lastRewardAdsAt: {
  type: Date
 },

 totalAdsWatched: {
  type: Number
 },

 checkInStarsPaid: {
  type: Number
 },

 checkInStarsPaidAt: {
  type: Date
 },

 totalStarsPaid: {
  type: Number
 },

 checkInTonPaid: {
  type: Number
 },

 checkInTonPaidAt: {
  type: Date
 },

 totalTonPaid: {
  type: Number
 },

 taskBooster: {
  type: Number
 },

 checkInBooster: {
  type: Number
 },

 airdropBooster: {
  type: Number
 }
});

export const User = models.User || model<IUser>("User", userSchema);