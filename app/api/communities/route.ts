import { NextRequest, NextResponse } from 'next/server';
import { Community } from '@/models/community';
import { PendingCommunityVerification } from '@/models/pendingCommunityVerification';
import connectDb from '@/lib/mongodb';
import { TELEGRAM_API, BOT_TOKEN } from '@/lib/constants';

export async function POST(req: NextRequest) {
 try {
  await connectDb();

  const body = await req.json();
  const { ownerId, name, description, channelType, iconUrl } = body;

  if (!ownerId || !name || channelType) {
   return NextResponse.json(
    { error: "Missing field required: ownerId, channelUsername, name" },
    { status: 400 }
   );
  }

  // Step 1: Look up the forwarded-message verification
  const pending = await PendingCommunityVerification.findOne({ ownerId });

  if (!pending) {
   return NextResponse.json(
    { error: "Forward a message from your channel to our bot first" },
    { status: 400 }
   );
  }

  const { channelId, channelUsername } = pending

  // Step 2: Confirm the requesting user is actually an admin of this channel
  const adminCheckRes = await fetch(
   `${TELEGRAM_API}/bot${BOT_TOKEN}/getChatMember?chat_id=${channelId}&user_id=${ownerId}`
  );
  const adminCheckData = await adminCheckRes.json();

  if (!adminCheckData.ok) {
   return NextResponse.json(
    { error: "Could not find that channel, or our bot cannot access it yet" },
    { status: 400 }
   );
  }

  const ownerStatus = adminCheckData.result.status;
  if (ownerStatus !== 'administrator' && ownerStatus !== 'creator') {
   return NextResponse.json(
    { error: "You must be an admin of this channel to add it" },
    { status: 403 }
   );
  }

  // Step 2: Confirm the bot itself is an admin with the right permissions
  const botInfoRes = await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/getMe`);
  const botInfoData = await botInfoRes.json();
  const botId = botInfoData.result?.id;

  const botCheckRes = await fetch(
   `${TELEGRAM_API}/bot${BOT_TOKEN}/getChatMember?chat_id=${channelId}&user_id=${botId}`
  );
  const botCheckData = await botCheckRes.json();

  if (!botCheckData.ok || botCheckData.result.status !== 'administrator') {
   return NextResponse.json(
    { error: "Add our bot as an admin to this channel first, with permission to send messages and view members" },
    { status: 400 }
   );
  }

  const botPermissions = botCheckData.result;
  const hasRequiredPermissions = botPermissions.can_post_messages !== false && botPermissions.can_invite_users !== false;

  if (!hasRequiredPermissions) {
   return NextResponse.json(
    { error: "Our bot needs permission to send messages and see members" },
    { status: 400 }
   );
  }

  // Step 3: Get channel member count for display
  const memberCountRes = await fetch(
   `${TELEGRAM_API}/bot${BOT_TOKEN}/getChatMemberCount?chat_id=${channelId}`
  );
  const memberCountData = await memberCountRes.json();
  const memberCount = memberCountData.ok ? memberCountData.result : 0;

  // Step 4: Create the community, already verified since checks passed
  const community = await Community.create({
   ownerId,
   channelId,
   channelUsername,
   name,
   description,
   channelType,
   iconUrl,
   memberCount,
   botVerified: true,
   botVerifiedAt: new Date(),
   status: 'active',
  });

  // Clean up the pending record now that it's used
  await PendingCommunityVerification.deleteOne({ ownerId });

  return NextResponse.json({ success: true, community }, { status: 201 });
 } catch (error) {
  console.error("error creating community:", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
 }
}