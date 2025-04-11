-- Update job_announcements table
ALTER TABLE job_announcements 
ADD COLUMN last_date_to_apply DATE NOT NULL,
ADD COLUMN status ENUM('Open', 'Closed', 'Cancelled') DEFAULT 'Open',
ADD COLUMN created_by INT NOT NULL,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Create table for student applications
CREATE TABLE student_applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  jaf_id INT NOT NULL,
  status ENUM('Applied', 'Shortlisted', 'In Process', 'Selected', 'Rejected') DEFAULT 'Applied',
  current_round INT DEFAULT 1,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (jaf_id) REFERENCES job_announcements(id)
);

-- Create table for application rounds
CREATE TABLE application_rounds (
  id INT PRIMARY KEY AUTO_INCREMENT,
  application_id INT NOT NULL,
  round_number INT NOT NULL,
  round_type VARCHAR(50) NOT NULL,
  status ENUM('Pending', 'Cleared', 'Not Cleared') DEFAULT 'Pending',
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES student_applications(id)
); 