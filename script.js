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

   // Create Users table
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
    KEY(batch_year),
    KEY(role_id),
    KEY(registration_number),
    FOREIGN KEY (role_id) REFERENCES roles(id)
  )
`);

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

    // Create Students table with registration fields
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        roll_number VARCHAR(20) UNIQUE NOT NULL,
        branch VARCHAR(100) NOT NULL,
        current_year INT NOT NULL,
        cgpa DECIMAL(3,2),
        phone VARCHAR(20) NOT NULL,
        passing_year INT NOT NULL,
        is_email_verified BOOLEAN DEFAULT false,
        is_verified_by_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `)

    // Create Companies table with registration fields
    await connection.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT UNIQUE NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        website VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        contact_person_name VARCHAR(255) NOT NULL,
        contact_person_designation VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        is_email_verified BOOLEAN DEFAULT false,
        is_verified_by_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    //create system_settings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    smtp_host VARCHAR(255),
    smtp_port INT,
    smtp_secure BOOLEAN,
    smtp_user VARCHAR(255),
    smtp_pass VARCHAR(255),
    smtp_from VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`
    )

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