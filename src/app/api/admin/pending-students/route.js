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
        SELECT s.*, u.email, u.created_at
        FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE s.is_verified_by_admin = false
        ORDER BY u.created_at DESC
      `
    })
    
    return NextResponse.json({ students })
  } catch (error) {
    console.error('Error fetching pending students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending students' },
      { status: 500 }
    )
  }
} 