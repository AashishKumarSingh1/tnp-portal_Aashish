import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    const students = await executeQuery({
      query: `
        SELECT 
          s.*,
          u.id as user_id,
          u.email,
          u.is_active,
          u.deactivation_reason
        FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE s.is_verified_by_admin = 1
        ORDER BY s.created_at DESC
      `
    })

    return NextResponse.json({ students })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 