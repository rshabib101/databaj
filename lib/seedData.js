import bcrypt from 'bcryptjs';
import User from '@/models/User';
import CampaignAudit from '@/models/CampaignAudit';
import Service from '@/models/Service';
import { analyzeCampaign } from '@/lib/adScoringEngine';

export async function ensureDefaultData() {
  // 1. Seed Services if none exist
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.create([
      {
        title: 'Web Development & Modern SaaS',
        slug: 'web-development',
        shortDescription: 'হাই-স্পিড Next.js, React ও ফুল-স্ট্যাক কাস্টম ওয়েব অ্যাপ্লিকেশন এবং ই-কমার্স সলিউশন।',
        fullDescription: 'আমরা আধুনিক আর্কিটেকচার দিয়ে স্কেলযোগ্য, নিরাপদ এবং এসইও-ফ্রেন্ডলি ওয়েব ডেভেলপমেন্ট সলিউশন সরবরাহ করি যা দ্রুত লোড হয় এবং ব্যবসা বৃদ্ধি করে।',
        icon: 'Code',
        badge: 'High Performance',
        features: [
          'Next.js 16 & React 19 আর্কিটেকচার',
          'কাস্টম ই-কমার্স প্ল্যাটফর্ম ও ড্যাশবোর্ড',
          'সুপারফাস্ট পেজ লোডিং স্পিড ও কোর ওয়েব ভাইটালস অপ্টিমাইজড',
          'রেসপন্সিভ মোবাইল-ফার্স্ট প্রিমিয়াম ডিজাইন',
        ],
        order: 1,
        isActive: true,
      },
      {
        title: 'Digital Marketing & Meta Ads',
        slug: 'digital-marketing',
        shortDescription: 'ডাটা-ড্রিভেন ফেসবুক, ইনস্টাগ্রাম ও গুগল অ্যাডস ক্যাম্পেইন স্কেলিং ও হাই ROAS জেনারেশন।',
        fullDescription: 'বিজ্ঞাপনের অপচয় রোধ করে লাভজনক বিজ্ঞাপনী স্ট্র্যাটেজি, উচ্চ কনভার্সন অ্যাড ক্রিয়েটিভ এবং অডিয়েন্স রিসার্চের মাধ্যমে সেলস বহুলাংশে বৃদ্ধি করি।',
        icon: 'TrendingUp',
        badge: 'High ROAS',
        features: [
          'উচ্চ ROAS মেটা (Facebook & Instagram) অ্যাডস ক্যাম্পেইন',
          'অ্যাড ক্রিয়েটিভ টেস্ট ও ৩-সেকেন্ড ভিডিও হুক স্ট্র্যাটেজি',
          'অডিয়েন্স স্যাচুরেশন ও অ্যাড ফ্যাটিগ প্রতিরোধ',
          'লাইভ পারফরম্যান্স রিপোর্টিং ও ক্যাম্পেইন অপ্টিমাইজেশন',
        ],
        order: 2,
        isActive: true,
      },
      {
        title: 'E-commerce Tracking & Server-Side CAPI',
        slug: 'ecommerce-tracking',
        shortDescription: 'সার্ভার-সাইড GTM, ফেসবুক কনভার্সন API (CAPI) এবং GA4 ই-কমার্স ট্র্যাকিং সেটাপ।',
        fullDescription: 'iOS 14+ এবং ব্রাউজার অ্যাড-ব্লকারের পর ১০০% সঠিক ই-কমার্স ট্র্যাকিং নিশ্চিত করতে সার্ভার-সাইড ক্লাউড ট্র্যাকিং ও ইভেন্ট ম্যাচ কোয়ালিটি অপ্টিমাইজ করি।',
        icon: 'Activity',
        badge: '100% Accuracy',
        features: [
          'সার্ভার-সাইড গুগল ট্যাগ ম্যানেজার (sGTM) ক্লাউড সেটআপ',
          'Facebook Conversion API (CAPI) 100% Event Match Quality',
          'Google Analytics 4 (GA4) ফুল ই-কমার্স ফানেল ট্র্যাকিং',
          'কাস্টম পিক্সেল ও ইভেন্ট ডিডুপ্লিকেশন (Deduplication)',
        ],
        order: 3,
        isActive: true,
      },
      {
        title: 'Meta Ads Performance Auditor',
        slug: 'ads-auditor',
        shortDescription: 'এআই ও বেঞ্চমার্ক অ্যানালাইসিস দিয়ে বিজ্ঞাপনের বাজেট লিক ও ল্যাকিং সনাক্তকরণ টুল।',
        fullDescription: 'আমাদের স্বয়ংক্রিয় অডিটর টুলের মাধ্যমে বিজ্ঞাপনের সকল মেট্রিক দিয়ে সহজেই কোথায় সমস্যা ও বাজেট লস হচ্ছে তা বের করে অ্যাকশনেবল সমাধান পান।',
        icon: 'BarChart3',
        badge: 'AI Diagnostic',
        features: [
          '০-১০০ স্কেলে অ্যাড হেলথ স্কোর ও ৪টি স্তম্ভের মূল্যায়ন',
          'স্বয়ংক্রিয় ল্যাকিং সনাক্তকরণ (Ad Fatigue, High CPM, Low CTR)',
          'স্টেপ-বাই-স্টেপ সমাধান ও গ্রোথ গাইডলাইন',
          'সুপার অ্যাডমিন ও মাল্টি-ক্লায়েন্ট ড্যাশবোর্ড সুবিধা',
        ],
        order: 4,
        isActive: true,
      },
    ]);
  }

  // 2. Seed Admin & Clients if none exist
  const adminExists = await User.findOne({ role: 'super_admin' });
  if (adminExists) {
    return;
  }

  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
  const hashedPasswordClient = await bcrypt.hash('client123', 10);

  // Super Admin: Shabib
  const adminUser = await User.create({
    name: 'Habib (Super Admin)',
    email: 'rshabib300@gmail.com',
    password: hashedPasswordAdmin,
    companyName: 'DataBaj IT Agency',
    role: 'super_admin',
    industry: 'IT & Digital Growth Agency',
    isVerified: true,
    status: 'active',
  });

  // Client 1: TrendWear BD
  const client1 = await User.create({
    name: 'Tanvir Rahman',
    email: 'tanvir@trendwear.com',
    password: hashedPasswordClient,
    companyName: 'TrendWear BD',
    role: 'client',
    industry: 'Fashion & Apparel',
    isVerified: true,
    status: 'active',
  });

  const c1_data1 = {
    adSpend: 350,
    impressions: 48000,
    reach: 39000,
    clicks: 1250,
    conversions: 62,
    revenue: 1470,
    videoHookRate: 36,
    qualityRanking: 'above_average',
  };
  const analysis1 = analyzeCampaign(c1_data1);
  await CampaignAudit.create({
    userId: client1._id,
    companyName: client1.companyName,
    campaignName: 'Summer Eid Mega Sale - UGC Video',
    objective: 'conversions',
    ...analysis1.metrics,
    ...analysis1.scores,
    lackings: analysis1.lackings,
    recommendations: analysis1.recommendations,
    adminNotes: 'অসাধারণ পারফরম্যান্স! বাজেট ২০% বাড়িয়ে স্কেল করা শুরু করুন।',
  });

  console.log('Default Seed Data Created Successfully');
}
