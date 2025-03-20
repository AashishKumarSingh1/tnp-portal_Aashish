import { NextResponse } from 'next/server'
import { verifyOTP, markUserVerified, getUserByEmail } from '@/lib/db'

export async function POST(request) {
  try {
    const { email, otp } = await request.json()

    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.is_verified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      )
    }

    // Verify OTP
    const validOTP = await verifyOTP(email, otp, 'registration')
    if (!validOTP) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // Mark user as verified
    await markUserVerified(user.id)

    return NextResponse.json({
      message: 'Email verified successfully'
    })
  } catch (error) {
    console.error('Verification Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 