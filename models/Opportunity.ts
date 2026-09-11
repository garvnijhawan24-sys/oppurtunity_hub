import mongoose, { Schema, Document, Model } from 'mongoose';
import { OpportunityCategory } from '@/lib/types';

export interface IOpportunityDocument extends Document {
  title: string;
  description: string;
  category: OpportunityCategory;
  deadline: Date;
  applicationLink: string;
  source: 'user_submission' | 'external_api';
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OpportunitySchema = new Schema<IOpportunityDocument>(
  {
    title: {
      type: String,
      required: [true, 'Please provide an opportunity title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select an opportunity category'],
      enum: {
        values: ['Hackathon', 'Internship', 'Workshop', 'Competition', 'Event'],
        message: '{VALUE} is not a valid category',
      },
    },
    deadline: {
      type: Date,
      required: [true, 'Please provide an application deadline'],
      validate: {
        validator: function (val: Date) {
          return val instanceof Date && !isNaN(val.getTime());
        },
        message: 'Invalid deadline date format',
      },
    },
    applicationLink: {
      type: String,
      required: [true, 'Please provide an application or registration URL'],
      trim: true,
      match: [
        /^(https?:\/\/)[^\s$.?#].[^\s]*$/i,
        'Application link must begin with http:// or https://',
      ],
    },
    source: {
      type: String,
      enum: ['user_submission', 'external_api'],
      default: 'user_submission',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

OpportunitySchema.index({ category: 1, deadline: 1 });
OpportunitySchema.index({ title: 'text', description: 'text' });

export const Opportunity: Model<IOpportunityDocument> =
  mongoose.models.Opportunity ||
  mongoose.model<IOpportunityDocument>('Opportunity', OpportunitySchema);

export default Opportunity;
