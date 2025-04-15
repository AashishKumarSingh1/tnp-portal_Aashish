import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { executeQuery } from '@/lib/db'
import { sendAccountStatusEmail } from '@/lib/email'

export async function POST(request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions)
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    const { userId, isActive, reason } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // First get user details including email and name
    const [user] = await executeQuery({
      query: `
        SELECT 
          u.*,
          COALESCE(s.full_name, c.company_name, u.name) as name
        FROM users u
        LEFT JOIN students s ON u.id = s.user_id
        LEFT JOIN companies c ON u.id = c.user_id
        WHERE u.id = ?
      `,
      values: [userId]
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user status
    await executeQuery({
      query: `
        UPDATE users 
        SET 
          is_active = ?,
          deactivation_reason = ?
        WHERE id = ?
      `,
      values: [isActive, !isActive ? reason : null, userId]
    })

    // Log the action
    await executeQuery({
      query: `
        INSERT INTO activity_logs (user_id, action, details)
        VALUES (?, ?, ?)
      `,
      values: [
        session.user.id,
        isActive ? 'ENABLE_USER' : 'DISABLE_USER',
        JSON.stringify({
          target_user_id: userId,
          reason: reason || 'Not specified'
        })
      ]
    })

    // Send email notification with proper user details
    const emailSent = await sendAccountStatusEmail(
      { 
        name: user.name || 'User',
        email: user.email
      },
      isActive,
      reason
    )

    if (!emailSent) {
      console.error('Failed to send status update email to:', user.email)
    }

    return NextResponse.json({
      message: `Account ${isActive ? 'activated' : 'deactivated'} successfully`,
      emailSent
    })
  } catch (error) {
    console.error('Error toggling user status:', error)
    return NextResponse.json(
      { error: 'Failed to update account status' },
      { status: 500 }
    )
  }
} 