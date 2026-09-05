import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
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

// GET: Current Admin Profile
export async function GET(request) {
  try {
    await connectToDatabase();
    const tokenUser = getUserFromRequest(request);
    if (!tokenUser || tokenUser.role !== 'super_admin') {
      return NextResponse.json({ success: false, message: 'অননুমোদিত এক্সেস' }, { status: 401 });
    }

    const admin = await User.findById(tokenUser.userId).select('-password').lean();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'অ্যাডমিন অ্যাকাউন্ট পাওয়া যায়নি' }, { status: 404 });
    }

    return NextResponse.json({ success: true, admin });
  } catch (error) {
    console.error('Admin Profile GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT: Update Admin Email & Password
export async function PUT(request) {
  try {
    await connectToDatabase();
    const tokenUser = getUserFromRequest(request);
    if (!tokenUser || tokenUser.role !== 'super_admin') {
      return NextResponse.json({ success: false, message: 'অননুমোদিত এক্সেস' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, newPassword, confirmPassword } = body;

    const admin = await User.findById(tokenUser.userId);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'অ্যাডমিন অ্যাকাউন্ট পাওয়া যায়নি' }, { status: 404 });
    }

    // 1. Email update validation
    if (email) {
      const cleanEmail = email.toLowerCase().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return NextResponse.json({ success: false, message: 'সঠিক ইমেইল বা জিমেইল অ্যাড্রেস প্রদান করুন।' }, { status: 400 });
      }

      // Check if email already taken by someone else
      const existingUser = await User.findOne({
        email: cleanEmail,
        _id: { $ne: admin._id },
      });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'এই জিমেইল/ইমেইল অ্যাড্রেসটি দিয়ে ইতোমধ্যে অন্য একটি অ্যাকাউন্ট তৈরি করা আছে।' },
          { status: 400 }
        );
      }

      admin.email = cleanEmail;
    }

    // 2. Name update
    if (name && name.trim()) {
      admin.name = name.trim();
    }

    // 3. Password update validation
    if (newPassword && newPassword.trim()) {
      const trimmedPass = newPassword.trim();
      if (trimmedPass.length < 6) {
        return NextResponse.json(
          { success: false, message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' },
          { status: 400 }
        );
      }

      if (confirmPassword && trimmedPass !== confirmPassword.trim()) {
        return NextResponse.json(
          { success: false, message: 'নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না।' },
          { status: 400 }
        );
      }

      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(trimmedPass, salt);
    }

    await admin.save();

    // 4. Generate new fresh JWT token with updated email & credentials
    const newToken = jwt.sign(
      { userId: admin._id, role: admin.role, companyName: admin.companyName, email: admin.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const updatedAdmin = await User.findById(admin._id).select('-password').lean();

    const response = NextResponse.json({
      success: true,
      message: 'সুপার অ্যাডমিন জিমেইল ও সিকিউরিটি তথ্য সফলভাবে আপডেট হয়েছে!',
      token: newToken,
      admin: updatedAdmin,
    });

    response.cookies.set('databaj_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Admin Profile PUT error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
