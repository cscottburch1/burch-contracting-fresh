-- Admin Users Table for Multi-User Role-Based Access Control
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('owner', 'manager', 'sales', 'support') NOT NULL DEFAULT 'support',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default owner account (password: Breana3397@@)
-- Password hash generated with bcrypt
INSERT INTO admin_users (email, password_hash, name, role, is_active) 
VALUES (
  'estimates@burchcontracting.com',
  '$2a$10$YourBcryptHashWillGoHere',
  'Scott Burch',
  'owner',
  TRUE
) ON DUPLICATE KEY UPDATE email = email;
