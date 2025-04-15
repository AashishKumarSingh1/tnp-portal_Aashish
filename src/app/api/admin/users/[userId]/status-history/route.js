import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { executeQuery } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    const userId = params.userId
    
    const history = await executeQuery({
      query: `
        SELECT 
          h.*,
          CONCAT(u.name, ' (', r.name, ')') as changed_by_name
        FROM account_status_history h
        JOIN users u ON h.changed_by = u.id
        JOIN roles r ON u.role_id = r.id
        WHERE h.user_id = ?
        ORDER BY h.created_at DESC
      `,
      values: [userId]
    })

    return NextResponse.json({ history })
  } catch (error) {
    console.error('Status history error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 