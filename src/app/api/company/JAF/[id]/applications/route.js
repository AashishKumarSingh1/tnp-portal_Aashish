import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const jafId = params.id
    const userRole = session.user.role.toUpperCase()

    // First verify access
    if (userRole === 'COMPANY') {
      const [access] = await executeQuery({
        query: `
          SELECT 1 FROM job_announcements j
          JOIN companies c ON j.company_id = c.id
          WHERE j.id = ? AND c.user_id = ?
        `,
        values: [jafId, session.user.id]
      })

      if (!access) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 })
      }
    }

    // Get applications with correct column names
    const applications = await executeQuery({
      query: `
        SELECT 
          sa.id,
          sa.student_id,
          sa.jaf_id,
          sa.status,
          sa.current_round,
          sa.applied_at,
          sa.updated_at,
          u.name as student_name,
          u.email as student_email,
          u.registration_number
        FROM student_applications sa
        JOIN users u ON sa.student_id = u.id
        WHERE sa.jaf_id = ?
        ORDER BY sa.applied_at DESC
      `,
      values: [jafId]
    })

    return new Response(JSON.stringify(applications), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error fetching applications:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), { status: 500 })
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['COMPANY', 'ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const body = await req.json()
    const { applicationId, status, remarks } = body

    if (!applicationId || !status) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), { status: 400 })
    }

    // Validate status enum value
    const validStatuses = ['Applied', 'Shortlisted', 'In Process', 'Selected', 'Rejected']
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid status value' 
      }), { status: 400 })
    }

    await executeQuery({
      query: `
        UPDATE student_applications 
        SET 
          status = ?,
          remarks = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND jaf_id = ?
      `,
      values: [status, remarks || null, applicationId, params.id]
    })

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Application updated successfully'
    }), { status: 200 })

  } catch (error) {
    console.error('Error updating application:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), { status: 500 })
  }
} 