import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import PriceAlert from '@/lib/models/PriceAlert';
import { authenticateRequest } from '@/lib/auth';
import { sendBulkEmails, campaignEmail } from '@/lib/email';

type Audience = 'approved-buyers' | 'all-buyers' | 'price-alert-subscribers';

interface Recipient {
  email: string;
  name?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseManual(raw: string): Recipient[] {
  if (!raw) return [];
  return raw
    .split(/[\s,;]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => EMAIL_RE.test(e))
    .map((email) => ({ email }));
}

async function collectRecipients(audiences: Audience[], manualEmails: string): Promise<Recipient[]> {
  const out: Recipient[] = [];

  if (audiences.includes('all-buyers')) {
    const buyers = await User.find({ role: 'buyer' }).select('name email').lean();
    buyers.forEach((b) => b.email && out.push({ email: b.email, name: b.name }));
  } else if (audiences.includes('approved-buyers')) {
    const buyers = await User.find({ role: 'buyer', isApproved: true, isActive: true })
      .select('name email')
      .lean();
    buyers.forEach((b) => b.email && out.push({ email: b.email, name: b.name }));
  }

  if (audiences.includes('price-alert-subscribers')) {
    const subs = await PriceAlert.find({ isActive: true, email: { $ne: '' } })
      .select('name email')
      .lean();
    subs.forEach((s) => s.email && out.push({ email: s.email, name: s.name || undefined }));
  }

  out.push(...parseManual(manualEmails));
  return out;
}

// GET — recipient counts for each audience (for the UI preview)
export async function GET(req: NextRequest) {
  try {
    const admin = authenticateRequest(req);
    if (!admin || (admin.role !== 'admin' && admin.role !== 'editor')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();

    const [approved, all, subs] = await Promise.all([
      User.countDocuments({ role: 'buyer', isApproved: true, isActive: true }),
      User.countDocuments({ role: 'buyer' }),
      PriceAlert.countDocuments({ isActive: true, email: { $ne: '' } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        'approved-buyers': approved,
        'all-buyers': all,
        'price-alert-subscribers': subs,
      },
    });
  } catch (err) {
    console.error('GET bulk-email error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// POST — send a campaign
export async function POST(req: NextRequest) {
  try {
    const admin = authenticateRequest(req);
    if (!admin || (admin.role !== 'admin' && admin.role !== 'editor')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();

    const body = await req.json();
    const {
      audiences = [],
      manualEmails = '',
      subject,
      heading,
      bodyHtml,
      ctaLabel,
      ctaUrl,
    }: {
      audiences: Audience[];
      manualEmails: string;
      subject: string;
      heading: string;
      bodyHtml: string;
      ctaLabel?: string;
      ctaUrl?: string;
    } = body;

    if (!subject?.trim()) {
      return NextResponse.json({ success: false, error: 'Subject is required' }, { status: 400 });
    }
    if (!bodyHtml?.trim()) {
      return NextResponse.json({ success: false, error: 'Message body is required' }, { status: 400 });
    }
    if (!Array.isArray(audiences) || (audiences.length === 0 && !manualEmails.trim())) {
      return NextResponse.json({ success: false, error: 'Select at least one audience or add emails' }, { status: 400 });
    }

    const recipients = await collectRecipients(audiences, manualEmails);
    if (recipients.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid recipients found' }, { status: 400 });
    }

    const result = await sendBulkEmails(
      recipients,
      (r) => ({
        subject: subject.trim(),
        html: campaignEmail({
          heading: heading?.trim() || subject.trim(),
          bodyHtml,
          recipientName: r.name,
          ctaLabel: ctaLabel?.trim() || undefined,
          ctaUrl: ctaUrl?.trim() || undefined,
        }).html,
      }),
      { concurrency: 5, delayMs: 250 },
    );

    return NextResponse.json({
      success: true,
      message: `Campaign sent to ${result.sent} of ${result.total} recipient(s).${
        result.failed ? ` ${result.failed} failed.` : ''
      }`,
      ...result,
    });
  } catch (err) {
    console.error('POST bulk-email error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
