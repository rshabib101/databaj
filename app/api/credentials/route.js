import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Credential from '@/models/Credential';
import User from '@/models/User';
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

export async function GET(request) {
  try {
    await connectToDatabase();
    const authUser = getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, message: 'অননুমোদিত এক্সেস' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    let query = {};
    if (authUser.role === 'super_admin') {
      if (clientId) {
        query.userId = clientId;
      }
    } else {
      query.userId = authUser.userId;
    }

    const credentials = await Credential.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, credentials });
  } catch (error) {
    console.error('Credentials GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const authUser = getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, message: 'অননুমোদিত এক্সেস' }, { status: 401 });
    }

    const body = await request.json();
    const { platform, title, accountUrl, username, password, twoFactorInstructions, notes } = body;

    if (!title || !username || !password) {
      return NextResponse.json({ success: false, message: 'শিরোনাম, ইউজারনেম এবং পাসওয়ার্ড আবশ্যক' }, { status: 400 });
    }

    const userDoc = await User.findById(authUser.userId).select('companyName name');

    const credential = await Credential.create({
      userId: authUser.userId,
      companyName: userDoc?.companyName || authUser.companyName || 'Unknown Company',
      platform: platform || 'website_admin',
      title: title.trim(),
      accountUrl: accountUrl ? accountUrl.trim() : '',
      username: username.trim(),
      password: password.trim(),
      twoFactorInstructions: twoFactorInstructions ? twoFactorInstructions.trim() : '',
      notes: notes ? notes.trim() : '',
    });

    return NextResponse.json({ success: true, message: 'ক্রেডেনশিয়াল সফলভাবে সংরক্ষিত হয়েছে', credential });
  } catch (error) {
    console.error('Credentials POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectToDatabase();
    const authUser = getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, message: 'অননুমোদিত এক্সেস' }, { status: 401 });
    }

    const body = await request.json();
    const { id, platform, title, accountUrl, username, password, twoFactorInstructions, notes } = body;

    if (!id || !title || !username || !password) {
      return NextResponse.json({ success: false, message: 'আইডি, শিরোনাম, ইউজারনেম ও পাসওয়ার্ড আবশ্যক' }, { status: 400 });
    }

    let filter = { _id: id };
    if (authUser.role !== 'super_admin') {
      filter.userId = authUser.userId;
    }

    const updated = await Credential.findOneAndUpdate(
      filter,
      {
        platform,
        title: title.trim(),
        accountUrl: accountUrl ? accountUrl.trim() : '',
        username: username.trim(),
        password: password.trim(),
        twoFactorInstructions: twoFactorInstructions ? twoFactorInstructions.trim() : '',
        notes: notes ? notes.trim() : '',
      },
      { returnDocument: 'after' }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'ক্রেডেনশিয়াল খুঁজে পাওয়া যায়নি' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'ক্রেডেনশিয়াল সফলভাবে আপডেট হয়েছে', credential: updated });
  } catch (error) {
    console.error('Credentials PUT error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();
    const authUser = getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, message: 'অননুমোদিত এক্সেস' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'আইডি প্রয়োজন' }, { status: 400 });
    }

    let filter = { _id: id };
    if (authUser.role !== 'super_admin') {
      filter.userId = authUser.userId;
    }

    const deleted = await Credential.findOneAndDelete(filter);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'ক্রেডেনশিয়াল খুঁজে পাওয়া যায়নি' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'ক্রেডেনশিয়াল সফলভাবে ডিলিট হয়েছে' });
  } catch (error) {
    console.error('Credentials DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
