import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { sendJAFStatusUpdateEmail } from '@/lib/email'
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
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
    const jaf = await executeQuery({
      query: `
        SELECT company_name, email 
        FROM job_announcements ja 
        LEFT JOIN companies c ON ja.company_id = c.id 
        WHERE ja.id = ?
      `,
      values: [id]
    })
    await sendJAFStatusUpdateEmail(jaf.company_name, job_status, jaf.email);

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error('Error updating job status:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
} 