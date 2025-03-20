import { NextResponse } from 'next/server'
import { getUserByEmail, createOTP } from '@/lib/db'
import { sendOTP } from '@/lib/email'

export async function POST(request) {
  try {
    const { email } = await request.json()

    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Save OTP in database
    await createOTP(email, otp, 'password_reset')

    // Send OTP via email
    const emailSent = await sendOTP(email, otp, 'password_reset')
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Password reset OTP sent successfully'
    })
  } catch (error) {
    console.error('Forgot Password Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 