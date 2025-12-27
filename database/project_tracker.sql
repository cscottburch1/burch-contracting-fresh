-- Project Tracker Database Schema
-- Allows customers to view their project status and updates in real-time

-- Projects table: Core project information
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    project_type VARCHAR(100) NOT NULL, -- Kitchen, Bathroom, Deck, Addition, Handyman, etc.
    description TEXT,
    start_date DATE,
    estimated_completion_date DATE,
    actual_completion_date DATE,
    status ENUM('scheduled', 'in_progress', 'on_hold', 'completed', 'cancelled') DEFAULT 'scheduled',
    completion_percentage INT DEFAULT 0,
    total_cost DECIMAL(10,2),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(2) DEFAULT 'SC',
    zip_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_start_date (start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project milestones/phases
CREATE TABLE IF NOT EXISTS project_milestones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    milestone_name VARCHAR(255) NOT NULL,
    description TEXT,
    order_num INT NOT NULL DEFAULT 0,
    status ENUM('pending', 'in_progress', 'completed', 'skipped') DEFAULT 'pending',
    scheduled_date DATE,
    completed_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_order (order_num)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project updates/timeline
CREATE TABLE IF NOT EXISTS project_updates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    update_type ENUM('note', 'status_change', 'milestone_completed', 'photo', 'document') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    visibility ENUM('customer', 'internal', 'both') DEFAULT 'both',
    created_by VARCHAR(255), -- Admin username or "System"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_created_at (created_at),
    INDEX idx_visibility (visibility)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project photos
CREATE TABLE IF NOT EXISTS project_photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    update_id INT, -- Optional link to specific update
    photo_url VARCHAR(500) NOT NULL,
    caption TEXT,
    photo_type ENUM('progress', 'before', 'after', 'issue', 'completed') DEFAULT 'progress',
    taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (update_id) REFERENCES project_updates(id) ON DELETE SET NULL,
    INDEX idx_project_id (project_id),
    INDEX idx_photo_type (photo_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project team assignments (crew/subcontractors)
CREATE TABLE IF NOT EXISTS project_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    assigned_type ENUM('crew', 'subcontractor') NOT NULL,
    assigned_id INT, -- Reference to subcontractor ID or crew member ID
    assigned_name VARCHAR(255) NOT NULL, -- Name for display
    role VARCHAR(100), -- Lead, Helper, Plumber, Electrician, etc.
    assigned_date DATE NOT NULL,
    removed_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_assigned_type (assigned_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project documents (contracts, invoices, permits, etc.)
CREATE TABLE IF NOT EXISTS project_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    document_type VARCHAR(100) NOT NULL, -- Contract, Invoice, Permit, Change Order, etc.
    document_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INT, -- In bytes
    uploaded_by VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_document_type (document_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default milestones for common project types
-- These can be used as templates when creating new projects

-- Example: Insert sample project for testing
-- INSERT INTO projects (customer_id, project_name, project_type, description, start_date, estimated_completion_date, status, completion_percentage, address_line1, city, state, zip_code)
-- VALUES (1, 'Kitchen Remodel - Smith Residence', 'Kitchen', 'Complete kitchen renovation including cabinets, countertops, flooring, and appliances', '2025-01-15', '2025-02-28', 'scheduled', 0, '123 Main St', 'Simpsonville', 'SC', '29681');
