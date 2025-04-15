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

    const { userIds, isActive, reason } = await request.json()

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'User IDs are required' },
        { status: 400 }
      )
    }

    // First get all user details
    const users = await executeQuery({
      query: `
        SELECT 
          u.*,
          COALESCE(s.full_name, c.company_name, u.name) as name
        FROM users u
        LEFT JOIN students s ON u.id = s.user_id
        LEFT JOIN companies c ON u.id = c.user_id
        WHERE u.id IN (?)
      `,
      values: [userIds]
    })

    if (!users.length) {
      return NextResponse.json(
        { error: 'No users found' },
        { status: 404 }
      )
    }

    // Update all users' status
    await executeQuery({
      query: `
        UPDATE users 
        SET 
          is_active = ?,
          deactivation_reason = ?
        WHERE id IN (?)
      `,
      values: [isActive, !isActive ? reason : null, userIds]
    })

    // Send emails to all users
    const emailResults = await Promise.all(
      users.map(user => 
        sendAccountStatusEmail(
          {
            name: user.name || 'User',
            email: user.email
          },
          isActive,
          reason
        )
      )
    )

    const successfulEmails = emailResults.filter(Boolean).length
    const failedEmails = emailResults.length - successfulEmails

    if (failedEmails > 0) {
      console.error(`Failed to send ${failedEmails} status update emails`)
    }

    return NextResponse.json({
      message: `${users.length} accounts ${isActive ? 'activated' : 'deactivated'} successfully`,
      emailsSent: successfulEmails,
      emailsFailed: failedEmails
    })
  } catch (error) {
    console.error('Error in bulk toggle status:', error)
    return NextResponse.json(
      { error: 'Failed to update account statuses' },
      { status: 500 }
    )
  }
} 