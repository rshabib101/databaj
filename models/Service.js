import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    fullDescription: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      default: 'Code', // e.g., 'Code', 'TrendingUp', 'Activity', 'BarChart3', 'ShieldCheck'
    },
    badge: {
      type: String,
      default: '', // e.g., 'Most Popular', 'High ROI', 'Enterprise'
    },
    features: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
