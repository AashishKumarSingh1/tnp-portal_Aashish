import { NextResponse } from 'next/server'
import { executeQuery, executeTransaction } from '@/lib/db'
import { hash } from 'bcryptjs'

export async function POST(req) {
  try {
    const { email, otp } = await req.json()

    console.log('Verifying registration:', { email, otp })

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
    }

    // Set timezone to UTC
    await executeQuery({
      query: 'SET time_zone = "+00:00"'
    })

    // Get OTP record
    const otpResult = await executeQuery({
      query: `
        SELECT id, otp, 
               expires_at,
               CONVERT_TZ(expires_at, '+00:00', '+05:30') as ist_expiry,
               CONVERT_TZ(created_at, '+00:00', '+05:30') as ist_created,
               used, registration_data, created_at
        FROM otps 
        WHERE email = ? 
        AND type = 'registration'
        ORDER BY created_at DESC 
        LIMIT 1
      `,
      values: [email]
    })

    console.log('OTP record found:', otpResult[0])

    if (!otpResult?.length) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
    }

    const otpRecord = otpResult[0]

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return NextResponse.json({ 
        error: 'Invalid verification code',
        debug: { provided: otp, stored: otpRecord.otp }
      }, { status: 400 })
    }

    if (otpRecord.used) {
      return NextResponse.json({ error: 'Verification code already used' }, { status: 400 })
    }

    // Check expiry using UTC time
    const expiryTime = new Date(otpRecord.expires_at)
    const currentTime = new Date()

    console.log('Time comparison:', {
      expiry: expiryTime.toISOString(),
      current: currentTime.toISOString(),
      ist_expiry: otpRecord.ist_expiry,
      ist_created: otpRecord.ist_created
    })

    if (currentTime > expiryTime) {
      return NextResponse.json({ 
        error: 'Verification code expired',
        debug: {
          expiry: otpRecord.ist_expiry,
          current: new Date().toISOString()
        }
      }, { status: 400 })
    }

    if (!otpRecord.registration_data) {
      console.error('Missing registration data for OTP:', otpRecord)
      return NextResponse.json({ 
        error: 'Invalid registration data',
        debug: { 
          otpId: otpRecord.id,
          created: otpRecord.ist_created
        }
      }, { status: 400 })
    }

    // Use the registration data directly since MySQL already parsed it
    const registrationData = otpRecord.registration_data
    console.log('Registration data:', registrationData)

    const { type, password, email: userEmail, ...userData } = registrationData

    try {
      // Hash password before storing
      const hashedPassword = await hash(password, 12)

      // Prepare queries for transaction
      const queries = []

      // Insert user with hashed password
      queries.push({
        query: `
          INSERT INTO users (
            email, password, role_id, is_verified, is_active,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())
        `,
        values: [email, hashedPassword, type === 'student' ? 3 : 4, true, true]
      })

      // Insert role-specific data
      if (type === 'student') {
        queries.push({
          query: `
            INSERT INTO students (
              user_id, full_name, roll_number, phone, 
              branch, current_year, cgpa, passing_year,
              is_email_verified, is_verified_by_admin,
              created_at, updated_at
            ) VALUES (
              LAST_INSERT_ID(), ?, ?, ?, ?, ?, ?, ?,
              true, false,
              UTC_TIMESTAMP(), UTC_TIMESTAMP()
            )
          `,
          values: [
            userData.full_name,
            userData.roll_number,
            userData.phone,
            userData.branch,
            userData.current_year,
            userData.cgpa,
            userData.passing_year
          ]
        })
      } else {
        queries.push({
          query: `
            INSERT INTO companies (
              user_id, company_name, website, email, phone,
              description, contact_person_name, contact_person_designation,
              is_email_verified, is_verified_by_admin,
              created_at, updated_at
            ) VALUES (
              LAST_INSERT_ID(), ?, ?, ?, ?, ?, ?, ?,
              true, false,
              UTC_TIMESTAMP(), UTC_TIMESTAMP()
            )
          `,
          values: [
            userData.company_name,
            userData.website,
            email,
            userData.phone,
            userData.description,
            userData.contact_person_name,
            userData.contact_person_designation
          ]
        })
      }

      // Mark OTP as used
      queries.push({
        query: 'UPDATE otps SET used = true WHERE id = ?',
        values: [otpRecord.id]
      })

      // Execute all queries in a transaction
      await executeTransaction(queries)

      return NextResponse.json({
        message: type === 'company' 
          ? 'Registration successful. Please wait for admin verification before logging in.'
          : 'Registration successful. Please login.'
      })

    } catch (error) {
      console.error('Registration verification error:', error)
      return NextResponse.json(
        { error: 'Failed to complete registration: ' + error.message },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Registration verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify registration: ' + error.message },
      { status: 500 }
    )
  }
} 