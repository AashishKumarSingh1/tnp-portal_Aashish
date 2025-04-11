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

    // Simplified query to reduce complexity
    const query = `
      SELECT 
        j.*,
        c.company_name,
        c.email,
        c.website,
        c.phone,
        c.contact_person_name,
        (SELECT COUNT(*) FROM student_applications sa WHERE sa.jaf_id = j.id) as application_count
      FROM job_announcements j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.id = ?
      ${userRole === 'COMPANY' ? 'AND c.user_id = ?' : ''}
    `

    const values = userRole === 'COMPANY' 
      ? [jafId, session.user.id]
      : [jafId]

    const [jaf] = await executeQuery({ query, values })

    if (!jaf) {
      return new Response(JSON.stringify({ error: 'JAF not found' }), { status: 404 })
    }

    // Safely parse JSON fields
    const safeParseJSON = (str, defaultValue) => {
      try {
        return str ? JSON.parse(str) : defaultValue
      } catch (e) {
        return defaultValue
      }
    }

    // Transform the response
    const response = {
      ...jaf,
      eligible_batches: safeParseJSON(jaf.eligible_batches, []),
      eligible_branches: safeParseJSON(jaf.eligible_branches, []),
      eligible_degrees: safeParseJSON(jaf.eligible_degrees, []),
      selection_process: safeParseJSON(jaf.selection_process, {})
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error fetching JAF:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), { status: 500 })
  }
} 