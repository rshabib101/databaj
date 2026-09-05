import mongoose from 'mongoose';

const AgencyProfileSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main_profile',
      unique: true,
    },
    founderName: {
      type: String,
      default: 'রাশেদুল হাবিব',
      trim: true,
    },
    founderRole: {
      type: String,
      default: 'Founder & CEO, DataBaj IT',
      trim: true,
    },
    founderImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      trim: true,
    },
    badge: {
      type: String,
      default: 'LEADERSHIP & VISION',
      trim: true,
    },
    founderQuote: {
      type: String,
      default: 'আমাদের মূল লক্ষ্য কেবল কোডিং বা ক্যাম্পেইন চালানো নয়; ক্লায়েন্টের প্রতিটি টাকাকে হাই-কনভার্টিং সেলসে রূপান্তর করে তাদের ব্র্যান্ডকে স্কেল করানো।',
      trim: true,
    },
    founderBio: {
      type: String,
      default: '৭+ বছরেরও বেশি সময় ধরে ডিজিটাল মার্কেটিং ও ফুল-স্ট্যাক ওয়েব সলিউশন নিয়ে কাজ করার অভিজ্ঞতায় DataBaj-এর মাধ্যমে আমরা এনেছি ডেটা-ড্রিভেন টেকনোলজি এবং অ্যাডভান্সড মেটা ও গুগল ট্র্যাকিং ফ্রেমওয়ার্ক।',
      trim: true,
    },
    experienceYears: {
      type: String,
      default: '৭+ বছর',
    },
    stats: [
      {
        label: { type: String, default: '' },
        value: { type: String, default: '' },
      },
    ],
    socials: {
      linkedin: { type: String, default: '' },
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      email: { type: String, default: 'ceo@databaj.com' },
    },
  },
  { timestamps: true }
);

if (mongoose.models.AgencyProfile) {
  delete mongoose.models.AgencyProfile;
}

export default mongoose.model('AgencyProfile', AgencyProfileSchema);
