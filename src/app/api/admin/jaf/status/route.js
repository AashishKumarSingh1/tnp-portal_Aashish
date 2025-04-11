import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['admin', 'super-admin'].includes(session.user.role)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const data = await req.json()
    const { id, job_status } = data

    await executeQuery({
      query: `
        UPDATE job_announcements 
        SET job_status = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `,
      values: [job_status, id]
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error('Error updating job status:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
} 