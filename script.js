const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || 'tnp_portal'
}

async function initializeDatabase() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    })

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`)
    await connection.query(`USE ${dbConfig.database}`)

    // Create Roles table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Create Users table with soft delete
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        batch_year YEAR,
        phone VARCHAR(15),
        department VARCHAR(100),
        registration_number VARCHAR(50),
        profile_image VARCHAR(255),
        password VARCHAR(255) NOT NULL,
        role_id INT NOT NULL,
        is_verified TINYINT(1) DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        verification_token VARCHAR(255),
        reset_token VARCHAR(255),
        reset_token_expires DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login DATETIME,
        deleted_at TIMESTAMP NULL,
        KEY(batch_year),
        KEY(role_id),
        KEY(registration_number),
        KEY(deleted_at),
        FOREIGN KEY (role_id) REFERENCES roles(id)
      )
    `)

    // Create Activity Logs table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        action VARCHAR(100) NOT NULL,
        details TEXT,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `)

    // Create Students table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        roll_number VARCHAR(20) UNIQUE NOT NULL,
        branch VARCHAR(100) NOT NULL,
        current_year VARCHAR(100),
        cgpa DECIMAL(3,2),
        phone VARCHAR(20) NOT NULL,
        secondary_phone VARCHAR(20),
        passing_year INT NOT NULL,
        is_email_verified TINYINT(1) DEFAULT 0,
        is_verified_by_admin TINYINT(1) DEFAULT 0,
        secondary_email VARCHAR(255),
        specialization VARCHAR(100),
        degree_type VARCHAR(20) DEFAULT 'UG',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `)

    // Create Companies table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT UNIQUE NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        website VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        contact_person_name VARCHAR(255) NOT NULL,
        contact_person_designation VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        is_email_verified TINYINT(1) DEFAULT 0,
        is_verified_by_admin TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `)

    // Create Company Details table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS company_details (
        id INT PRIMARY KEY AUTO_INCREMENT,
        company_id INT NOT NULL,
        head_office_address TEXT NOT NULL,
        hr_head_name VARCHAR(255) NOT NULL,
        mailing_address TEXT,
        hr_head_contact VARCHAR(255),
        hr_executive_name VARCHAR(255) NOT NULL,
        hr_executive_contact VARCHAR(255) NOT NULL,
        spoc_name VARCHAR(255) NOT NULL,
        spoc_contact VARCHAR(255) NOT NULL,
        total_employees INT NOT NULL,
        annual_turnover VARCHAR(255),
        company_category ENUM('PSU', 'MNC', 'Startup', 'Core', 'Other') NOT NULL,
        other_category VARCHAR(255),
        industry_sector ENUM('IT', 'Manufacturing', 'Finance', 'Consulting', 'Other') NOT NULL,
        other_sector VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id)
      )
    `)

    // Create Job Announcements table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS job_announcements (
        id INT PRIMARY KEY AUTO_INCREMENT,
        company_id INT NOT NULL,
        job_profile VARCHAR(255) NOT NULL,
        mode_of_hiring ENUM('On Campus', 'Off Campus', 'Virtual') NOT NULL,
        place_of_posting TEXT,
        ctc_breakdown TEXT NOT NULL,
        offer_type ENUM('Full Time', 'Internship', 'Both') NOT NULL,
        eligible_batches JSON NOT NULL,
        eligible_branches JSON NOT NULL,
        eligible_degrees JSON NOT NULL,
        selection_process JSON NOT NULL,
        total_rounds INT NOT NULL,
        min_offers INT,
        job_description_file VARCHAR(255),
        status ENUM('Pending Review', 'Approved', 'Rejected', 'On Hold') DEFAULT 'Pending Review',
        job_status ENUM('Open', 'Closed', 'Cancelled') DEFAULT 'Open',
        rejection_reason TEXT,
        created_by INT NOT NULL,
        last_date_to_apply DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id)
      )
    `)

    // Create Student Applications table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS student_applications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT NOT NULL,
        jaf_id INT NOT NULL,
        status ENUM('Applied', 'Shortlisted', 'Rejected', 'Selected', 'On Hold') DEFAULT 'Applied',
        current_round INT DEFAULT 1,
        remarks TEXT,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (jaf_id) REFERENCES job_announcements(id)
      )
    `)

    // Create Application Rounds table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS application_rounds (
        id INT PRIMARY KEY AUTO_INCREMENT,
        application_id INT NOT NULL,
        round_number INT NOT NULL,
        round_type VARCHAR(100) NOT NULL,
        status ENUM('Pending', 'Cleared', 'Not Cleared', 'On Hold') DEFAULT 'Pending',
        remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (application_id) REFERENCES student_applications(id)
      )
    `)

    // Create Student Documents table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS student_documents (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT NOT NULL,
        document_type VARCHAR(100) NOT NULL,
        caption VARCHAR(255),
        document_url TEXT NOT NULL,
        is_link TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id)
      )
    `)

    // Create Student Academics table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS student_academics (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT,
        tenth_board VARCHAR(100),
        tenth_percentage DECIMAL(5,2),
        tenth_year INT,
        tenth_school VARCHAR(255),
        twelfth_board VARCHAR(100),
        twelfth_percentage DECIMAL(5,2),
        twelfth_year INT,
        twelfth_school VARCHAR(255),
        ug_university VARCHAR(255),
        ug_college VARCHAR(255),
        ug_year_of_admission INT,
        sem1_cgpa DECIMAL(4,2),
        sem2_cgpa DECIMAL(4,2),
        sem3_cgpa DECIMAL(4,2),
        sem4_cgpa DECIMAL(4,2),
        sem5_cgpa DECIMAL(4,2),
        sem6_cgpa DECIMAL(4,2),
        sem7_cgpa DECIMAL(4,2),
        sem8_cgpa DECIMAL(4,2),
        sem9_cgpa DECIMAL(4,2),
        sem10_cgpa DECIMAL(4,2),
        overall_cgpa DECIMAL(4,2),
        backlogs INT DEFAULT 0,
        current_backlogs INT DEFAULT 0,
        gap_years INT DEFAULT 0,
        jee_rank INT,
        jee_score DECIMAL(7,2),
        gate_score DECIMAL(7,2),
        gate_rank INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id)
      )
    `)

    // Create Student Experience table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS student_experience (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT NOT NULL,
        company_name VARCHAR(255),
        position VARCHAR(255),
        start_date DATE,
        end_date DATE,
        current_job TINYINT(1) DEFAULT 0,
        description TEXT,
        experience_type VARCHAR(50) DEFAULT 'internship' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id)
      )
    `)

    // Create Student Skills table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS student_skills (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT,
        technical_skills TEXT,
        soft_skills TEXT,
        certifications TEXT,
        achievements TEXT,
        projects TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id)
      )
    `)

    // Create Student Job Preferences table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS student_job_preferences (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT,
        preferred_sectors TEXT,
        preferred_locations TEXT,
        expected_salary VARCHAR(100),
        willing_to_relocate TINYINT(1) DEFAULT 1,
        resume_url VARCHAR(255),
        linkedin_url VARCHAR(255),
        github_url VARCHAR(255),
        portfolio_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id)
      )
    `)

    // Create Student Personal Details table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS student_personal_details (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT NOT NULL UNIQUE,
        fathers_name VARCHAR(255),
        fathers_occupation VARCHAR(255),
        mothers_name VARCHAR(255),
        mothers_occupation VARCHAR(255),
        date_of_birth DATE,
        alternate_mobile VARCHAR(20),
        guardian_mobile VARCHAR(20),
        gender ENUM('Male', 'Female', 'Other'),
        category VARCHAR(50),
        blood_group VARCHAR(10),
        height DECIMAL(5,2),
        weight DECIMAL(5,2),
        is_physically_handicapped TINYINT(1) DEFAULT 0,
        ph_percent INT,
        disability_type VARCHAR(255),
        permanent_address TEXT,
        permanent_city VARCHAR(100),
        permanent_state VARCHAR(100),
        permanent_pincode VARCHAR(10),
        correspondence_address TEXT,
        correspondence_city VARCHAR(100),
        correspondence_state VARCHAR(100),
        correspondence_pincode VARCHAR(10),
        domicile VARCHAR(100),
        aadhar_number VARCHAR(20),
        driving_license TINYINT(1) DEFAULT 0,
        driving_license_number VARCHAR(50),
        pan_number VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id)
      )
    `)

    // Create OTP table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS otps (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        type ENUM('registration', 'password_reset') NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used TINYINT(1) DEFAULT 0,
        registration_data JSON,
        is_verified TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create System Settings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        smtp_host VARCHAR(255),
        smtp_port INT,
        smtp_secure TINYINT(1),
        smtp_user VARCHAR(255),
        smtp_pass VARCHAR(255),
        smtp_from VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Insert default roles
    await connection.query(`
      INSERT IGNORE INTO roles (name) VALUES 
      ('super_admin'),
      ('admin'),
      ('student'),
      ('company')
    `)

    console.log('Database initialized successfully!')
   
    
    await connection.end()
  } catch (error) {
    console.error('Error initializing database:', error)
    process.exit(1)
  }
}

initializeDatabase() 