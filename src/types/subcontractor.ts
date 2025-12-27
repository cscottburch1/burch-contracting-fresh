export interface Subcontractor {
  id: number;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  
  // Business details
  business_type: 'sole_proprietor' | 'llc' | 'corporation' | 'partnership';
  years_in_business?: number;
  license_number?: string;
  insurance_provider?: string;
  insurance_expiry?: Date;
  
  // Specialties
  specialties: string[];
  
  // Status and ratings
  status: 'pending' | 'approved' | 'active' | 'suspended' | 'rejected';
  rating: number;
  total_projects: number;
  
  // Financial
  payment_terms?: string;
  w9_submitted: boolean;
  
  // Notes
  admin_notes?: string;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  last_active?: Date;
  approved_at?: Date;
  approved_by?: number;
}

export interface SubcontractorDocument {
  id: number;
  subcontractor_id: number;
  document_type: 'license' | 'insurance' | 'w9' | 'certificate' | 'contract' | 'other';
  document_name: string;
  file_path: string;
  file_size: number;
  uploaded_at: Date;
  uploaded_by?: number;
  expires_at?: Date;
}

export interface BidOpportunity {
  id: number;
  project_title: string;
  project_description: string;
  project_type?: string;
  location?: string;
  
  // Scope and requirements
  scope_of_work?: string;
  required_specialties: string[];
  estimated_budget_min?: number;
  estimated_budget_max?: number;
  
  // Timeline
  bid_deadline: Date;
  project_start_date?: Date;
  project_end_date?: Date;
  
  // Status
  status: 'draft' | 'open' | 'closed' | 'awarded' | 'cancelled';
  
  // Awarded info
  awarded_to?: number;
  awarded_at?: Date;
  awarded_amount?: number;
  
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface SubcontractorBid {
  id: number;
  opportunity_id: number;
  subcontractor_id: number;
  
  // Bid details
  bid_amount: number;
  timeline_days?: number;
  bid_notes?: string;
  
  // Proposal documents
  proposal_file_path?: string;
  
  // Status
  status: 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'withdrawn';
  
  // Review
  reviewed_by?: number;
  reviewed_at?: Date;
  review_notes?: string;
  
  submitted_at: Date;
  updated_at: Date;
}

export interface SubcontractorReview {
  id: number;
  subcontractor_id: number;
  project_id?: number;
  
  // Ratings (1-5)
  quality_rating: number;
  timeliness_rating: number;
  communication_rating: number;
  professionalism_rating: number;
  
  // Review details
  review_text?: string;
  would_hire_again: boolean;
  
  reviewed_by: number;
  created_at: Date;
}

export interface SubcontractorActivity {
  id: number;
  subcontractor_id: number;
  activity_type: 'application' | 'approved' | 'rejected' | 'bid_submitted' | 'bid_awarded' | 'document_uploaded' | 'status_change' | 'note_added';
  description?: string;
  performed_by?: number;
  created_at: Date;
}

// Available specialties for subcontractors
export const SUBCONTRACTOR_SPECIALTIES = [
  'Framing',
  'Roofing',
  'Siding',
  'Windows & Doors',
  'Drywall',
  'Painting',
  'Flooring',
  'Tile Work',
  'Cabinetry',
  'Countertops',
  'Plumbing',
  'Electrical',
  'HVAC',
  'Insulation',
  'Concrete',
  'Masonry',
  'Landscaping',
  'Excavation',
  'Demolition',
  'Carpentry',
  'Trim Work',
  'Kitchen Remodeling',
  'Bathroom Remodeling',
  'Deck Building',
  'Fence Installation',
  'General Labor'
] as const;

export type SubcontractorSpecialty = typeof SUBCONTRACTOR_SPECIALTIES[number];
