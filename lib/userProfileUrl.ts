// lib/userProfileURL.ts
const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.BOT_TOKEN as string;

export async function fetchTelegramProfilePic(userId: number): Promise<string | null> {
 try {
  // get user telegram profile pics
   const res = await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/getUserProfilePhotos?user_id=${userId}`);
   const data = await res.json();

   if (data.ok && data.result.total_count > 0) {
    const fileId = data.result.photos[0][0].file_id;
    const fileRes = await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
    const fileData = await fileRes.json();

    // Return proxy URL instead of Telegram's direct link
    if (fileData.ok) {
     const filePath = fileData.result.file_path;
     
     // Return proxy URL instead of telegram direct link
     return `/api/proxy-image?filePath=${encodeURIComponent(filePath)}`;
    }
   }
 } catch (error) {
  console.error("Error fetching telegram profile photo:", error);
 }

 return null;
}