-- Subcontractor Management System Tables

-- Main subcontractor profiles table
CREATE TABLE IF NOT EXISTS subcontractors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip VARCHAR(20),
  
  -- Business details
  business_type ENUM('sole_proprietor', 'llc', 'corporation', 'partnership') DEFAULT 'sole_proprietor',
  years_in_business INT,
  license_number VARCHAR(100),
  insurance_provider VARCHAR(255),
  insurance_expiry DATE,
  
  -- Specialties (stored as JSON array)
  specialties JSON,
  
  -- Status and ratings
  status ENUM('pending', 'approved', 'active', 'suspended', 'rejected') DEFAULT 'pending',
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_projects INT DEFAULT 0,
  
  -- Financial
  payment_terms VARCHAR(100),
  w9_submitted BOOLEAN DEFAULT FALSE,
  
  -- Notes
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_active TIMESTAMP NULL,
  approved_at TIMESTAMP NULL,
  approved_by INT,
  
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_rating (rating),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subcontractor documents table
CREATE TABLE IF NOT EXISTS subcontractor_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subcontractor_id INT NOT NULL,
  document_type ENUM('license', 'insurance', 'w9', 'certificate', 'contract', 'other') NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploaded_by INT,
  expires_at DATE,
  
  FOREIGN KEY (subcontractor_id) REFERENCES subcontractors(id) ON DELETE CASCADE,
  INDEX idx_subcontractor (subcontractor_id),
  INDEX idx_type (document_type),
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bidding opportunities table
CREATE TABLE IF NOT EXISTS bid_opportunities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_title VARCHAR(255) NOT NULL,
  project_description TEXT NOT NULL,
  project_type VARCHAR(100),
  location VARCHAR(255),
  
  -- Scope and requirements
  scope_of_work TEXT,
  required_specialties JSON,
  estimated_budget_min DECIMAL(10,2),
  estimated_budget_max DECIMAL(10,2),
  
  -- Timeline
  bid_deadline DATETIME NOT NULL,
  project_start_date DATE,
  project_end_date DATE,
  
  -- Status
  status ENUM('draft', 'open', 'closed', 'awarded', 'cancelled') DEFAULT 'draft',
  
  -- Awarded info
  awarded_to INT,
  awarded_at TIMESTAMP NULL,
  awarded_amount DECIMAL(10,2),
  
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (awarded_to) REFERENCES subcontractors(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_deadline (bid_deadline),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bids submitted by subcontractors
CREATE TABLE IF NOT EXISTS subcontractor_bids (
  id INT AUTO_INCREMENT PRIMARY KEY,
  opportunity_id INT NOT NULL,
  subcontractor_id INT NOT NULL,
  
  -- Bid details
  bid_amount DECIMAL(10,2) NOT NULL,
  timeline_days INT,
  bid_notes TEXT,
  
  -- Proposal documents
  proposal_file_path VARCHAR(500),
  
  -- Status
  status ENUM('submitted', 'under_review', 'accepted', 'rejected', 'withdrawn') DEFAULT 'submitted',
  
  -- Review
  reviewed_by INT,
  reviewed_at TIMESTAMP NULL,
  review_notes TEXT,
  
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (opportunity_id) REFERENCES bid_opportunities(id) ON DELETE CASCADE,
  FOREIGN KEY (subcontractor_id) REFERENCES subcontractors(id) ON DELETE CASCADE,
  UNIQUE KEY unique_bid (opportunity_id, subcontractor_id),
  INDEX idx_opportunity (opportunity_id),
  INDEX idx_subcontractor (subcontractor_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Performance reviews for subcontractors
CREATE TABLE IF NOT EXISTS subcontractor_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subcontractor_id INT NOT NULL,
  project_id INT,
  
  -- Ratings (1-5)
  quality_rating INT NOT NULL,
  timeliness_rating INT NOT NULL,
  communication_rating INT NOT NULL,
  professionalism_rating INT NOT NULL,
  
  -- Review details
  review_text TEXT,
  would_hire_again BOOLEAN DEFAULT TRUE,
  
  reviewed_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (subcontractor_id) REFERENCES subcontractors(id) ON DELETE CASCADE,
  INDEX idx_subcontractor (subcontractor_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subcontractor activity log
CREATE TABLE IF NOT EXISTS subcontractor_activity (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subcontractor_id INT NOT NULL,
  activity_type ENUM('application', 'approved', 'rejected', 'bid_submitted', 'bid_awarded', 'document_uploaded', 'status_change', 'note_added') NOT NULL,
  description TEXT,
  performed_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (subcontractor_id) REFERENCES subcontractors(id) ON DELETE CASCADE,
  INDEX idx_subcontractor (subcontractor_id),
  INDEX idx_type (activity_type),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
