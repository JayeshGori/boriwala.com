import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PushToken from '@/lib/models/PushToken';
import Notification from '@/lib/models/Notification';
import { authenticateRequest } from '@/lib/auth';

// GET: List sent notifications (history)
export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50).lean();

    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    console.error('GET notifications error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// POST: Send a new push notification to all devices
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { title, body, type } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ success: false, error: 'Title and body are required' }, { status: 400 });
    }

    // Get all active push tokens
    const tokens = await PushToken.find({ isActive: true }).lean();

    if (tokens.length === 0) {
      return NextResponse.json({ success: false, error: 'No registered devices found' }, { status: 400 });
    }

    // Build Expo push messages
    const messages = tokens.map((t) => ({
      to: t.token,
      sound: 'default' as const,
      title,
      body,
      data: { type: type || 'general' },
      channelId: type === 'offer' || type === 'price_drop' ? 'offers' : 'default',
    }));

    // Send in batches of 100 (Expo limit)
    let sentCount = 0;
    let failedCount = 0;
    const invalidTokens: string[] = [];

    for (let i = 0; i < messages.length; i += 100) {
      const batch = messages.slice(i, i + 100);

      try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(batch),
        });

        const result = await response.json();

        if (result.data) {
          for (let j = 0; j < result.data.length; j++) {
            const ticket = result.data[j];
            if (ticket.status === 'ok') {
              sentCount++;
            } else {
              failedCount++;
              if (ticket.details?.error === 'DeviceNotRegistered') {
                invalidTokens.push(batch[j].to);
              }
            }
          }
        }
      } catch (batchError) {
        console.error('Batch send error:', batchError);
        failedCount += batch.length;
      }
    }

    // Deactivate invalid tokens
    if (invalidTokens.length > 0) {
      await PushToken.updateMany(
        { token: { $in: invalidTokens } },
        { isActive: false }
      );
    }

    // Save notification record
    const notification = await Notification.create({
      title,
      body,
      type: type || 'general',
      sentCount,
      failedCount,
      sentAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      notification,
      stats: {
        totalDevices: tokens.length,
        sent: sentCount,
        failed: failedCount,
        invalidRemoved: invalidTokens.length,
      },
    });
  } catch (error) {
    console.error('Send notification error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
