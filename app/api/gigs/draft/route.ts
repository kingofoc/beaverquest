// app/api/gigs/draft/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GigDraft } from '@/models/gigDraft';
import connectDb from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { publisherId, formData, step } = await req.json();

    if (!publisherId) {
      return NextResponse.json({ error: 'publisherId is required' }, { status: 400 });
    }

    await GigDraft.findOneAndUpdate(
      { publisherId },
      { formData, step },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const publisherId = req.nextUrl.searchParams.get('publisherId');

    if (!publisherId) {
      return NextResponse.json({ error: 'publisherId is required' }, { status: 400 });
    }

    const draft = await GigDraft.findOne({ publisherId: Number(publisherId) });

    return NextResponse.json({ draft }, { status: 200 });
  } catch (error) {
    console.error('Error fetching draft:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDb();
    const publisherId = req.nextUrl.searchParams.get('publisherId');

    if (!publisherId) {
      return NextResponse.json({ error: 'publisherId is required' }, { status: 400 });
    }

    await GigDraft.deleteOne({ publisherId: Number(publisherId) });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting draft:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}