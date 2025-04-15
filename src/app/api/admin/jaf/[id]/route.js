import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { sendJAFStatusUpdateEmail } from '@/lib/email'
export async function GET(req, context) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { params } = context
    const jafId = await params.id

    const [jaf] = await executeQuery({
      query: `
        SELECT 
          ja.*,
          c.company_name,
          c.email,
          c.website,
          c.contact_person_name,
          c.contact_person_designation,
          c.phone
        FROM job_announcements ja
        LEFT JOIN companies c ON ja.company_id = c.id
        WHERE ja.id = ?
      `,
      values: [jafId]
    })

    if (!jaf) {
      return new Response(JSON.stringify({ error: 'JAF not found' }), { status: 404 })
    }

    const safeParseJSON = (data, defaultValue) => {
      if (!data) return defaultValue
      try {
        return typeof data === 'string' ? JSON.parse(data) : data
      } catch (e) {
        console.error('Error parsing JSON:', e)
        return defaultValue
      }
    }

    const applications = await executeQuery({
      query: `
        SELECT 
          sa.id,
          sa.student_id,
          sa.jaf_id,
          sa.status,
          sa.current_round,
          sa.remarks,
          sa.applied_at,
          sa.updated_at,
          s.full_name as student_name,
          s.roll_number,
          s.branch,
          s.cgpa,
          s.phone,
          s.degree_type,
          u.email,
          u.registration_number,
          GROUP_CONCAT(DISTINCT ar.round_number) as round_numbers,
          GROUP_CONCAT(DISTINCT ar.round_type) as round_types,
          (
            SELECT COUNT(DISTINCT ar2.id) 
            FROM application_rounds ar2 
            WHERE ar2.application_id = sa.id AND ar2.status = 'Cleared'
          ) as rounds_cleared
        FROM student_applications sa
        JOIN students s ON sa.student_id = s.id
        JOIN users u ON s.user_id = u.id
        LEFT JOIN application_rounds ar ON sa.id = ar.application_id
        WHERE sa.jaf_id = ?
        GROUP BY sa.id, sa.student_id, sa.jaf_id, sa.status, sa.current_round, 
          sa.remarks, sa.applied_at, sa.updated_at, student_name, roll_number, branch, 
          cgpa, phone, degree_type, email, registration_number
        ORDER BY sa.applied_at DESC
      `,
      values: [jafId]
    })

    const response = {
      ...jaf,
      eligible_batches: safeParseJSON(jaf.eligible_batches, []),
      eligible_branches: safeParseJSON(jaf.eligible_branches, []),
      eligible_degrees: safeParseJSON(jaf.eligible_degrees, []),
      selection_process: safeParseJSON(jaf.selection_process, {}),
      applications
    }

    return new Response(JSON.stringify(response), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error fetching JAF details:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), { status: 500 })
  }
}

export async function PUT(req, context) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { params } = context
    const jafId = await params.id
    const body = await req.json()
    const { status, remarks } = body

    if (!status) {
      return new Response(JSON.stringify({ error: 'Status is required' }), { status: 400 })
    }

    await executeQuery({
      query: `
        UPDATE job_announcements 
        SET 
          status = ?,
          rejection_reason = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      values: [status, remarks || null, jafId]
    })
    const jaf = await executeQuery({
      query: `
        SELECT company_name, email 
        FROM job_announcements ja 
        LEFT JOIN companies c ON ja.company_id = c.id 
        WHERE ja.id = ?
      `,
      values: [jafId]
    })
    await sendJAFStatusUpdateEmail(jaf.company_name, status, jaf.email);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'JAF status updated successfully'
    }), { status: 200 })

  } catch (error) {
    console.error('Error updating JAF status:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), { status: 500 })
  }
} 