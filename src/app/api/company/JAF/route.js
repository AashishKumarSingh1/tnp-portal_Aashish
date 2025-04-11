import { executeQuery } from '@/lib/db'
import { sendJAFNotificationEmail } from '@/lib/email'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'COMPANY') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401 
      })
    }

    const formData = await req.formData()
    
    // Get company ID from session
    const [company] = await executeQuery({
      query: 'SELECT id FROM companies WHERE user_id = ?',
      values: [session.user.id]
    })

    if (!company) {
      return new Response(JSON.stringify({ error: 'Company not found' }), { 
        status: 404 
      })
    }

    // Use file URL instead of uploading file
    const jobDescriptionUrl = formData.get('job_description_url') || null
    
    // Insert JAF into database
    const result = await executeQuery({
      query: `
        INSERT INTO job_announcements (
          company_id, job_profile, mode_of_hiring, place_of_posting,
          ctc_breakdown, offer_type, eligible_batches, eligible_branches,
          eligible_degrees, selection_process, total_rounds, min_offers,
          job_description_file, last_date_to_apply, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        company.id,
        formData.get('job_profile'),
        formData.get('mode_of_hiring'),
        formData.get('place_of_posting'),
        formData.get('ctc_breakdown'),
        formData.get('offer_type'),
        formData.get('eligible_batches'),
        formData.get('eligible_branches'),
        formData.get('eligible_degrees'),
        formData.get('selection_process'),
        formData.get('total_rounds'),
        formData.get('min_offers'),
        jobDescriptionUrl,
        formData.get('last_date_to_apply'),
        session.user.id
      ]
    })

    // Send notification email to admin
    await sendJAFNotificationEmail(company.company_name)

    return new Response(JSON.stringify({ success: true }), { 
      status: 200 
    })
  } catch (error) {
    console.error('Error submitting JAF:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500 
    })
  }
}

// Get list of JAFs
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    let query = ''
    let values = []

    // Make case-insensitive checks for role
    const userRole = session.user.role.toUpperCase()
    
    if (userRole === 'COMPANY') {
      // Companies can only see their own JAFs
      query = `
        SELECT 
          ja.*,
          COUNT(sa.id) as application_count,
          c.company_name
        FROM job_announcements ja
        LEFT JOIN companies c ON ja.company_id = c.id
        LEFT JOIN student_applications sa ON ja.id = sa.jaf_id
        WHERE c.user_id = ?
        GROUP BY ja.id
        ORDER BY ja.created_at DESC
      `
      values = [session.user.id]
    } else if (['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      // Admins can see all JAFs
      query = `
        SELECT 
          ja.*,
          COUNT(sa.id) as application_count,
          c.company_name
        FROM job_announcements ja
        LEFT JOIN companies c ON ja.company_id = c.id
        LEFT JOIN student_applications sa ON ja.id = sa.jaf_id
        GROUP BY ja.id
        ORDER BY ja.created_at DESC
      `
    }

    const jafs = await executeQuery({ query, values })
    return new Response(JSON.stringify(jafs), { status: 200 })
  } catch (error) {
    console.error('Error fetching JAFs:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
} 
