import mongoose from 'mongoose';

const ClientAdSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'active_client_ad',
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    badge: {
      type: String,
      default: '🔥 স্পেশাল অফার ও নতুন সার্ভিস',
      trim: true,
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      trim: true,
    },
    headline: {
      type: String,
      default: 'আপনার বিজনেসের জন্য মেটা কনভার্সন এপিআই (CAPI) ও সার্ভার-সাইড ট্র্যাকিং!',
      trim: true,
    },
    subHeadline: {
      type: String,
      default: 'অ্যাড ব্লকার ও iOS ১৪ আপডেটের পরেও ১০০% নিখুঁত ডেটা ক্যাপচার করুন এবং বিজ্ঞাপনের আরওএএস (ROAS) বাড়ান।',
      trim: true,
    },
    offerPoints: {
      type: [String],
      default: [
        '১০০% ইভেন্ট ম্যাচ কোয়ালিটি গ্যারান্টি',
        'ক্লাউড সার্ভার ও স্ট্যাগিং সেটআপ',
        'ফ্রি ৭ দিনের লাইভ মনিটরিং ও অডিট',
        '২৪/৭ ডেডিকেটেড ইঞ্জিনিয়ার সাপোর্ট',
      ],
    },
    orderBtnText: {
      type: String,
      default: 'অর্ডার করতে ক্লিক করুন',
      trim: true,
    },
    orderBtnLink: {
      type: String,
      default: '/#services',
      trim: true,
    },
    // Track interested clients
    interests: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        clientName: { type: String, trim: true },
        companyName: { type: String, trim: true },
        email: { type: String, trim: true },
        phone: { type: String, trim: true },
        clickedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.ClientAd || mongoose.model('ClientAd', ClientAdSchema);
