import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ClientTask from '@/models/ClientTask';
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
    const taskType = searchParams.get('taskType');
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');

    let query = {};
    if (authUser.role === 'super_admin') {
      if (clientId && clientId !== 'all') query.userId = clientId;
      if (taskType && taskType !== 'all') query.taskType = taskType;
      if (status && status !== 'all') query.status = status;
    } else {
      query.userId = authUser.userId;
      if (taskType && taskType !== 'all') query.taskType = taskType;
      if (status && status !== 'all') query.status = status;
    }

    const tasks = await ClientTask.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error('Client Tasks GET error:', error);
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
    const {
      taskType,
      webLink,
      postLink,
      variationPostLink,
      videoDuration,
      comment,
      title,
      description,
      priority,
    } = body;

    const userDoc = await User.findById(authUser.userId).select('companyName name');
    const companyName = userDoc?.companyName || authUser.companyName || 'My Brand';

    const newTask = await ClientTask.create({
      userId: authUser.userId,
      companyName,
      taskType: taskType || 'ads',
      webLink: webLink ? webLink.trim() : '',
      postLink: postLink ? postLink.trim() : '',
      variationPostLink: variationPostLink ? variationPostLink.trim() : '',
      videoDuration: videoDuration ? videoDuration.trim() : '',
      comment: comment ? comment.trim() : '',
      title: title ? title.trim() : '',
      description: description ? description.trim() : '',
      priority: priority || 'normal',
      status: 'pending', // default pending
    });

    return NextResponse.json({ success: true, message: 'টাস্ক সফলভাবে তৈরি হয়েছে', task: newTask });
  } catch (error) {
    console.error('Client Tasks POST error:', error);
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

    // ONLY Super Admin can change task status
    if (authUser.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, message: 'শুধুমাত্র সুপার অ্যাডমিন স্ট্যাটাস পরিবর্তন করতে পারবেন' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, status, adminFeedback } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'আইডি ও স্ট্যাটাস আবশ্যক' }, { status: 400 });
    }

    const updated = await ClientTask.findByIdAndUpdate(
      id,
      {
        status,
        ...(adminFeedback !== undefined ? { adminFeedback: adminFeedback.trim() } : {}),
      },
      { returnDocument: 'after' }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'টাস্ক খুঁজে পাওয়া যায়নি' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'টাস্কের স্ট্যাটাস সফলভাবে আপডেট হয়েছে', task: updated });
  } catch (error) {
    console.error('Client Tasks PATCH error:', error);
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

    const deleted = await ClientTask.findOneAndDelete(filter);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'টাস্ক খুঁজে পাওয়া যায়নি' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'টাস্ক মুছে ফেলা হয়েছে' });
  } catch (error) {
    console.error('Client Tasks DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
