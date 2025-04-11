import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Get all JAFs with company details
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['admin', 'super-admin'].includes(session.user.role)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const jafs = await executeQuery({
      query: `
        SELECT 
          ja.*,
          c.company_name,
          c.email,
          COUNT(sa.id) as application_count
        FROM job_announcements ja
        LEFT JOIN companies c ON ja.company_id = c.id
        LEFT JOIN student_applications sa ON ja.id = sa.jaf_id
        GROUP BY ja.id
        ORDER BY ja.created_at DESC
      `
    })

    return new Response(JSON.stringify(jafs), { status: 200 })
  } catch (error) {
    console.error('Error fetching JAFs:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}

// Update JAF status
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['admin', 'super-admin'].includes(session.user.role)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const data = await req.json()
    const { id, status, remarks } = data

    await executeQuery({
      query: `
        UPDATE job_announcements 
        SET status = ?, remarks = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `,
      values: [status, remarks || null, id]
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error('Error updating JAF:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
} 