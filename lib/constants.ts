export const TELEGRAM_API = 'https://api.telegram.org';
export const BOT_TOKEN = process.env.BOT_TOKEN as string;

export const TOKEN_TO_USDT = 0.01 as const;
export const COMMUNITY_TARGETING_FEE = 10;
export const CATEGORIES = ['Social', 'Telegram', 'Video', 'Blog'] as const; // to add 'Crypto', 'Clip' in furture features
export type Category = typeof CATEGORIES[number];

export type SubCategoryConfig = {
 label: string;
 reward: number
};

export const SUB_CATEGORIES_BY_CATEGORY: Record<Category, SubCategoryConfig[]> = {
 Social: [
  { label: 'Like/upvote/react/comment', reward: 3 },
  { label: 'Share a post/video/comment', reward: 10 },
  { label: 'Subscribe/follow/join', reward: 5 },
 ],
 Telegram: [
  { label: 'Join channel', reward: 5 },
  { label: 'Join bot/app', reward: 50 },
 ],
 Blog: [
  { label: 'Read blog/article', reward: 20 },
 ],
 Video: [
  { label: 'Watch less than 5 mins video', reward: 10 },
  { label: 'Watch 5 - 15 mins video', reward: 20 },
  { label: 'Watch 15 - 30 mins video', reward: 50 },
  { label: 'Watch 30 - 60 mins video', reward: 100 },
  { label: 'Watch above 60 mins video', reward: 150 },
 ],
};
