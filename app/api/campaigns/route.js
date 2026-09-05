import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import CampaignAudit from '@/models/CampaignAudit';
import jwt from 'jsonwebtoken';
import { analyzeCampaign } from '@/lib/adScoringEngine';

const JWT_SECRET = process.env.JWT_SECRET || 'databaj-super-secret-jwt-key-2026';

function getUserFromRequest(request) {
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
    const tokenUser = getUserFromRequest(request);

    let dbUser = null;
    if (tokenUser) {
      dbUser = await User.findById(tokenUser.userId);
    }

    // If unauthenticated, show all recent campaigns
    if (!dbUser) {
      const campaigns = await CampaignAudit.find()
        .populate('userId', 'name email companyName industry')
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
      return NextResponse.json({
        success: true,
        campaigns,
        isSuperAdmin: false,
      });
    }

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('id');
    const clientId = searchParams.get('clientId');

    // Fetch single campaign
    if (campaignId) {
      const campaign = await CampaignAudit.findById(campaignId).populate('userId', 'name email companyName');
      if (!campaign) {
        return NextResponse.json({ success: false, message: 'Campaign not found' }, { status: 404 });
      }

      // Check permission: super_admin can see anything, client can only see their own
      if (dbUser.role !== 'super_admin' && campaign.userId._id.toString() !== dbUser._id.toString()) {
        return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
      }

      return NextResponse.json({ success: true, campaign });
    }

    let filter = {};

    if (dbUser.role === 'super_admin') {
      if (clientId) {
        filter = { userId: clientId };
      }
    } else {
      filter = { userId: dbUser._id };
    }

    const campaigns = await CampaignAudit.find(filter)
      .populate('userId', 'name email companyName industry')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      campaigns,
      isSuperAdmin: dbUser.role === 'super_admin',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const tokenUser = getUserFromRequest(request);

    let dbUser = null;
    if (tokenUser) {
      dbUser = await User.findById(tokenUser.userId);
    }

    // Fallback user: Habib's account or primary admin
    if (!dbUser) {
      dbUser = (await User.findOne({ email: 'rshabib300@gmail.com' })) ||
               (await User.findOne({ role: 'super_admin' })) ||
               (await User.findOne());
    }

    if (!dbUser) {
      return NextResponse.json({ success: false, message: 'No user account found in database' }, { status: 404 });
    }

    const body = await request.json();
    const {
      campaignName,
      objective,
      targetClientId,
      adminNotes,
    } = body;

    if (!campaignName) {
      return NextResponse.json({ success: false, message: 'Campaign name is required' }, { status: 400 });
    }

    let targetUser = dbUser;
    if (dbUser.role === 'super_admin' && targetClientId) {
      const client = await User.findById(targetClientId);
      if (client) targetUser = client;
    }

    // Run scoring engine
    const analysis = analyzeCampaign(body);

    const newCampaign = await CampaignAudit.create({
      userId: targetUser._id,
      companyName: targetUser.companyName,
      campaignName,
      objective: objective || 'conversions',
      ...analysis.metrics,
      ...analysis.scores,
      lackings: analysis.lackings,
      recommendations: analysis.recommendations,
      adminNotes: adminNotes || '',
    });

    return NextResponse.json({
      success: true,
      message: 'Campaign analyzed and saved successfully!',
      campaign: newCampaign,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await connectToDatabase();
    const tokenUser = getUserFromRequest(request);

    if (!tokenUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await User.findById(tokenUser.userId);
    if (!dbUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { campaignId, adminNotes } = body;

    if (!campaignId) {
      return NextResponse.json({ success: false, message: 'Campaign ID required' }, { status: 400 });
    }

    const campaign = await CampaignAudit.findById(campaignId);
    if (!campaign) {
      return NextResponse.json({ success: false, message: 'Campaign not found' }, { status: 404 });
    }

    // Only super_admin can edit adminNotes or company owner can update
    if (dbUser.role !== 'super_admin' && campaign.userId.toString() !== dbUser._id.toString()) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    if (adminNotes !== undefined) {
      campaign.adminNotes = adminNotes;
    }

    await campaign.save();

    return NextResponse.json({
      success: true,
      message: 'Campaign updated successfully',
      campaign,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();
    const tokenUser = getUserFromRequest(request);

    if (!tokenUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await User.findById(tokenUser.userId);
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('id');

    const campaign = await CampaignAudit.findById(campaignId);
    if (!campaign) {
      return NextResponse.json({ success: false, message: 'Campaign not found' }, { status: 404 });
    }

    if (dbUser.role !== 'super_admin' && campaign.userId.toString() !== dbUser._id.toString()) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    await CampaignAudit.findByIdAndDelete(campaignId);

    return NextResponse.json({ success: true, message: 'Campaign deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
