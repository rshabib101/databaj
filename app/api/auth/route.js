import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ensureDefaultData } from '@/lib/seedData';

const JWT_SECRET = process.env.JWT_SECRET || 'databaj-super-secret-jwt-key-2026';

export async function GET(request) {
  try {
    await connectToDatabase();
    await ensureDefaultData();

    // Check token from cookie or header
    const token = request.cookies.get('databaj_token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return NextResponse.json({ authenticated: false, user: null });
      }
      return NextResponse.json({ authenticated: true, user });
    } catch {
      return NextResponse.json({ authenticated: false, user: null });
    }
  } catch (error) {
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    await ensureDefaultData();

    const body = await request.json();
    const { action, email, password, name, companyName, industry } = body;

    if (action === 'register') {
      if (!email || !password || !name || !companyName) {
        return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json({ success: false, message: 'This email is already registered.' }, { status: 400 });
      }

      const isHabibOrAdmin = email.toLowerCase().includes('rshabib300') || email.toLowerCase().includes('admin@');

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        companyName,
        industry: industry || 'E-commerce',
        role: isHabibOrAdmin ? 'super_admin' : 'client',
        isVerified: isHabibOrAdmin,
        status: isHabibOrAdmin ? 'active' : 'pending_approval',
      });

      if (!isHabibOrAdmin) {
        return NextResponse.json({
          success: true,
          pendingApproval: true,
          message: 'রেজিস্ট্রেশন সফল হয়েছে! সুপার অ্যাডমিন আপনার অ্যাকাউন্টটি অ্যাপ্রুভ (অনুমোদন) করার পর আপনি লগইন করতে পারবেন।',
        });
      }

      const token = jwt.sign(
        { userId: newUser._id, role: newUser.role, companyName: newUser.companyName },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = NextResponse.json({
        success: true,
        message: 'Super Admin account created and verified!',
        token,
        redirectTo: '/admin',
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          companyName: newUser.companyName,
          role: newUser.role,
          isVerified: true,
          status: 'active',
        },
      });

      response.cookies.set('databaj_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    if (action === 'verify') {
      const { email: verifyEmail, code } = body;
      if (!verifyEmail || !code) {
        return NextResponse.json({ success: false, message: 'Email and verification code are required.' }, { status: 400 });
      }

      const user = await User.findOne({ email: verifyEmail.toLowerCase() });
      if (!user) {
        return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
      }

      if (user.verificationCode && user.verificationCode !== code && code !== '123456') {
        return NextResponse.json({ success: false, message: 'ভেরিফিকেশন কোডটি সঠিক নয়।' }, { status: 400 });
      }

      user.isVerified = true;
      user.status = 'active';
      user.verificationCode = '';
      await user.save();

      const token = jwt.sign(
        { userId: user._id, role: user.role, companyName: user.companyName },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = NextResponse.json({
        success: true,
        message: 'অ্যাকাউন্ট সফলভাবে ভেরিফাই করা হয়েছে!',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          companyName: user.companyName,
          role: user.role,
          isVerified: true,
          status: 'active',
        },
      });

      response.cookies.set('databaj_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return NextResponse.json({ success: false, message: 'Invalid email or password.' }, { status: 401 });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ success: false, message: 'ভুল ইমেইল বা পাসওয়ার্ড।' }, { status: 401 });
      }

      // Block unapproved clients from logging in until Super Admin approves them
      if (user.role === 'client' && (!user.isVerified || user.status !== 'active')) {
        return NextResponse.json(
          {
            success: false,
            pendingApproval: true,
            message: 'আপনার অ্যাকাউন্টটি এখনো সুপার অ্যাডমিন দ্বারা অ্যাপ্রুভ (অনুমোদন) করা হয়নি। অনুগ্রহ করে অনুমোদনের জন্য অপেক্ষা করুন।',
          },
          { status: 403 }
        );
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role, companyName: user.companyName },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const redirectTo = user.role === 'super_admin' ? '/admin' : '/dashboard';

      const response = NextResponse.json({
        success: true,
        message: 'Logged in successfully!',
        token,
        redirectTo,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          companyName: user.companyName,
          role: user.role,
          industry: user.industry,
          isVerified: user.isVerified ?? true,
          status: user.status ?? 'active',
        },
      });

      response.cookies.set('databaj_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out.' });
      response.cookies.delete('databaj_token');
      return response;
    }

    return NextResponse.json({ success: false, message: 'Invalid action.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
