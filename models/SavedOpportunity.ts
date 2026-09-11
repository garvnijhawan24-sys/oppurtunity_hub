import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISavedOpportunityDocument extends Document {
  opportunityId: mongoose.Types.ObjectId;
  userId: string;
  savedAt: Date;
}

const SavedOpportunitySchema = new Schema<ISavedOpportunityDocument>(
  {
    opportunityId: {
      type: Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: [true, 'Opportunity ID reference is required'],
    },
    userId: {
      type: String,
      default: 'guest_user',
      index: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

SavedOpportunitySchema.index({ userId: 1, opportunityId: 1 }, { unique: true });

export const SavedOpportunity: Model<ISavedOpportunityDocument> =
  mongoose.models.SavedOpportunity ||
  mongoose.model<ISavedOpportunityDocument>(
    'SavedOpportunity',
    SavedOpportunitySchema
  );

export default SavedOpportunity;
