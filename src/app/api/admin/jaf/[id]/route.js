import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['admin', 'super-admin'].includes(session.user.role)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

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
      values: [params.id]
    })

    if (!jaf) {
      return new Response(JSON.stringify({ error: 'JAF not found' }), { status: 404 })
    }

    const applications = await executeQuery({
      query: `
        SELECT 
          sa.*,
          u.name as student_name,
          u.email as student_email,
          u.registration_number
        FROM student_applications sa
        JOIN users u ON sa.student_id = u.id
        WHERE sa.jaf_id = ?
        ORDER BY sa.applied_at DESC
      `,
      values: [params.id]
    })

    return new Response(JSON.stringify({ ...jaf, applications }), { status: 200 })
  } catch (error) {
    console.error('Error fetching JAF details:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
} 