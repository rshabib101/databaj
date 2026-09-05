import mongoose from 'mongoose';

const ClientTaskSchema = new mongoose.Schema(
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
    taskType: {
      type: String,
      enum: ['web', 'ads'],
      required: true,
      default: 'ads',
    },
    // Ads Campaign Fields (Google Sheet Columns)
    webLink: {
      type: String,
      default: '',
      trim: true,
    },
    postLink: {
      type: String,
      default: '',
      trim: true,
    },
    variationPostLink: {
      type: String,
      default: '',
      trim: true,
    },
    videoDuration: {
      type: String,
      default: '',
      trim: true,
    },
    comment: {
      type: String,
      default: '',
      trim: true,
    },
    // Web Development Fields
    title: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent', 'normal'],
      default: 'normal',
    },
    // Common Status (only Super Admin can edit)
    status: {
      type: String,
      enum: ['pending', 'in_review', 'done'],
      default: 'pending',
    },
    adminFeedback: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models.ClientTask) {
  delete mongoose.models.ClientTask;
}

export default mongoose.model('ClientTask', ClientTaskSchema);
