import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
    if (!session || !['SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  try {
    const companies = await executeQuery({
      query: `
        SELECT 
          c.*,
          u.email as user_email,
          u.created_at as registration_date
        FROM companies c
        JOIN users u ON c.user_id = u.id
        WHERE c.is_verified_by_admin = false
        ORDER BY c.created_at DESC
      `
    })
    
    return NextResponse.json({ companies })
  } catch (error) {
    console.error('Error fetching pending companies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending companies' },
      { status: 500 }
    )
  }
} 