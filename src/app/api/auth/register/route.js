import { NextResponse } from 'next/server'
import { z } from 'zod'
import { executeQuery } from '@/lib/db'
import { sendOTP } from '@/lib/email'
import { hash } from 'bcryptjs'
import { generateOTP } from '@/lib/utils'

// Validation schemas
const studentSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  rollNumber: z.string(),
  phone: z.string().min(10),
  branch: z.string(),
  currentYear: z.string(),
  cgpa: z.number(),
  passingYear: z.number()
})

const companySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  companyName: z.string().min(2),
  website: z.string().url(),
  description: z.string().min(5),
  contactPersonName: z.string().min(2),
  contactPersonDesignation: z.string().min(2),
  phone: z.string().min(10)
})

export async function POST(req) {
  try {
    const body = await req.json()
    const { type, ...data } = body

    console.log('Registration data received:', { type, ...data })

    // Transform data to match database schema
    let transformedData = { ...data }
    if (type === 'company') {
      transformedData = {
        email: data.email,
        password: data.password,
        company_name: data.companyName,
        website: data.website,
        phone: data.phone,
        description: data.description,
        contact_person_name: data.contactPersonName,
        contact_person_designation: data.contactPersonDesignation,
        address: data.address || 'TBD',
        city: data.city || 'TBD',
        state: data.state || 'TBD',
        country: data.country || 'TBD',
        pin_code: data.pin_code || '000000'
      }
    } else if (type === 'student') {
      transformedData = {
        email: data.email,
        password: data.password,
        full_name: data.fullName,
        roll_number: data.rollNumber,
        phone: data.phone,
        branch: data.branch,
        current_year: data.currentYear,
        cgpa: data.cgpa,
        passing_year: data.passingYear
      }
    }

    // Validate input data
    try {
      if (type === 'student') {
        await studentSchema.parseAsync(data)
      } else if (type === 'company') {
        await companySchema.parseAsync(data)
      } else {
        return NextResponse.json({ error: 'Invalid registration type' }, { status: 400 })
      }
    } catch (validationError) {
      console.error('Validation error:', validationError)
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationError.errors 
      }, { status: 400 })
    }

    // Check for existing email
    const existingEmail = await executeQuery({
      query: 'SELECT email FROM users WHERE email = ?',
      values: [data.email]
    })

    if (existingEmail?.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    // Generate OTP
    const otp = generateOTP()
    
    // Set expiry time (10 minutes from now in UTC)
    const otpExpiry = new Date()
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10)

    // Hash password
    const hashedPassword = await hash(data.password, 12)

    // Prepare registration data
    const registrationData = {
      type,
      password: hashedPassword,
      ...transformedData
    }

    console.log('Storing registration data:', registrationData)

    // Store OTP and registration data
    try {
      // First, set the MySQL session timezone to UTC
      await executeQuery({
        query: 'SET time_zone = "+00:00"'
      })

      // Test JSON stringification before inserting
      const jsonData = JSON.stringify(registrationData)
      console.log('JSON data to store:', jsonData)

      const result = await executeQuery({
        query: `
          INSERT INTO otps (
            email, 
            otp, 
            type, 
            expires_at, 
            registration_data,
            created_at
          ) VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP())
        `,
        values: [
          data.email, 
          otp, 
          'registration', 
          otpExpiry,
          jsonData
        ]
      })

      console.log('OTP stored successfully:', result)

      // Verify data was stored correctly
      const storedOTP = await executeQuery({
        query: `
          SELECT 
            *, 
            CONVERT_TZ(expires_at, '+00:00', '+05:30') as ist_expiry,
            registration_data
          FROM otps 
          WHERE id = ?
        `,
        values: [result.insertId]
      })

      const stored = storedOTP[0]
      console.log('Stored OTP record:', {
        ...stored,
        registration_data: stored.registration_data ? 'present' : 'missing'
      })

      if (!stored.registration_data) {
        throw new Error('Registration data was not stored properly')
      }

      // Send verification email
      await sendOTP(data.email, otp, 'Registration')

      return NextResponse.json({ 
        message: 'Please check your email for verification code',
        email: data.email
      })

    } catch (error) {
      console.error('OTP generation error:', error)
      return NextResponse.json(
        { error: 'Failed to send verification email: ' + error.message },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to process registration: ' + error.message },
      { status: 500 }
    )
  }
} 