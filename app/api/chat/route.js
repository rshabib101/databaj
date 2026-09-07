import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ChatMessage from '@/models/ChatMessage';
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
      return NextResponse.json({ success: false, message: 'অননুমোদিত অ্যাক্সেস' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const conversationId = searchParams.get('conversationId') || searchParams.get('clientId');

    // ----------------------------------------------------
    // SUPER ADMIN LOGIC
    // ----------------------------------------------------
    if (authUser.role === 'super_admin') {
      // 1. Return overall unread count across all clients
      if (action === 'unread_total') {
        const unreadCount = await ChatMessage.countDocuments({
          senderRole: 'client',
          isRead: false,
        });
        return NextResponse.json({ success: true, unreadCount });
      }

      // 2. Return list of all client conversations with latest snippet & unread count
      if (action === 'conversations') {
        const clients = await User.find({ role: 'client' })
          .select('name companyName email phone avatarUrl status isVerified createdAt')
          .lean();

        const conversations = await Promise.all(
          clients.map(async (client) => {
            const [lastMessage, unreadCount] = await Promise.all([
              ChatMessage.findOne({ conversationId: client._id }).sort({ createdAt: -1 }).lean(),
              ChatMessage.countDocuments({
                conversationId: client._id,
                senderRole: 'client',
                isRead: false,
              }),
            ]);

            return {
              client,
              lastMessage: lastMessage || null,
              unreadCount,
              lastActivity: lastMessage ? lastMessage.createdAt : client.createdAt,
            };
          })
        );

        // Sort by most recent activity
        conversations.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));

        return NextResponse.json({ success: true, conversations });
      }

      // 3. Return full message thread for a specific client
      if (conversationId) {
        const messages = await ChatMessage.find({ conversationId })
          .sort({ createdAt: 1 })
          .lean();

        // Mark incoming messages from client as read
        await ChatMessage.updateMany(
          { conversationId, senderRole: 'client', isRead: false },
          { $set: { isRead: true, readAt: new Date() } }
        );

        const clientInfo = await User.findById(conversationId)
          .select('name companyName email phone avatarUrl status')
          .lean();

        return NextResponse.json({ success: true, messages, client: clientInfo });
      }

      return NextResponse.json({ success: false, message: 'Invalid query' }, { status: 400 });
    }

    // ----------------------------------------------------
    // CLIENT LOGIC
    // ----------------------------------------------------
    const clientConversationId = authUser.userId;

    // 1. Client unread count check
    if (action === 'unread_count') {
      const unreadCount = await ChatMessage.countDocuments({
        conversationId: clientConversationId,
        senderRole: 'super_admin',
        isRead: false,
      });
      return NextResponse.json({ success: true, unreadCount });
    }

    // 2. Fetch full conversation messages for client
    const messages = await ChatMessage.find({ conversationId: clientConversationId })
      .sort({ createdAt: 1 })
      .lean();

    // Mark super_admin messages as read
    await ChatMessage.updateMany(
      { conversationId: clientConversationId, senderRole: 'super_admin', isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Chat GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const authUser = getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, message: 'অননুমোদিত অ্যাক্সেস' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, message, attachments = [] } = body;

    const trimmedMsg = (message || '').trim();
    if (!trimmedMsg && (!attachments || attachments.length === 0)) {
      return NextResponse.json(
        { success: false, message: 'মেসেজ অথবা কোনো ফাইল যুক্ত করুন' },
        { status: 400 }
      );
    }

    const currentUserDoc = await User.findById(authUser.userId).select('name companyName role').lean();
    const isSuperAdmin = authUser.role === 'super_admin';

    let targetConvId;
    let senderRole;
    let senderName;
    let recipientId = null;

    if (isSuperAdmin) {
      if (!conversationId) {
        return NextResponse.json({ success: false, message: 'Client conversation ID is required' }, { status: 400 });
      }
      targetConvId = conversationId;
      senderRole = 'super_admin';
      senderName = currentUserDoc?.name || 'DataBaj Super Admin';
      recipientId = conversationId;
    } else {
      targetConvId = authUser.userId;
      senderRole = 'client';
      senderName = currentUserDoc?.name || currentUserDoc?.companyName || 'Client';
    }

    const newChatMessage = await ChatMessage.create({
      conversationId: targetConvId,
      senderId: authUser.userId,
      senderRole,
      senderName,
      recipientId,
      message: trimmedMsg,
      attachments: Array.isArray(attachments) ? attachments : [],
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      message: 'মেসেজ সফলভাবে প্রেরিত হয়েছে',
      chatMessage: newChatMessage,
    });
  } catch (error) {
    console.error('Chat POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
