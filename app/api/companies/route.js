import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

const FALLBACK_COMPANIES = [
  {
    companyName: 'StyleEco Fashion',
    industry: 'Fashion & Apparel',
    logoUrl: '',
    rating: '5.0',
    growth: '+380% ROAS',
  },
  {
    companyName: 'GadgetZone BD',
    industry: 'Consumer Electronics',
    logoUrl: '',
    rating: '5.0',
    growth: '+420% Sales',
  },
  {
    companyName: 'PureOrganic Living',
    industry: 'Health & Organic Food',
    logoUrl: '',
    rating: '4.9',
    growth: '3.4x Scaled',
  },
  {
    companyName: 'GlowCraft Cosmetics',
    industry: 'Beauty & Skincare',
    logoUrl: '',
    rating: '5.0',
    growth: '+290% ROAS',
  },
  {
    companyName: 'LuxeLeather Atelier',
    industry: 'Leather & Accessories',
    logoUrl: '',
    rating: '4.9',
    growth: '4.2x Revenue',
  },
  {
    companyName: 'EduPro Learning Hub',
    industry: 'EdTech & Courses',
    logoUrl: '',
    rating: '5.0',
    growth: '+510% Leads',
  },
];

export async function GET() {
  try {
    await connectToDatabase();
    const dbCompanies = await User.find(
      { role: 'client', status: 'active' },
      'companyName industry logoUrl name createdAt'
    )
      .sort({ createdAt: -1 })
      .lean();

    const formattedDbCompanies = dbCompanies
      .filter((c) => c.companyName && c.companyName.trim().length > 0)
      .map((c) => ({
        companyName: c.companyName,
        industry: c.industry || 'E-commerce & Retail',
        logoUrl: c.logoUrl || '',
        verifiedClient: true,
      }));

    // Combine DB registered companies with fallback so there's always an impressive sliding ticker
    const combined = [
      ...formattedDbCompanies,
      ...FALLBACK_COMPANIES.filter(
        (fb) => !formattedDbCompanies.some((c) => c.companyName.toLowerCase() === fb.companyName.toLowerCase())
      ),
    ];

    return NextResponse.json({
      success: true,
      count: combined.length,
      companies: combined,
    });
  } catch (error) {
    console.error('Companies GET error:', error);
    return NextResponse.json({
      success: true,
      count: FALLBACK_COMPANIES.length,
      companies: FALLBACK_COMPANIES,
    });
  }
}
