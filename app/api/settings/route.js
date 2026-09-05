import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'databaj-super-secret-jwt-key-2026';

function getSuperAdminFromRequest(request) {
  const token =
    request.cookies.get('databaj_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === 'super_admin') return decoded;
    return null;
  } catch {
    return null;
  }
}

const DEFAULT_SETTINGS = {
  key: 'main_settings',
  phone: '+880 1700-000000',
  whatsapp: '+880 1700-000000',
  email: 'contact@databaj.com',
  address: 'হাউজ #৪২, রোড #১১, বনানী, ঢাকা-১২১৩, বাংলাদেশ',
  workingHours: 'সকাল ৯:০০ - রাত ১০:০০ (শনি - বৃহঃ)',
  facebookUrl: 'https://facebook.com/databaj',
  linkedinUrl: 'https://linkedin.com/company/databaj',
};

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await SiteSettings.findOne({ key: 'main_settings' }).lean();

    if (!settings) {
      settings = await SiteSettings.create(DEFAULT_SETTINGS);
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  }
}

export async function PUT(request) {
  try {
    await connectToDatabase();
    const admin = getSuperAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'সুপার অ্যাডমিন অনুমতি প্রয়োজন' }, { status: 403 });
    }

    const body = await request.json();
    const { phone, whatsapp, email, address, workingHours, facebookUrl, linkedinUrl } = body;

    const settings = await SiteSettings.findOneAndUpdate(
      { key: 'main_settings' },
      {
        phone: phone ? phone.trim() : DEFAULT_SETTINGS.phone,
        whatsapp: whatsapp ? whatsapp.trim() : (phone ? phone.trim() : DEFAULT_SETTINGS.whatsapp),
        email: email ? email.trim() : DEFAULT_SETTINGS.email,
        address: address ? address.trim() : DEFAULT_SETTINGS.address,
        workingHours: workingHours ? workingHours.trim() : DEFAULT_SETTINGS.workingHours,
        facebookUrl: facebookUrl ? facebookUrl.trim() : '',
        linkedinUrl: linkedinUrl ? linkedinUrl.trim() : '',
      },
      { upsert: true, returnDocument: 'after', runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'সাইট সেটিংস ও যোগাযোগের তথ্য সফলভাবে সংরক্ষিত হয়েছে!',
      settings,
    });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
