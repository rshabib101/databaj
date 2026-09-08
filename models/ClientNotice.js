import mongoose from 'mongoose';

const ClientNoticeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Client ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notice message is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['urgent', 'warning', 'important', 'info', 'success'],
      default: 'important',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    actionBtnText: {
      type: String,
      default: '',
      trim: true,
    },
    actionBtnLink: {
      type: String,
      default: '',
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ClientNotice || mongoose.model('ClientNotice', ClientNoticeSchema);
