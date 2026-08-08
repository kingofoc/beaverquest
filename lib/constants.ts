export const TOKEN_TO_USDT = 0.01 as const;
export const CATEGORIES = ['Social', 'Telegram', 'Video', 'Blog'] as const; // to add 'Crypto', 'Clip' in furture features
export const SUB_CATEGORIES = [
 'Like/upvote/react/comment',
 'Share a post/video/comment',
 'Subscribe/follow/join',
 'Join bot/app',
 'Read blog/article',
 'Watch less than 5 mins video',
 'Watch 5 - 15 mins video',
 'Watch 15 - 30 mins video',
 'Watch 30 - 60 mins video',
 'Watch above 60 mins video',
] as const;

export type SubCategory = typeof SUB_CATEGORIES[number]

export const REWARD: Record<SubCategory, number> = {
 'Like/upvote/react/comment': 3,
 'Share a post/video/comment': 5,
 'Subscribe/follow/join': 5,
 'Join bot/app': 50,
 'Read blog/article': 30,
 'Watch less than 5 mins video': 10,
 'Watch 5 - 15 mins video': 20,
 'Watch 15 - 30 mins video': 50,
 'Watch 30 - 60 mins video': 100,
 'Watch above 60 mins video': 150
}