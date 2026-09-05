import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide user name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
    },
    companyName: {
      type: String,
      required: [true, 'Please provide company or brand name'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['super_admin', 'client'],
      default: 'client',
    },
    industry: {
      type: String,
      default: 'E-commerce & Retail',
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    logoUrl: {
      type: String,
      default: '',
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: '',
      trim: true,
    },
    website: {
      type: String,
      default: '',
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'pending_approval', 'suspended'],
      default: 'pending_approval',
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model('User', UserSchema);
