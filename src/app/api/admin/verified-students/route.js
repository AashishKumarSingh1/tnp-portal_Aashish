import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  try {
    const students = await executeQuery({
      query: `
        SELECT 
        s.*,
        u.email,
        u.created_at,
        u.is_active
        FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE u.role_id = 3
        AND u.is_verified = true
        AND s.is_verified_by_admin = 1
        ORDER BY u.created_at DESC;
      `,
    })

    return NextResponse.json({ students })
  } catch (error) {
    console.error('Failed to fetch verified students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
} 