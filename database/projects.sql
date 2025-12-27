-- Recent Projects Showcase
CREATE TABLE IF NOT EXISTS recent_projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  category ENUM('handyman', 'remodeling', 'additions') NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  image_url VARCHAR(500),
  before_image VARCHAR(500),
  after_image VARCHAR(500),
  completion_date DATE,
  project_duration VARCHAR(100),
  location VARCHAR(255),
  budget_range VARCHAR(100),
  featured BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  FOREIGN KEY (created_by) REFERENCES admin_users(id),
  INDEX idx_category (category),
  INDEX idx_featured (featured),
  INDEX idx_active (is_active),
  INDEX idx_order (display_order)
);

-- Insert sample projects with stock images
INSERT INTO recent_projects (title, category, description, short_description, image_url, completion_date, project_duration, location, budget_range, featured, display_order, is_active) VALUES
('Kitchen Fixture Repair', 'handyman', 'Complete kitchen fixture repair including faucet replacement, cabinet hardware installation, and minor plumbing fixes. Customer was extremely satisfied with the quick turnaround and professional service.', 'Quick kitchen fixture repairs and updates', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800', '2024-01-15', '1 day', 'Greenville, SC', '$500-$1,000', TRUE, 1, TRUE),
('Deck Installation & Staining', 'handyman', 'Built and stained a beautiful 12x16 deck with premium pressure-treated lumber. Included railing installation and weatherproof staining for long-lasting durability.', 'New deck construction with professional staining', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', '2024-01-20', '3 days', 'Spartanburg, SC', '$3,000-$5,000', TRUE, 2, TRUE),
('Bathroom Remodel', 'remodeling', 'Complete bathroom renovation including new tile work, vanity installation, modern fixtures, and updated lighting. Transformed an outdated bathroom into a modern spa-like retreat.', 'Full bathroom renovation with modern finishes', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800', '2024-02-01', '2 weeks', 'Greenville, SC', '$10,000-$15,000', TRUE, 3, TRUE),
('Kitchen Remodel', 'remodeling', 'Stunning kitchen transformation featuring new cabinets, granite countertops, tile backsplash, stainless steel appliances, and recessed lighting. Open concept design maximizes space and functionality.', 'Modern kitchen with custom cabinets and granite', 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=800', '2024-02-15', '3 weeks', 'Simpsonville, SC', '$25,000-$35,000', TRUE, 4, TRUE),
('Home Office Addition', 'additions', 'Built a dedicated 200 sq ft home office addition with large windows, built-in shelving, and premium finishes. Perfect work-from-home space with excellent natural lighting.', '200 sq ft home office with natural light', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', '2024-03-01', '6 weeks', 'Greer, SC', '$30,000-$40,000', TRUE, 5, TRUE),
('Sunroom Addition', 'additions', 'Gorgeous three-season sunroom addition with floor-to-ceiling windows, tile flooring, and climate control. Extended living space by 300 sq ft with stunning backyard views.', '300 sq ft sunroom with panoramic windows', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', '2024-03-15', '8 weeks', 'Mauldin, SC', '$50,000-$60,000', TRUE, 6, TRUE),
('Drywall Repair & Painting', 'handyman', 'Professional drywall repair and interior painting for entire first floor. Patched holes, smoothed walls, and applied two coats of premium paint for a flawless finish.', 'Interior drywall repair and painting service', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800', '2024-01-25', '4 days', 'Greenville, SC', '$2,000-$3,000', FALSE, 7, TRUE),
('Master Bedroom Suite Remodel', 'remodeling', 'Luxurious master bedroom and ensuite bathroom remodel with walk-in closet system, spa shower, soaking tub, and designer finishes throughout.', 'Complete master suite transformation', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800', '2024-02-20', '4 weeks', 'Greenville, SC', '$35,000-$45,000', FALSE, 8, TRUE),
('Two-Car Garage Addition', 'additions', 'New 24x24 two-car garage with electric door openers, built-in storage, and matching exterior to complement existing home architecture.', 'Custom two-car garage with storage', 'https://images.unsplash.com/photo-1562163037-7a304915caa8?w=800', '2024-03-10', '10 weeks', 'Simpsonville, SC', '$40,000-$50,000', FALSE, 9, TRUE)
ON DUPLICATE KEY UPDATE title=title;
