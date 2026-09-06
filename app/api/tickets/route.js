import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
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
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');
    const ticketId = searchParams.get('ticketId');

    let query = {};
    if (authUser.role === 'super_admin') {
      if (clientId) query.userId = clientId;
      if (status && status !== 'all') query.status = status;
    } else {
      query.userId = authUser.userId;
      if (status && status !== 'all') query.status = status;
    }

    if (ticketId) {
      query._id = ticketId;
    }

    const tickets = await Ticket.find(query).sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    console.error('Tickets GET error:', error);
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
    const { action, id, subject, category, priority, message } = body;

    const userDoc = await User.findById(authUser.userId).select('name companyName email role');
    const senderName = userDoc?.name || authUser.name || (authUser.role === 'super_admin' ? 'Super Admin' : 'Client');
    const senderRole = authUser.role === 'super_admin' ? 'super_admin' : 'client';

    // 0. Typing signal handler
    if (action === 'typing') {
      if (!id) {
        return NextResponse.json({ success: false, message: 'টিকেট আইডি আবশ্যক' }, { status: 400 });
      }

      let filter = { _id: id };
      if (authUser.role !== 'super_admin') {
        filter.userId = authUser.userId;
      }

      // Valid for 4 seconds from now
      const expiresAt = new Date(Date.now() + 4000);
      const updateField =
        senderRole === 'super_admin'
          ? { adminTypingUntil: expiresAt }
          : { clientTypingUntil: expiresAt };

      await Ticket.findOneAndUpdate(filter, { $set: updateField });
      return NextResponse.json({ success: true });
    }

    // 1. Reply to existing ticket
    if (action === 'reply') {
      if (!id || !message?.trim()) {
        return NextResponse.json({ success: false, message: 'টিকেট আইডি ও মেসেজ আবশ্যক' }, { status: 400 });
      }

      let filter = { _id: id };
      if (authUser.role !== 'super_admin') {
        filter.userId = authUser.userId;
      }

      const ticket = await Ticket.findOne(filter);
      if (!ticket) {
        return NextResponse.json({ success: false, message: 'টিকেট খুঁজে পাওয়া যায়নি' }, { status: 404 });
      }

      ticket.messages.push({
        senderRole,
        senderName,
        message: message.trim(),
        createdAt: new Date(),
      });

      // Clear typing status on message send
      if (senderRole === 'super_admin') {
        ticket.adminTypingUntil = null;
        ticket.status = 'in_progress';
      } else {
        ticket.clientTypingUntil = null;
        if (ticket.status === 'resolved' || ticket.status === 'closed') {
          ticket.status = 'open';
        }
      }

      await ticket.save();
      return NextResponse.json({ success: true, message: 'মেসেজ পাঠানো হয়েছে', ticket });
    }

    // 2. Create new ticket
    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json({ success: false, message: 'বিষয় এবং বিস্তারিত বিবরণ আবশ্যক' }, { status: 400 });
    }

    const count = await Ticket.countDocuments();
    const ticketId = `TCK-${1000 + count + 1}`;

    const newTicket = await Ticket.create({
      ticketId,
      userId: authUser.userId,
      companyName: userDoc?.companyName || authUser.companyName || 'My Brand',
      userEmail: userDoc?.email || authUser.email || '',
      subject: subject.trim(),
      category: category || 'general',
      priority: priority || 'medium',
      status: 'open',
      messages: [
        {
          senderRole: 'client',
          senderName,
          message: message.trim(),
          createdAt: new Date(),
        },
      ],
    });

    return NextResponse.json({ success: true, message: 'সাপোর্ট টিকিট সফলভাবে খোলা হয়েছে', ticket: newTicket });
  } catch (error) {
    console.error('Tickets POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await connectToDatabase();
    const authUser = getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, message: 'অননুমোদিত এক্সেস' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'আইডি এবং স্ট্যাটাস আবশ্যক' }, { status: 400 });
    }

    let filter = { _id: id };
    if (authUser.role !== 'super_admin') {
      filter.userId = authUser.userId;
    }

    const ticket = await Ticket.findOneAndUpdate(
      filter,
      { status },
      { returnDocument: 'after' }
    );

    if (!ticket) {
      return NextResponse.json({ success: false, message: 'টিকেট খুঁজে পাওয়া যায়নি' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'টিকেটের স্ট্যাটাস আপডেট হয়েছে', ticket });
  } catch (error) {
    console.error('Tickets PATCH error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
