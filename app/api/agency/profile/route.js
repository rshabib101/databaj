import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import AgencyProfile from '@/models/AgencyProfile';
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

const DEFAULT_PROFILE = {
  key: 'main_profile',
  founderName: 'রাশেদুল হাবিব',
  founderRole: 'Founder & CEO, DataBaj IT',
  founderImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  badge: 'LEADERSHIP & VISION',
  founderQuote: 'আমাদের মূল লক্ষ্য কেবল ক্যাম্পেইন বা ওয়েবসাইট তৈরি নয়—ক্লায়েন্টের বিজ্ঞাপনের বাজেট অপচয় বন্ধ করে রিয়েল প্রফিটেবল স্কেলে নিয়ে যাওয়া।',
  founderBio: '৭+ বছর ধরে ডেটা অ্যানালিটিক্স, ফেসবুক অ্যাড স্কেলিং ও হাই-পারফরম্যান্স ওয়েব ডেভেলপমেন্টে অগাধ অভিজ্ঞতা নিয়ে DataBaj-এর মাধ্যমে আমরা দেশ-বিদেশের ই-কমার্স এবং এসএমই ব্র্যান্ডগুলোকে শতভাগ ট্র্যাকড ও লাভজনক রূপ দিচ্ছি।',
  experienceYears: '৭+ বছর',
  stats: [
    { label: 'সন্তুষ্ট ক্লায়েন্ট', value: '১৫০+' },
    { label: 'সফল ক্যাম্পেইন ও প্রজেক্ট', value: '৩৫০+' },
    { label: 'অ্যাভারেজ আরওএএস (ROAS)', value: '৪.৮x' },
    { label: 'ডেটা ও ট্র্যাকিং অ্যাকুরেসি', value: '৯৯.৪%' },
  ],
  socials: {
    linkedin: 'https://linkedin.com',
    facebook: 'https://facebook.com',
    twitter: '',
    email: 'ceo@databaj.com',
  },
};

export async function GET() {
  try {
    await connectToDatabase();
    let profile = await AgencyProfile.findOne({ key: 'main_profile' }).lean();

    if (!profile) {
      profile = await AgencyProfile.create(DEFAULT_PROFILE);
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Agency profile GET error:', error);
    return NextResponse.json({ success: true, profile: DEFAULT_PROFILE });
  }
}

export async function PUT(request) {
  try {
    await connectToDatabase();
    const admin = getSuperAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Super admin authorization required' }, { status: 403 });
    }

    const body = await request.json();
    const {
      founderName,
      founderRole,
      founderImage,
      badge,
      founderQuote,
      founderBio,
      experienceYears,
      stats,
      socials,
    } = body;

    const profile = await AgencyProfile.findOneAndUpdate(
      { key: 'main_profile' },
      {
        founderName,
        founderRole,
        founderImage,
        badge,
        founderQuote,
        founderBio,
        experienceYears,
        stats: Array.isArray(stats) ? stats : [],
        socials: socials || {},
      },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'ফাউন্ডার ও এজেন্সি প্রোফাইল সফলভাবে আপডেট হয়েছে',
      profile,
    });
  } catch (error) {
    console.error('Agency profile PUT error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
