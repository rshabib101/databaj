import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import CampaignAudit from '@/models/CampaignAudit';

export async function GET() {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    return NextResponse.json(
      {
        success: false,
        status: 'unconfigured',
        message: 'MONGODB_URI is not configured in .env.local',
      },
      { status: 200 }
    );
  }

  try {
    const conn = await connectToDatabase();
    const readyState = conn.connection.readyState;
    const dbName = conn.connection.name || 'databaj';
    const host = conn.connection.host || 'databaj.jq2wwa1.mongodb.net';

    const [usersCount, campaignsCount, recentUsers, recentCampaigns] = await Promise.all([
      User.countDocuments(),
      CampaignAudit.countDocuments(),
      User.find().select('name email companyName role isVerified createdAt').sort({ createdAt: -1 }).limit(10).lean(),
      CampaignAudit.find().select('campaignName companyName overallScore roas adSpend createdAt').sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    return NextResponse.json({
      success: true,
      status: 'connected',
      connectionState: readyState === 1 ? 'Connected' : 'Connecting',
      clusterHost: host,
      databaseName: dbName,
      stats: {
        usersCount,
        campaignsCount,
      },
      recentUsers,
      recentCampaigns,
      atlasPath: `Atlas Cluster > Database > Browse Collections > ${dbName}`,
      message: 'MongoDB Atlas-এর সাথে সফলভাবে সংযুক্ত রয়েছে এবং ডেটা রিয়েলটাইমে সিঙ্ক হচ্ছে।',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        status: 'error',
        message: error.message || 'Failed to connect to MongoDB',
      },
      { status: 500 }
    );
  }
}
