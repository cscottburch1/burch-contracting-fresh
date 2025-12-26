export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ActivityType = 'status_change' | 'note_added' | 'email_sent' | 'call_made' | 'meeting_scheduled' | 'proposal_sent';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  service_type?: string;
  budget_range?: string;
  timeframe?: string;
  referral_source?: string;
  description: string;
  status: LeadStatus;
  priority: LeadPriority;
  assigned_to?: string;
  estimated_value?: number;
  scheduled_date?: string;
  last_contact_date?: string;
  source_url?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  note_type: string;
  content: string;
  created_by?: string;
  created_at: string;
  is_important: boolean;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: ActivityType;
  description: string;
  created_by?: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface LeadStatistics {
  status: LeadStatus;
  count: number;
  avg_value: number;
  total_value: number;
}
