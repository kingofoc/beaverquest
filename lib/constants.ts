export const TELEGRAM_API = 'https://api.telegram.org';
export const BOT_TOKEN = process.env.BOT_TOKEN as string;
export const BOT_USERNAME = 'beaverquestbot';

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

export const COMMUNITY_TYPE = [
 "Crypto",
 "Finance",
 "Investing",
 "Forex",
 "Stocks",
 "Business",
 "Entrepreneurship",
 "Technology",
 "AI",
 "Software Development",
 "Programming",
 "Web3",
 "Blockchain",
 "DeFi",
 "NFT",
 "Gaming",
 "Esports",
 "Mobile Games",
 "Mini-App",
 "News",
 "Politics",
 "Sports",
 "Football",
 "Basketball",
 "Education",
 "Study",
 "Scholarships",
 "Career",
 "Jobs",
 "Freelancing",
 "Entertainment",
 "Movies",
 "TV Shows",
 "Music",
 "Celebrities",
 "Memes",
 "Comedy",
 "Lifestyle",
 "Fashion",
 "Beauty",
 "Health",
 "Fitness",
 "Food",
 "Travel",
 "Dating",
 "Parenting",
 "Religion",
 "Shopping",
 "Deals & Discounts",
 "E-commerce",
 "Automotive",
 "Real Estate",
 "Photography",
 "Art",
 "Design",
 "Books",
 "Writing",
 "Science",
 "Space",
 "History",
 "Local Community",
 "Events",
 "Charity",
 "Nonprofit",
 "Adult 18+",
 "Other",
] as const;

export type FormState = {
  category: Category | '';
  subCategory: string;
  title: string;
  description: string;
  guidelines: string;
  countries: string[];
  communities: string[];
  max: string;
  url: string;
  verificationType: 'manual' | 'telegram';
  verificationTarget: string;
};

export const EMPTY_FORM: FormState = {
  category: '',
  subCategory: '',
  title: '',
  description: '',
  guidelines: '',
  countries: [],
  communities: [],
  max: '',
  url: '',
  verificationType: 'manual',
  verificationTarget: '',
};

// export type ChannelType = typeof CHANNEL_TYPE
