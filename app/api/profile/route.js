import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

export async function GET(request) {
  try {
    await connectToDatabase();
    const tokenUser = getUserFromRequest(request);
    if (!tokenUser) {
      return NextResponse.json({ success: false, message: 'অননুমোদিত এক্সেস' }, { status: 401 });
    }

    const user = await User.findById(tokenUser.userId).select('-password').lean();
    if (!user) {
      return NextResponse.json({ success: false, message: 'ইউজার পাওয়া যায়নি' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectToDatabase();
    const tokenUser = getUserFromRequest(request);
    if (!tokenUser) {
      return NextResponse.json({ success: false, message: 'অননুমোদিত এক্সেস। অনুগ্রহ করে পুনরায় লগইন করুন।' }, { status: 401 });
    }

    const body = await request.json();
    const { name, companyName, phone, industry, logoUrl, avatarUrl, website, newPassword } = body;

    const user = await User.findById(tokenUser.userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'ইউজার প্রোফাইল পাওয়া যায়নি' }, { status: 404 });
    }

    if (name && name.trim()) user.name = name.trim();
    if (companyName && companyName.trim()) user.companyName = companyName.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (industry) user.industry = industry;
    if (logoUrl !== undefined) user.logoUrl = logoUrl.trim();
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl.trim();
    if (website !== undefined) user.website = website.trim();

    if (newPassword && newPassword.trim()) {
      if (newPassword.trim().length < 6) {
        return NextResponse.json({ success: false, message: 'নতুন পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।' }, { status: 400 });
      }
      user.password = await bcrypt.hash(newPassword.trim(), 10);
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password').lean();

    return NextResponse.json({
      success: true,
      message: 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে!',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile PUT error:', error);
    return NextResponse.json({ success: false, message: error.message || 'সার্ভারে সমস্যা হয়েছে' }, { status: 500 });
  }
}

export async function PATCH(request) {
  return PUT(request);
}
