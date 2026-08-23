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

export const CHANNEL_TYPE = {
 CRYPTO: "Crypto",
 FINANCE: "Finance",
 INVESTING: "Investing",
 TRADING: "Trading",
 FOREX: "Forex",
 STOCKS: "Stocks",
 BUSINESS: "Business",
 ENTREPRENEURSHIP: "Entrepreneurship",

 TECHNOLOGY: "Technology",
 AI: "Artificial Intelligence",
 SOFTWARE: "Software Development",
 PROGRAMMING: "Programming",
 WEB3: "Web3",
 BLOCKCHAIN: "Blockchain",
 DEFI: "DeFi",
 NFT: "NFT",

 GAMING: "Gaming",
 ESPORTS: "Esports",
 MOBILE_GAMES: "Mobile Games",
 PLAY_TO_EARN: "Play-to-Earn",

 NEWS: "News",
 WORLD_NEWS: "World News",
 LOCAL_NEWS: "Local News",
 POLITICS: "Politics",
 SPORTS: "Sports",
 FOOTBALL: "Football",
 BASKETBALL: "Basketball",

 EDUCATION: "Education",
 ONLINE_COURSES: "Online Courses",
 STUDY: "Study",
 SCHOLARSHIPS: "Scholarships",
 CAREER: "Career",
 JOBS: "Jobs",
 FREELANCING: "Freelancing",

 ENTERTAINMENT: "Entertainment",
 MOVIES: "Movies",
 TV_SHOWS: "TV Shows",
 MUSIC: "Music",
 CELEBRITIES: "Celebrities",
 MEMES: "Memes",
 COMEDY: "Comedy",

 LIFESTYLE: "Lifestyle",
 FASHION: "Fashion",
 BEAUTY: "Beauty",
 HEALTH: "Health",
 FITNESS: "Fitness",
 FOOD: "Food",
 TRAVEL: "Travel",

 RELATIONSHIPS: "Relationships",
 DATING: "Dating",
 PARENTING: "Parenting",

 RELIGION: "Religion",
 SPIRITUALITY: "Spirituality",

 SHOPPING: "Shopping",
 DEALS: "Deals & Discounts",
 ECOMMERCE: "E-commerce",

 AUTOMOTIVE: "Automotive",
 REAL_ESTATE: "Real Estate",

 PHOTOGRAPHY: "Photography",
 ART: "Art",
 DESIGN: "Design",
 BOOKS: "Books",
 WRITING: "Writing",

 SCIENCE: "Science",
 SPACE: "Space",
 HISTORY: "History",

 LOCAL_COMMUNITY: "Local Community",
 EVENTS: "Events",
 CHARITY: "Charity",
 NONPROFIT: "Nonprofit",

 ADULT: "18+",
 OTHER: "Other",
} as const;

export type ChannelType = typeof CHANNEL_TYPE[keyof typeof CHANNEL_TYPE];
