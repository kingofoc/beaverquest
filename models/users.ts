import { model, Schema, models } from 'mongoose';

const userSchema = new Schema({
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
  type: Number,
  required: true
 },

 profileURL: {
  type: String
 },

 referralId: {
  type: String,
  required: true,
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

 pQuestToken: {
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

 taskStarted: {
  taskId: [String],
  startedAt: Date
 },

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

export const User = models.User || model("User", userSchema);