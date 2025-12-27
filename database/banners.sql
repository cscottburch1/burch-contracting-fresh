-- Website Banners Management
CREATE TABLE IF NOT EXISTS banners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  button_text VARCHAR(100),
  button_link VARCHAR(500),
  bg_color VARCHAR(50) DEFAULT 'from-orange-600 via-red-600 to-orange-600',
  text_color VARCHAR(50) DEFAULT 'white',
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  start_date DATETIME,
  end_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  FOREIGN KEY (created_by) REFERENCES admin_users(id),
  INDEX idx_active (is_active),
  INDEX idx_order (display_order)
);

-- Insert emergency banner as default
INSERT INTO banners (title, message, button_text, button_link, bg_color, text_color, icon, is_active, display_order, created_by)
VALUES (
  'Emergency Repairs? Storm Damage?',
  'We respond within 4 hours • Available 24/7',
  'Call Now: (864) 724-4600',
  '/contact?emergency=true',
  'from-orange-600 via-red-600 to-orange-600',
  'white',
  'AlertCircle',
  TRUE,
  1,
  1
) ON DUPLICATE KEY UPDATE id=id;
