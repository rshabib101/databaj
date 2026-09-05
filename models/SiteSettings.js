import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main_settings',
      unique: true,
    },
    phone: {
      type: String,
      default: '+880 1700-000000',
      trim: true,
    },
    whatsapp: {
      type: String,
      default: '+880 1700-000000',
      trim: true,
    },
    email: {
      type: String,
      default: 'contact@databaj.com',
      trim: true,
    },
    address: {
      type: String,
      default: 'হাউজ #৪২, রোড #১১, বনানী, ঢাকা-১২১৩, বাংলাদেশ',
      trim: true,
    },
    workingHours: {
      type: String,
      default: 'সকাল ৯:০০ - রাত ১০:০০ (শনি - বৃহঃ)',
      trim: true,
    },
    facebookUrl: {
      type: String,
      default: 'https://facebook.com/databaj',
      trim: true,
    },
    linkedinUrl: {
      type: String,
      default: 'https://linkedin.com/company/databaj',
      trim: true,
    },
  },
  { timestamps: true }
);

if (mongoose.models.SiteSettings) {
  delete mongoose.models.SiteSettings;
}

export default mongoose.model('SiteSettings', SiteSettingsSchema);
