import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Enquiry from '@/lib/models/Enquiry';
import { authenticateRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = authenticateRequest(req);
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).lean() as unknown as Array<Record<string, unknown>>;

    const headers = ['Name', 'Email', 'Phone', 'Company', 'Product', 'Quantity', 'Message', 'Responded', 'Date'];
    const rows = enquiries.map((e) => [
      e.name as string,
      e.email as string,
      e.phone as string,
      (e.companyName as string) || '',
      (e.productName as string) || '',
      (e.quantity as string) || '',
      `"${((e.message as string) || '').replace(/"/g, '""')}"`,
      e.isResponded ? 'Yes' : 'No',
      new Date(e.createdAt as string).toLocaleDateString(),
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=enquiries.csv',
      },
    });
  } catch (error) {
    console.error('Export enquiries error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
