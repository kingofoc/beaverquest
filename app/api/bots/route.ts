// app/api/bots

import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/users';
import connectDb from '@/lib/mongodb';
import { fetchTelegramProfilePic } from '@/lib/userProfileUrl';
import { generateUniqueRefId, rewardReferrer } from '@/lib/rewardReferrer';

const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_LINK = 'https://t.me/beaverquestbot';

export async function POST(req: NextRequest) {
 const body = await req.json();
 // stars preCheckOutQuery goes here first

 const userId = Number(body?.message?.from?.id);
 const firstName = body?.message?.from?.first_name;
 const username = body?.message?.from?.username ?? firstName;
 const messageText = body?.message?.text;
 const chatId = body?.message?.chat?.id;
 const profileURL = await fetchTelegramProfilePic(userId);
 const language = body?.message?.from?.language_code;
 const isBot = body?.message?.from?.is_bot;

 // bot welcome message
 if (messageText?.startsWith("/start") && chatId) {
  const parts = messageText.split(' ');
  const referralCode = parts.length > 1 ? parts[1] : null

  const replyText = 
  `Beaver Quest connects people who need things done 
  with people ready to get them done on 💎 TON Blockchain! \n\n` +
  `As a PUBLISHER, post any task you need help with
  and set the reward. \n\n` +
  `As a HUNTER, browse tasks, complete them, and 
  earn puppy tokens instantly. \n\n` +
  `As a VIEWER, watch short ads and earn bonus rewards. \n\n` +
  `______   ______ \n\n` +
  `Every action on PuppyQuest earns you puppy tokens 💎. \n\n` +
  `Whether you want to outsource work, make extra money or just earn in your spare time - Beaver Quest makes it fun, simple and rewarding. \n\n`;

  await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/sendPhoto`, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({
    chat_id: chatId,
    photo: "https://puppizen.github.io/puppizen/bannerObsolete.png",
    caption: replyText,
    parse_mode: 'Markdown',
    reply_markup: {
     inline_keyboard: [
      [{
       text: "Publish Task",
       url: "https://t.me/puppizen"
      }],
      [{
       text: "Complete Task",
       url: "https://t.me/puppizen"
      }],
      [{
       text: "Telegram Community",
       url: "https://t.me/puppizen"
      }]
     ]
    }
   })
  });

  await connectDb();

  let user = await User.findOne({userId});
  if (!user) {
   const referralId = await generateUniqueRefId();
   const referralLink = `${BOT_LINK}?start=${referralId}`;

   user = await User.create ({
    userId,
    username,
    firstName,
    chatId,
    profileURL,
    isBot,
    referralId,
    referralLink,
    country: "",
    language,
    pQuestToken: 1000,
    telegramStars: 0,
    ton: 0,
    tonWallet: "",
    level: 1,
    community: "Beaver Quest",
    referredBy: null,
    referrals: 0,
    referredUsers: [],
    taskCompleted: 0,
    taskCompletedList: [],
    taskVerified: [],
    taskClaimed: [],
    taskStarted: [],
    taskPublished: [],
    totalTaskPublished: 0,
    taskSettled: [],
    totalTaskSettled: 0,
    adsWatchedToday: 0,
    rewardAdsCompleted: 0,
    totalAdsWatched: 0,
    totalStarsPaid: 0,
    tonPaidToday: 0,
    totalTonPaid: 0,
    taskBooster: 1,
    checkInBooster: 1,
    airdrop: 0,
    starsStreak: 0,
    adsStreak: 0,
    tonStreak: 0,
    checkInStreak: 0,
   });

   await rewardReferrer(user, referralCode);
  }
 }

 return NextResponse.json("Ok", { status: 200 });
}