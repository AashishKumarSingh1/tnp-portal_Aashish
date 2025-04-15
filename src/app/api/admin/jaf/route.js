import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { sendJAFStatusUpdateEmail } from '@/lib/email'
// Get all JAFs with company details
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
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
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const body = await req.json()
    const { id, status, remarks } = body

    if (!id || !status) {
      return new Response(JSON.stringify({ error: 'ID and status are required' }), { status: 400 })
    }

    // Use rejection_reason column instead of remarks
    await executeQuery({
      query: `
        UPDATE job_announcements 
        SET status = ?, rejection_reason = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `,
      values: [status, remarks || null, id]
    })

    // Log the activity
    await executeQuery({
      query: `
        INSERT INTO activity_logs 
        (user_id, action, details) 
        VALUES (?, ?, ?)
      `,
      values: [
        session.user.id,
        'UPDATE_JAF_STATUS',
        JSON.stringify({
          jaf_id: id,
          new_status: status,
          remarks: remarks || null
        })
      ]
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
    await sendJAFStatusUpdateEmail(jaf.company_name, status, jaf.email);
    return new Response(JSON.stringify({ 
      success: true,
      message: `JAF ${status.toLowerCase()} successfully` 
    }), { status: 200 })

  } catch (error) {
    console.error('Error updating JAF:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to update JAF',
      message: error.message
    }), { status: 500 })
  }
} 