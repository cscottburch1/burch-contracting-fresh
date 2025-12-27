-- Email Templates
CREATE TABLE IF NOT EXISTS email_templates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  template_type ENUM('customer', 'admin', 'subcontractor', 'general') DEFAULT 'general',
  variables TEXT,  -- JSON array of variable names like ["customer_name", "project_name"]
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- SMS Templates
CREATE TABLE IF NOT EXISTS sms_templates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  message TEXT NOT NULL,
  template_type ENUM('customer', 'admin', 'subcontractor', 'general') DEFAULT 'general',
  variables TEXT,  -- JSON array of variable names
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Notification Log
CREATE TABLE IF NOT EXISTS notification_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  recipient_type ENUM('customer', 'admin', 'subcontractor') NOT NULL,
  recipient_id INT,
  notification_type ENUM('email', 'sms') NOT NULL,
  template_id INT,
  subject VARCHAR(500),
  message TEXT,
  status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
  error_message TEXT,
  sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_recipient (recipient_type, recipient_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
);

-- Insert default email templates
INSERT INTO email_templates (name, subject, body, template_type, variables, is_active) VALUES
('customer_welcome', 'Welcome to Burch Contracting Portal', 
'Hi {{customer_name}},\n\nWelcome to the Burch Contracting customer portal! You can now track your projects, view updates, and communicate with our team.\n\nYour login email: {{email}}\n\nLogin at: https://burchcontracting.com/portal\n\nThank you for choosing Burch Contracting!\n\nBest regards,\nBurch Contracting Team', 
'customer', '["customer_name", "email"]', TRUE),

('project_update', 'Project Update: {{project_name}}',
'Hi {{customer_name}},\n\nWe have an update on your project: {{project_name}}\n\n{{update_message}}\n\nYou can view more details in your portal at: https://burchcontracting.com/portal/projects/{{project_id}}\n\nThank you,\nBurch Contracting Team',
'customer', '["customer_name", "project_name", "update_message", "project_id"]', TRUE),

('new_message', 'New Message from Burch Contracting',
'Hi {{customer_name}},\n\nYou have received a new message from our team.\n\nSubject: {{message_subject}}\n\nPlease login to your portal to view and respond: https://burchcontracting.com/portal/messages\n\nThank you,\nBurch Contracting Team',
'customer', '["customer_name", "message_subject"]', TRUE)
ON DUPLICATE KEY UPDATE name=name;

-- Insert default SMS templates
INSERT INTO sms_templates (name, message, template_type, variables, is_active) VALUES
('project_start', 'Hi {{customer_name}}, your {{project_type}} project starts {{start_date}}. We''ll see you soon! - Burch Contracting', 
'customer', '["customer_name", "project_type", "start_date"]', TRUE),

('appointment_reminder', '{{customer_name}}, reminder: Your consultation is scheduled for {{date}} at {{time}}. Call (864) 724-4600 if you need to reschedule. - Burch Contracting',
'customer', '["customer_name", "date", "time"]', TRUE),

('project_complete', 'Great news {{customer_name}}! Your {{project_type}} project is complete. Thank you for choosing Burch Contracting!',
'customer', '["customer_name", "project_type"]', TRUE)
ON DUPLICATE KEY UPDATE name=name;
