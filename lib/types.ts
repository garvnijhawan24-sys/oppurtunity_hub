export type OpportunityCategory =
  | 'Hackathon'
  | 'Internship'
  | 'Workshop'
  | 'Competition'
  | 'Event';

export const CATEGORIES: OpportunityCategory[] = [
  'Hackathon',
  'Internship',
  'Workshop',
  'Competition',
  'Event',
];

export interface IOpportunity {
  _id: string;
  title: string;
  description: string;
  category: OpportunityCategory;
  deadline: string;
  applicationLink: string;
  source?: 'user_submission' | 'external_api';
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISavedOpportunity {
  _id: string;
  opportunityId: string | IOpportunity;
  userId: string;
  savedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

export interface OpportunityFormData {
  title: string;
  description: string;
  category: OpportunityCategory;
  deadline: string;
  applicationLink: string;
}
