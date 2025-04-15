import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  idleTimeout: 60000, // Close idle connections after 60 seconds
  maxIdle: 10 // Maximum number of idle connections to keep
})

export async function executeQuery({ query, values = [] }) {
  const connection = await pool.getConnection()
  try {
    const [results] = await connection.execute(query, values)
    return results
  } catch (error) {
    console.error('Database Error:', error)
    throw error
  } finally {
    connection.release()
  }
}

export async function executeTransaction(queries) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    
    const results = []
    for (const { query, values = [] } of queries) {
      const [result] = await connection.execute(query, values)
      results.push(result)
    }
    
    await connection.commit()
    return results
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export async function getUserByEmail(email) {
  const [user] = await executeQuery({
    query: `
      SELECT u.*, r.name as role
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.email = ?
    `,
    values: [email]
  })
  return user
}

export async function createOTP(email, otp, type) {
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 10) // OTP valid for 10 minutes

  await executeQuery({
    query: `
      INSERT INTO otps (email, otp, type, expires_at)
      VALUES (?, ?, ?, ?)
    `,
    values: [email, otp, type, expiresAt]
  })
}

export async function verifyOTP(email, otp, type) {
  try {
    const results = await executeQuery({
      query: `
      SELECT * FROM otps
      WHERE email = ? 
      AND otp = ? 
      AND type = ?
      AND expires_at > NOW()
      AND used = false
      ORDER BY created_at DESC
      LIMIT 1
    `,
      values: [email, otp, type],
    })

    if (results.length > 0) {
      // Mark OTP as used
      await executeQuery({
        query: 'UPDATE otps SET used = true WHERE id = ?',
        values: [results[0].id]
      })
      return true
    }

    return false
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return false
  }
}

export async function updateUserPassword(userId, hashedPassword) {
  const query = 'UPDATE users SET password = ? WHERE id = ?'
  return executeQuery({ query, values: [hashedPassword, userId] })
}

export async function markUserVerified(email) {
  await executeQuery({
    query: 'UPDATE users SET is_verified = true WHERE email = ?',
    values: [email]
  })
}

export async function getUserProfile(userId, role) {
  let profile
  if (role === 'company') {
    [profile] = await executeQuery({
      query: 'SELECT * FROM companies WHERE user_id = ?',
      values: [userId]
    })
  } else if (role === 'student') {
    [profile] = await executeQuery({
      query: 'SELECT * FROM students WHERE user_id = ?',
      values: [userId]
    })
  }
  return profile
} 