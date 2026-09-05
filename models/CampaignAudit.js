import mongoose from 'mongoose';

const CampaignAuditSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
      index: true,
    },
    campaignName: {
      type: String,
      required: true,
      trim: true,
    },
    objective: {
      type: String,
      default: 'conversions',
    },
    // Raw & Computed Metrics
    adSpend: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    frequency: { type: Number, default: 1 },
    cpm: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 },
    cpc: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    cpa: { type: Number, default: 0 },
    cvr: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    roas: { type: Number, default: 0 },
    videoHookRate: { type: Number, default: null },
    qualityRanking: { type: String, default: 'average' },

    // Computed Scores
    overallScore: { type: Number, default: 0 },
    creativeScore: { type: Number, default: 0 },
    costScore: { type: Number, default: 0 },
    conversionScore: { type: Number, default: 0 },
    roasScore: { type: Number, default: 0 },
    grade: { type: String, default: 'Average' },

    // Audit results
    lackings: [
      {
        metric: String,
        value: String,
        benchmark: String,
        severity: String,
        title: String,
        description: String,
        category: String,
      },
    ],
    recommendations: [
      {
        priority: String,
        area: String,
        action: String,
      },
    ],
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.CampaignAudit || mongoose.model('CampaignAudit', CampaignAuditSchema);
