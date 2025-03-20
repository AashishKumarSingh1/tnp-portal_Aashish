import { NextResponse } from 'next/server'
import { verifyOTP, executeQuery } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json()

    // Verify the OTP
    const isValid = await verifyOTP(email, otp, 'password_reset')
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update the user's password
    await executeQuery({
      query: 'UPDATE users SET password = ? WHERE email = ?',
      values: [hashedPassword, email],
    })

    return NextResponse.json({ message: 'Password reset successful' })
  } catch (error) {
    console.error('Reset Password Error:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
} 