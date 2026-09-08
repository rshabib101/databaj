import mongoose from 'mongoose';

const CredentialSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      default: '',
    },
    platform: {
      type: String,
      enum: ['facebook_bm', 'google_ads', 'website_admin', 'cpanel_hosting', 'gtm_analytics', 'other'],
      default: 'website_admin',
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    accountUrl: {
      type: String,
      default: '',
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Username / Email is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password / API Key is required'],
      trim: true,
    },
    twoFactorInstructions: {
      type: String,
      default: '',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    addedBy: {
      type: String,
      enum: ['client', 'admin'],
      default: 'client',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Credential || mongoose.model('Credential', CredentialSchema);
