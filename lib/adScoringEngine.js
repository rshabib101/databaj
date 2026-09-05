/**
 * Facebook Ads Performance Audit & Scoring Engine
 * Analyzes campaign metrics against industry benchmarks and generates
 * health scores (0-100), funnel bottlenecks, lackings, and actionable recommendations.
 */

export function analyzeCampaign(data) {
  const adSpend = Math.max(0, Number(data.adSpend) || 0);
  const impressions = Math.max(0, Number(data.impressions) || 0);
  const reach = Math.max(0, Number(data.reach) || (impressions > 0 ? Math.round(impressions * 0.8) : 0));
  const clicks = Math.max(0, Number(data.clicks) || 0);
  const conversions = Math.max(0, Number(data.conversions) || 0);
  const revenue = Math.max(0, Number(data.revenue) || 0);
  const videoHookRate = data.videoHookRate !== undefined && data.videoHookRate !== '' ? Number(data.videoHookRate) : null;
  const qualityRanking = data.qualityRanking || 'average';

  // Derived Metrics with zero-safe math
  const frequency = Number(data.frequency) || (reach > 0 ? Number((impressions / reach).toFixed(2)) : 1.0);
  const cpm = Number(data.cpm) || (impressions > 0 ? Number(((adSpend / impressions) * 1000).toFixed(2)) : 0);
  const ctr = Number(data.ctr) || (impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0);
  const cpc = Number(data.cpc) || (clicks > 0 ? Number((adSpend / clicks).toFixed(2)) : 0);
  const cvr = Number(data.cvr) || (clicks > 0 ? Number(((conversions / clicks) * 100).toFixed(2)) : 0);
  const cpa = Number(data.cpa) || (conversions > 0 ? Number((adSpend / conversions).toFixed(2)) : 0);
  const roas = Number(data.roas) || (adSpend > 0 ? Number((revenue / adSpend).toFixed(2)) : 0);

  // 1. Creative & Hook Score (Max: 25)
  let creativeScore = 0;
  if (videoHookRate !== null) {
    // CTR part (max 15)
    if (ctr >= 2.5) creativeScore += 15;
    else if (ctr >= 1.8) creativeScore += 12;
    else if (ctr >= 1.2) creativeScore += 9;
    else if (ctr >= 0.8) creativeScore += 6;
    else creativeScore += 3;

    // Video Hook Rate part (max 10)
    if (videoHookRate >= 35) creativeScore += 10;
    else if (videoHookRate >= 25) creativeScore += 8;
    else if (videoHookRate >= 18) creativeScore += 5;
    else creativeScore += 2;
  } else {
    // Pure CTR scaling (max 25)
    if (ctr >= 2.5) creativeScore = 25;
    else if (ctr >= 1.8) creativeScore = 21;
    else if (ctr >= 1.2) creativeScore = 16;
    else if (ctr >= 0.8) creativeScore = 11;
    else creativeScore = 5;
  }

  // 2. Cost Efficiency Score (Max: 25)
  let costScore = 0;
  // CPM evaluation (max 10)
  if (cpm <= 6) costScore += 10;
  else if (cpm <= 12) costScore += 8;
  else if (cpm <= 20) costScore += 5;
  else costScore += 2;

  // CPC evaluation (max 8)
  if (cpc <= 0.25) costScore += 8;
  else if (cpc <= 0.50) costScore += 6;
  else if (cpc <= 1.00) costScore += 4;
  else costScore += 2;

  // Frequency evaluation (max 7)
  if (frequency <= 2.2) costScore += 7;
  else if (frequency <= 3.2) costScore += 5;
  else costScore += 2;

  // 3. Conversion & Funnel Score (Max: 30)
  let conversionScore = 0;
  // CVR (max 18)
  if (cvr >= 4.0) conversionScore += 18;
  else if (cvr >= 2.8) conversionScore += 14;
  else if (cvr >= 1.8) conversionScore += 10;
  else if (cvr >= 1.0) conversionScore += 6;
  else conversionScore += 2;

  // Conversion Volume & Acquisition efficiency (max 12)
  if (conversions > 30) conversionScore += 12;
  else if (conversions > 15) conversionScore += 9;
  else if (conversions > 5) conversionScore += 6;
  else if (conversions > 0) conversionScore += 4;
  else conversionScore += 0;

  // 4. ROAS & Profitability Score (Max: 20)
  let roasScore = 0;
  if (roas >= 4.0) roasScore = 20;
  else if (roas >= 3.0) roasScore = 17;
  else if (roas >= 2.2) roasScore = 14;
  else if (roas >= 1.5) roasScore = 9;
  else if (roas >= 1.0) roasScore = 5;
  else roasScore = 2;

  const overallScore = Math.min(100, Math.round(creativeScore + costScore + conversionScore + roasScore));

  let grade = 'Needs Attention';
  let gradeColor = 'text-amber-400';
  let badgeBg = 'bg-amber-500/10 border-amber-500/30 text-amber-400';

  if (overallScore >= 85) {
    grade = 'Excellent (স্কেল করার জন্য আদর্শ)';
    gradeColor = 'text-emerald-400';
    badgeBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
  } else if (overallScore >= 70) {
    grade = 'Good (ভালো পারফরম্যান্স)';
    gradeColor = 'text-blue-400';
    badgeBg = 'bg-blue-500/10 border-blue-500/30 text-blue-400';
  } else if (overallScore >= 50) {
    grade = 'Average (অপ্টিমাইজেশন প্রয়োজন)';
    gradeColor = 'text-amber-400';
    badgeBg = 'bg-amber-500/10 border-amber-500/30 text-amber-400';
  } else {
    grade = 'Critical / Poor (বাজেট নষ্ট হচ্ছে, দ্রুত রি-স্ট্রাকচার দরকার)';
    gradeColor = 'text-rose-400';
    badgeBg = 'bg-rose-500/10 border-rose-500/30 text-rose-400';
  }

  // --- LACKINGS (কোথায় সমস্যা বা ঘাটতি) ---
  const lackings = [];

  // Lacking 1: Low CTR
  if (ctr < 1.0) {
    lackings.push({
      metric: 'CTR (Click-Through Rate)',
      value: `${ctr}%`,
      benchmark: '> 1.5%',
      severity: 'high',
      title: 'দুর্বল ক্রিয়েটিভ ও ক্লিক ড্রপ (Low CTR)',
      description: 'আপনার অ্যাডের থাম্বনেইল, প্রাথমিক ৩ সেকেন্ড বা হেডলাইন কাস্টমারকে আকর্ষণ করতে পারছে না। ফলে প্রতি ক্লিকে বেশি খরচ হচ্ছে।',
      category: 'creative',
    });
  }

  // Lacking 2: High Frequency (Ad Fatigue)
  if (frequency > 3.0) {
    lackings.push({
      metric: 'Frequency',
      value: `${frequency}x`,
      benchmark: '< 2.5x (Cold)',
      severity: frequency > 4.0 ? 'high' : 'medium',
      title: 'অ্যাড ফ্যাটিগ বা অডিয়েন্স স্যাচুরেশন (Ad Fatigue)',
      description: 'একই দর্শক বারবার একই বিজ্ঞাপন দেখছেন। এর ফলে কাস্টমাররা অ্যাড এড়িয়ে যাচ্ছে এবং কনভার্সন কমে CPM বৃদ্ধি পাচ্ছে।',
      category: 'audience',
    });
  }

  // Lacking 3: Landing Page / Offer Friction
  if (ctr >= 1.5 && cvr < 1.5 && clicks >= 20) {
    lackings.push({
      metric: 'Conversion Rate (CVR)',
      value: `${cvr}%`,
      benchmark: '> 2.5% - 4%',
      severity: 'high',
      title: 'ল্যান্ডিং পেজ ফ্রিকশন বা অফার মিসম্যাচ (Landing Page Drop)',
      description: 'অ্যাডে প্রচুর মানুষ ক্লিক করছে কিন্তু ওয়েবসাইটে গিয়ে কিনছে না। ওয়েবসাইট লোডিং স্পিড ধীরগতির হতে পারে, অফার পরিষ্কার নয় অথবা চেকআউট প্রসেস জটিল।',
      category: 'funnel',
    });
  }

  // Lacking 4: High CPM
  if (cpm > 18) {
    lackings.push({
      metric: 'CPM (Cost Per Mille)',
      value: `$${cpm}`,
      benchmark: '< $10 - $14',
      severity: cpm > 25 ? 'high' : 'medium',
      title: 'অস্বাভাবিক বেশি বিজ্ঞাপন প্রদর্শনী খরচ (High CPM)',
      description: 'টার্গেটেড অডিয়েন্স খুব ছোট বা একই অডিয়েন্সে একাধিক অ্যাড সেট নিজেদের মধ্যে প্রতিযোগিতা (Audience Overlap) করছে।',
      category: 'budget',
    });
  }

  // Lacking 5: Low ROAS / Loss-making
  if (roas > 0 && roas < 1.8) {
    lackings.push({
      metric: 'ROAS (Return on Ad Spend)',
      value: `${roas}x`,
      benchmark: '> 2.5x - 3.5x',
      severity: roas < 1.2 ? 'high' : 'medium',
      title: 'মুনাফাহীন ক্যাম্পেইন (Low ROAS)',
      description: 'বিজ্ঞাপনের খরচ অনুযায়ী পর্যাপ্ত সেলস বা রেভিনিউ আসছে না। প্রোডাক্ট মার্জিন ও অ্যাভারেজ অর্ডার ভ্যালু (AOV) বাড়ানো জরুরি।',
      category: 'profitability',
    });
  }

  // Lacking 6: Video Hook Rate
  if (videoHookRate !== null && videoHookRate < 22) {
    lackings.push({
      metric: '3-Sec Hook Rate',
      value: `${videoHookRate}%`,
      benchmark: '> 30%',
      severity: 'medium',
      title: 'ভিডিওর প্রথম ৩ সেকেন্ডে দর্শক হারানো (Weak Hook)',
      description: 'ভিডিওর শুরুতে কোনো স্ট্রং ভিজ্যুয়াল বা সমস্যা কেন্দ্রিক হুক নেই। দর্শকরা প্রথম ৩ সেকেন্ডেই স্ক্রল করে চলে যাচ্ছে।',
      category: 'creative',
    });
  }

  // If no critical lackings
  if (lackings.length === 0) {
    lackings.push({
      metric: 'Overall Health',
      value: `${overallScore}/100`,
      benchmark: 'Target: >75',
      severity: 'low',
      title: 'ক্যাম্পেইন সন্তোষজনক স্তরে রয়েছে',
      description: 'মেট্রিকগুলোতে কোনো বড় ধরনের অসঙ্গতি নেই। আরও ভালো ফলাফলের জন্য বাজেট স্কেলিং ও ক্রিয়েটিভ টেস্ট চালিয়ে যান।',
      category: 'scaling',
    });
  }

  // --- ACTIONABLE RECOMMENDATIONS (কী কী ইমপ্রুভমেন্ট দরকার) ---
  const recommendations = [];

  if (ctr < 1.2) {
    recommendations.push({
      priority: 'Urgent',
      area: 'Creative & Copywriting',
      action: '৩টি নতুন ভেরিয়েশনের অ্যাড ক্রিয়েটিভ (UGC Video, Carousel, High-Contrast Image) এবং নতুন হুক দিয়ে টেস্ট করুন। হেডলাইনে অফার স্পষ্ট করুন।',
    });
  }

  if (frequency > 2.8) {
    recommendations.push({
      priority: 'High',
      area: 'Audience & Targeting',
      action: 'টার্গেটিং অডিয়েন্স ব্রড (Broad Targeting) করুন, ৩-৫% Lookalike অডিয়েন্স টেস্ট করুন অথবা গত ৩০ দিনে যারা পারচেজ করেছে তাদের Exclude করুন।',
    });
  }

  if (ctr >= 1.5 && cvr < 1.8) {
    recommendations.push({
      priority: 'Urgent',
      area: 'Conversion Rate Optimization (CRO)',
      action: 'ওয়েবসাইট মোবাইল স্পিড চেক করুন। প্রোডাক্ট পেজে কাস্টমার রিভিউ, ট্রাস্ট ব্যাজ ও ক্যাশ অন ডেলিভারি / সহজ চেকআউট প্রসেস নিশ্চিত করুন।',
    });
  }

  if (cpm > 18) {
    recommendations.push({
      priority: 'Medium',
      area: 'Ad Account & Bidding',
      action: 'অ্যাড সেটের সংখ্যা কমিয়ে বাজেট একত্রিত (Consolidated Budget) করুন এবং Advantage+ Campaign Budget (CBO) ব্যবহার করুন।',
    });
  }

  if (roas < 2.0 && roas > 0) {
    recommendations.push({
      priority: 'High',
      area: 'Offer & Pricing Strategy',
      action: 'বান্ডেল অফার (Buy 2 Get Free Delivery), আপসেল (Upsell) এবং মিনিমাম অর্ডার ভ্যালু বাড়িয়ে AOV বৃদ্ধি করুন যাতে CPA-এর বিপরীতে মার্জিন টিকে থাকে।',
    });
  }

  if (overallScore >= 80) {
    recommendations.push({
      priority: 'Growth',
      area: 'Scaling Strategy',
      action: 'প্রতি ৩-৪ দিনে ক্যাম্পেইন বাজেট ২০% হারে ইনক্রিমেন্টাল স্কেল (Vertical Scaling) করুন অথবা উইনিং ক্রিয়েটিভ নিয়ে ডুপ্লিকেট ব্রড ক্যাম্পেইন চালান।',
    });
  }

  return {
    metrics: {
      adSpend,
      impressions,
      reach,
      frequency,
      cpm,
      clicks,
      ctr,
      cpc,
      conversions,
      cpa,
      cvr,
      roas,
      revenue,
      videoHookRate,
      qualityRanking,
    },
    scores: {
      overallScore,
      creativeScore,
      costScore,
      conversionScore,
      roasScore,
      grade,
      gradeColor,
      badgeBg,
    },
    lackings,
    recommendations,
  };
}
