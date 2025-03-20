import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { sendOTP } from '@/lib/email'
import { generateOTP } from '@/lib/utils'

export async function POST(req) {
  try {
    const { email, type } = await req.json()

    if (!email || !type) {
      return NextResponse.json({ error: 'Email and type are required' }, { status: 400 })
    }

    // Get the previous OTP record to preserve registration data
    const previousOTP = await executeQuery({
      query: `
        SELECT registration_data
        FROM otps 
        WHERE email = ? 
        AND type = ?
        AND registration_data IS NOT NULL
        ORDER BY created_at DESC 
        LIMIT 1
      `,
      values: [email, type]
    })

    // Generate new OTP
    const otp = generateOTP()
    const otpExpiry = new Date()
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10)

    // Set timezone to UTC
    await executeQuery({
      query: 'SET time_zone = "+00:00"'
    })

    // Store new OTP with previous registration data if exists
    await executeQuery({
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
        email,
        otp,
        type,
        otpExpiry,
        previousOTP?.[0]?.registration_data || null
      ]
    })

    // Send new OTP
    await sendOTP(email, otp, type)

    return NextResponse.json({ 
      message: 'New verification code sent. Please check your email.',
      email 
    })

  } catch (error) {
    console.error('Resend OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to resend verification code: ' + error.message },
      { status: 500 }
    )
  }
} 