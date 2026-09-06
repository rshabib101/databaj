import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ClientAd from '@/models/ClientAd';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'databaj-super-secret-jwt-key-2026';

function getUserFromRequest(request) {
  const token =
    request.cookies.get('databaj_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

const DEFAULT_AD = {
  key: 'active_client_ad',
  isActive: true,
  badge: '🔥 স্পেশাল অফার ও নতুন সার্ভিস',
  imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  headline: 'আপনার বিজনেসের জন্য মেটা কনভার্সন এপিআই (CAPI) ও সার্ভার-সাইড ট্র্যাকিং!',
  subHeadline: 'অ্যাড ব্লকার ও iOS ১৪ আপডেটের পরেও ১০০% নিখুঁত ডেটা ক্যাপচার করুন এবং বিজ্ঞাপনের আরওএএস (ROAS) বাড়ান।',
  offerPoints: [
    '১০০% ইভেন্ট ম্যাচ কোয়ালিটি গ্যারান্টি',
    'ক্লাউড সার্ভার ও স্ট্যাগিং সেটআপ',
    'ফ্রি ৭ দিনের লাইভ মনিটরিং ও অডিট',
    '২৪/৭ ডেডিকেটেড ইঞ্জিনিয়ার সাপোর্ট',
  ],
  orderBtnText: 'অর্ডার করতে ক্লিক করুন',
  orderBtnLink: '/#services',
  interests: [],
};

// GET: Fetch the current active ad (for both client & admin)
export async function GET(request) {
  try {
    await connectToDatabase();
    let ad = await ClientAd.findOne({ key: 'active_client_ad' }).lean();

    if (!ad) {
      ad = await ClientAd.create(DEFAULT_AD);
    }

    const user = getUserFromRequest(request);
    const isSuperAdmin = user?.role === 'super_admin';

    // If client requested and ad is not active, return inactive status
    if (!isSuperAdmin && !ad.isActive) {
      return NextResponse.json({ success: true, ad: null, isActive: false });
    }

    // Check if the current user already clicked interested
    let userHasInterested = false;
    if (user?.userId && ad.interests?.length > 0) {
      userHasInterested = ad.interests.some(
        (i) => i.userId?.toString() === user.userId || i.email === user.email
      );
    }

    return NextResponse.json({
      success: true,
      ad,
      userHasInterested,
      totalInterests: ad.interests?.length || 0,
    });
  } catch (error) {
    console.error('ClientAd GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Super Admin updates the ad (toggle on/off, change image, headline, offers, links)
export async function PUT(request) {
  try {
    await connectToDatabase();
    const user = getUserFromRequest(request);

    if (!user || user.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, message: 'সুপার অ্যাডমিন অনুমতি প্রয়োজন' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      isActive,
      badge,
      imageUrl,
      headline,
      subHeadline,
      offerPoints,
      orderBtnText,
      orderBtnLink,
    } = body;

    const updatedAd = await ClientAd.findOneAndUpdate(
      { key: 'active_client_ad' },
      {
        $set: {
          isActive: typeof isActive === 'boolean' ? isActive : true,
          badge: badge ? badge.trim() : DEFAULT_AD.badge,
          imageUrl: imageUrl ? imageUrl.trim() : DEFAULT_AD.imageUrl,
          headline: headline ? headline.trim() : DEFAULT_AD.headline,
          subHeadline: subHeadline ? subHeadline.trim() : DEFAULT_AD.subHeadline,
          offerPoints: Array.isArray(offerPoints)
            ? offerPoints.map((p) => String(p).trim()).filter(Boolean)
            : DEFAULT_AD.offerPoints,
          orderBtnText: orderBtnText ? orderBtnText.trim() : DEFAULT_AD.orderBtnText,
          orderBtnLink: orderBtnLink ? orderBtnLink.trim() : DEFAULT_AD.orderBtnLink,
        },
      },
      { upsert: true, returnDocument: 'after', runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'ক্লায়েন্ট ড্যাশবোর্ড বিজ্ঞাপন সফলভাবে আপডেট ও সংরক্ষিত হয়েছে!',
      ad: updatedAd,
    });
  } catch (error) {
    console.error('ClientAd PUT error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Client clicks "Interested" (Record interest with client details)
export async function POST(request) {
  try {
    await connectToDatabase();
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'লগইন করা আবশ্যক' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));

    const clientInfo = {
      userId: user.userId,
      clientName: body.clientName || user.name || 'Client',
      companyName: body.companyName || user.companyName || 'Unknown Company',
      email: body.email || user.email || '',
      phone: body.phone || user.phone || '',
      clickedAt: new Date(),
    };

    let ad = await ClientAd.findOne({ key: 'active_client_ad' });
    if (!ad) {
      ad = await ClientAd.create(DEFAULT_AD);
    }

    // Check if client already expressed interest
    const alreadyExists = ad.interests?.some(
      (i) => i.userId?.toString() === user.userId || (user.email && i.email === user.email)
    );

    if (!alreadyExists) {
      ad.interests.unshift(clientInfo);
      await ad.save();
    }

    return NextResponse.json({
      success: true,
      message: 'আপনার আগ্রহ সফলভাবে রেকর্ড করা হয়েছে! আমাদের টিম দ্রুত যোগাযোগ করবে।',
      userHasInterested: true,
    });
  } catch (error) {
    console.error('ClientAd POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
