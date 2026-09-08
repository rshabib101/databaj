import mongoose from 'mongoose';

const ConsultationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    serviceSlug: {
      type: String,
      default: '',
    },
    serviceTitle: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    budget: {
      type: String,
      default: 'Standard',
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'in_progress', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Consultation || mongoose.model('Consultation', ConsultationSchema);
