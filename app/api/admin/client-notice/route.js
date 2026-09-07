import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ClientNotice from '@/models/ClientNotice';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'databaj-super-secret-jwt-key-2026';

function getSuperAdminFromRequest(request) {
  const token =
    request.cookies.get('databaj_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'super_admin') return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(request) {
  try {
    await connectToDatabase();
    const admin = getSuperAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Super admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json({ success: false, message: 'Client ID is required' }, { status: 400 });
    }

    // Fetch the most recent notice for this client
    const notice = await ClientNotice.findOne({ userId: clientId }).sort({ updatedAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      notice: notice || null,
    });
  } catch (error) {
    console.error('Admin ClientNotice GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const admin = getSuperAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Super admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { clientId, title, message, type, isActive, actionBtnText, actionBtnLink } = body;

    if (!clientId) {
      return NextResponse.json({ success: false, message: 'Client ID is required' }, { status: 400 });
    }

    // Check if client exists
    const client = await User.findById(clientId);
    if (!client) {
      return NextResponse.json({ success: false, message: 'Client not found' }, { status: 404 });
    }

    // Upsert or update the notice for this client
    let notice = await ClientNotice.findOne({ userId: clientId });

    if (notice) {
      if (title !== undefined) notice.title = title;
      if (message !== undefined) notice.message = message;
      if (type !== undefined) notice.type = type;
      if (isActive !== undefined) notice.isActive = isActive;
      if (actionBtnText !== undefined) notice.actionBtnText = actionBtnText;
      if (actionBtnLink !== undefined) notice.actionBtnLink = actionBtnLink;
      notice.createdBy = admin.userId;
      await notice.save();
    } else {
      notice = await ClientNotice.create({
        userId: clientId,
        title: title || 'জরুরি নোটিশ (Important Notice)',
        message: message || '',
        type: type || 'important',
        isActive: isActive !== undefined ? isActive : true,
        actionBtnText: actionBtnText || '',
        actionBtnLink: actionBtnLink || '',
        createdBy: admin.userId,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'নোটিশ সফলভাবে সংরক্ষণ করা হয়েছে',
      notice,
    });
  } catch (error) {
    console.error('Admin ClientNotice POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();
    const admin = getSuperAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Super admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json({ success: false, message: 'Client ID is required' }, { status: 400 });
    }

    await ClientNotice.deleteMany({ userId: clientId });

    return NextResponse.json({
      success: true,
      message: 'নোটিশ মুছে ফেলা হয়েছে',
    });
  } catch (error) {
    console.error('Admin ClientNotice DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
