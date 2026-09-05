import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Consultation from '@/models/Consultation';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'databaj-super-secret-jwt-key-2026';

function getUserFromToken(request) {
  const token = request.cookies.get('databaj_token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
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
    const userPayload = getUserFromToken(request);

    if (!userPayload) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (userPayload.role === 'super_admin') {
      const consultations = await Consultation.find({}).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, consultations });
    }

    // Client: return only their own consultations (by userId or user's email)
    const consultations = await Consultation.find({
      $or: [{ userId: userPayload.userId }, { email: (userPayload.email || '').toLowerCase() }],
    })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, consultations });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const userPayload = getUserFromToken(request);

    const body = await request.json();
    let { clientName, email, companyName, phone, serviceSlug, serviceTitle, notes, budget } = body;

    // If logged in, fill details from DB if missing
    let userId = null;
    if (userPayload) {
      const dbUser = await User.findById(userPayload.userId);
      if (dbUser) {
        userId = dbUser._id;
        if (!clientName) clientName = dbUser.name;
        if (!email) email = dbUser.email;
        if (!companyName) companyName = dbUser.companyName;
      }
    }

    if (!clientName || !email || !serviceTitle) {
      return NextResponse.json(
        { success: false, message: 'নাম, ইমেইল এবং সার্ভিস তথ্য আবশ্যক।' },
        { status: 400 }
      );
    }

    const consultation = await Consultation.create({
      userId,
      clientName,
      email: email.toLowerCase(),
      companyName: companyName || 'Not specified',
      phone: phone || '',
      serviceSlug: serviceSlug || '',
      serviceTitle,
      notes: notes || '',
      budget: budget || 'Standard',
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: 'আপনার অর্ডার / কনসালটেশন রিকোয়েস্ট সফলভাবে জমা হয়েছে! আমাদের সিনিয়র স্পেশালিস্ট শীঘ্রই যোগাযোগ করবেন।',
      consultation,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await connectToDatabase();
    const userPayload = getUserFromToken(request);

    if (!userPayload || userPayload.role !== 'super_admin') {
      return NextResponse.json({ success: false, message: 'Super admin required' }, { status: 403 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'ID and status required' }, { status: 400 });
    }

    const updated = await Consultation.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json({ success: true, consultation: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
