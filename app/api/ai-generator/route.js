import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { productName, targetAudience, offer, tone, platform } = body;

    if (!productName?.trim()) {
      return NextResponse.json({ success: false, message: 'প্রোডাক্ট বা সার্ভিসের নাম আবশ্যক' }, { status: 400 });
    }

    const prod = productName.trim();
    const audience = targetAudience?.trim() || 'অনলাইন ক্রেতা ও উদ্যোক্তা';
    const promo = offer?.trim() || 'সীমিত সময়ের বিশেষ অফার';
    const selectedTone = tone || 'persuasive'; // 'persuasive', 'urgent', 'story', 'casual'

    // Generate tailored 3-second hooks
    const hooks = [
      `😱 আপনি কি এখনো ${prod} ব্যবহার না করে বাড়তি টাকা অপচয় করছেন? মাত্র ৩ সেকেন্ড শুনুন!`,
      `🔥 ${audience}-দের জন্য এই বছরের সবচেয়ে বড় সারপ্রাইজ! মিস করলে পরে আফসোস করবেন।`,
      `🛑 থামুন! ${prod} কেনার আগে এই একটি গোপন ট্রিক না জানলে মারাত্মক ভুল করবেন!`,
      `💡 মাত্র ৭ দিনে আপনার ব্যবসার ফলাফল দ্বিগুণ করতে চান? এই দেখুন কীভাবে!`,
    ];

    // Generate high-converting primary ad copies
    const copies = [
      {
        type: 'হাই-কনভার্টিং ডিরেক্ট রেসপন্স (Direct Response)',
        text: `🚀 ${prod}-এর সাথে আপনার দৈনন্দিন অভিজ্ঞতা বদলে ফেলুন এখনই!\n\nআপনি যদি ${audience} হয়ে থাকেন, তবে এই সমাধানটি ঠিক আপনার জন্যই তৈরি করা হয়েছে। দৈনন্দিন ঝামেলা দূর করে সর্বোচ্চ মান নিশ্চিত করতে আমরা নিয়ে এসেছি প্রিমিয়াম কোয়ালিটি সমাধান।\n\n✨ কেন আমাদের বেছে নেবেন?\n✔️ ১০০% কোয়ালিটি গ্যারান্টি ও প্রিমিয়াম সাপোর্ট\n✔️ দ্রুততম ডেলিভারি ও সহজ রিটার্ন পলিসি\n✔️ হাজারো সন্তুষ্ট গ্রাহকের বিশ্বস্ত পছন্দ\n\n🎁 ধামাকা অফার: ${promo}!\n\n👇 স্টক ফুরিয়ে যাওয়ার আগেই নিচে দেওয়া বাটনে ক্লিক করে আজই অর্ডার কনফার্ম করুন!`,
      },
      {
        type: 'ইমোশনাল স্টোরিটেলিং (Storytelling & Pain-Point)',
        text: `কখনো কি ভেবে দেখেছেন, সঠিক ${prod} না পাওয়ার কারণে আপনার কতটা সময় ও টাকা নষ্ট হচ্ছে?\n\nআমরা জানি ${audience} হিসেবে আপনি সবসময় সেরাটাই খোঁজেন। আর সেই কারণেই আমরা তৈরি করেছি এমন একটি সলিউশন যা আপনার জীবনকে করবে আরও সহজ ও ঝামেলামুক্ত।\n\n🌟 আমাদের স্পেশাল ফিচারস:\n🔹 প্রমাণিত কোয়ালিটি ও ফলাফল\n🔹 ২৪/৭ ডেডিকেটেড সাপোর্ট\n🔹 বিশেষ ডিসকাউন্ট: ${promo}\n\n👉 আর দেরি না করে এখনই বুক করুন অথবা ইনবক্সে মেসেজ দিয়ে জেনে নিন বিস্তারিত!`,
      },
      {
        type: 'শর্ট & পাঞ্চি সোশ্যাল মিডিয়া (Short & Punchy)',
        text: `⚡ সেরা ${prod} এখন আপনার হাতের নাগালে!\n\n👉 স্পেশাল অফার: ${promo}!\n👉 ডেলিভারি হবে সারা দেশে দ্রুততম সময়ে।\n\nদেরি না করে এখনই 'Shop Now' বা 'Order Now' বাটনে ক্লিক করুন! 🛒`,
      },
    ];

    // Generate headlines
    const headlines = [
      `🔥 ${prod} - সীমিত সময়ের জন্য ${promo}`,
      `⚡ সেরা কোয়ালিটি ও ১০০% মান নিশ্চিত! অর্ডার করুন`,
      `⭐ ${audience}-দের প্রথম পছন্দ - আজই সংগ্রহ করুন`,
      `🚀 আপনার কাঙ্ক্ষিত ${prod} এখন অবিশ্বাস্য দামে!`,
      `🎁 স্টক সীমিত! এখনই অর্ডার করে উপভোগ করুন ${promo}`,
    ];

    // Generate targeting suggestions
    const targeting = [
      `🎯 প্রাইমারি অডিয়েন্স: ${audience} (বয়স: ১৮ - ৪৫)`,
      `📍 সম্ভাব্য ইন্টারেস্ট: E-commerce, Online Shopping, Digital Services, Technology`,
      `📱 প্লেসমেন্ট রিকমেন্ডেশন: Instagram Reels, Facebook Feed, Stories`,
      `⚡ বাজেট স্ট্র্যাটেজি: প্রথম ৩ দিন ABO (Ad Set Budget) দিয়ে ক্রিয়েটিভ টেস্ট করুন, তারপর সেরা হুকে স্কেল করুন।`,
    ];

    return NextResponse.json({
      success: true,
      data: {
        productName: prod,
        hooks,
        copies,
        headlines,
        targeting,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('AI Generator error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
