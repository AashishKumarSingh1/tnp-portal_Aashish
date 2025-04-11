CREATE TABLE student_applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  jaf_id INT NOT NULL,
  status ENUM('Applied', 'Resume Shortlisted', 'Written Test', 'GD Round', 'Technical Interview', 'HR Interview', 'Selected', 'Rejected') DEFAULT 'Applied',
  current_round INT DEFAULT 1,
  remarks TEXT,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (jaf_id) REFERENCES job_announcements(id)
); 