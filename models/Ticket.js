import mongoose from 'mongoose';

const TicketMessageSchema = new mongoose.Schema({
  senderRole: {
    type: String,
    enum: ['client', 'super_admin'],
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      default: '',
    },
    userEmail: {
      type: String,
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['ad_campaign', 'ecommerce_tracking', 'web_development', 'billing_order', 'general'],
      default: 'general',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    messages: [TicketMessageSchema],
    clientTypingUntil: {
      type: Date,
      default: null,
    },
    adminTypingUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
