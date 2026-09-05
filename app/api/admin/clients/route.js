import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import CampaignAudit from '@/models/CampaignAudit';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'databaj-super-secret-jwt-key-2026';

export async function GET(request) {
  try {
    await connectToDatabase();

    const token = request.cookies.get('databaj_token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser || currentUser.role !== 'super_admin') {
      return NextResponse.json({ success: false, message: 'Super admin access required' }, { status: 403 });
    }

    // Fetch all client users
    const clients = await User.find({ role: 'client' }).select('-password').sort({ createdAt: -1 }).lean();

    // Aggregate statistics for each client
    const clientsWithStats = await Promise.all(
      clients.map(async (client) => {
        const campaigns = await CampaignAudit.find({ userId: client._id }).sort({ createdAt: -1 }).lean();
        const campaignCount = campaigns.length;
        const totalSpend = campaigns.reduce((acc, c) => acc + (c.adSpend || 0), 0);
        const avgScore = campaignCount > 0 ? Math.round(campaigns.reduce((acc, c) => acc + (c.overallScore || 0), 0) / campaignCount) : 0;
        const latestCampaign = campaigns[0] || null;

        return {
          ...client,
          campaignCount,
          totalSpend,
          avgScore,
          latestCampaign,
        };
      })
    );

    return NextResponse.json({
      success: true,
      clients: clientsWithStats,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await connectToDatabase();

    const token = request.cookies.get('databaj_token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser || currentUser.role !== 'super_admin') {
      return NextResponse.json({ success: false, message: 'Super admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { clientId, isVerified, status, role } = body;

    const update = {};
    if (status !== undefined) {
      update.status = status;
      if (status === 'active') update.isVerified = true;
      else if (status === 'pending_approval') update.isVerified = false;
    }
    if (isVerified !== undefined) {
      update.isVerified = isVerified;
      if (!update.status) update.status = isVerified ? 'active' : 'pending_approval';
    }
    if (role !== undefined) {
      update.role = role;
    }

    const client = await User.findByIdAndUpdate(clientId, { $set: update }, { new: true }).select('-password');
    if (!client) {
      return NextResponse.json({ success: false, message: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Client updated successfully',
      client,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();

    const token = request.cookies.get('databaj_token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser || currentUser.role !== 'super_admin') {
      return NextResponse.json({ success: false, message: 'Super admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('id');

    if (!clientId) {
      return NextResponse.json({ success: false, message: 'Client ID is required' }, { status: 400 });
    }

    await User.findByIdAndDelete(clientId);
    await CampaignAudit.deleteMany({ userId: clientId });

    return NextResponse.json({
      success: true,
      message: 'Client account and related data deleted successfully',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
