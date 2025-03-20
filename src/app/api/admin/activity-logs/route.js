import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const offset = (page - 1) * limit

    // Get total count
    const countResult = await executeQuery({
      query: 'SELECT COUNT(*) as total FROM activity_logs'
    })
    const total = countResult[0]?.total || 0

    // Get activity logs with user information
    const logs = await executeQuery({
      query: `
        SELECT 
          al.id,
          al.action,
          al.details,
          al.ip_address,
          al.user_agent,
          al.created_at,
          u.id as user_id,
          u.email as user_email,
          u.name as user_name,
          u.profile_image as user_profile_image,
          r.name as role_name
        FROM activity_logs al
        LEFT JOIN users u ON al.user_id = u.id
        LEFT JOIN roles r ON u.role_id = r.id
        ORDER BY al.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    })

    if (!Array.isArray(logs)) {
      throw new Error('Invalid response format from database')
    }

    return NextResponse.json({
      logs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit
      }
    })
  } catch (error) {
    console.error('Get Activity Logs Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
      { status: 500 }
    )
  }
}

// Helper function to log activity
export async function logActivity(userId, action, details, req) {
  if (!userId || !action || !details || !req) {
    console.error('Missing required parameters for activity logging')
    return
  }

  try {
    const result = await executeQuery({
      query: `
        INSERT INTO activity_logs (
          user_id, 
          action, 
          details, 
          ip_address, 
          user_agent,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, NOW())
      `,
      values: [
        userId,
        action,
        details,
        req.headers.get('x-forwarded-for') || req.ip || 'unknown',
        req.headers.get('user-agent') || 'unknown'
      ]
    })

    if (!result || !result.insertId) {
      throw new Error('Failed to insert activity log')
    }

    return result.insertId
  } catch (error) {
    console.error('Log Activity Error:', error)
    // Don't throw the error to prevent disrupting the main operation
    return null
  }
} 