-- Emergency Services Settings Table
CREATE TABLE IF NOT EXISTS emergency_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  emergency_services_enabled BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT,
  FOREIGN KEY (updated_by) REFERENCES admin_users(id)
);

-- Insert default record
INSERT INTO emergency_settings (emergency_services_enabled) 
VALUES (TRUE)
ON DUPLICATE KEY UPDATE id=id;
