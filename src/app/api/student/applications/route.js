import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    // Get student ID
    const student = await executeQuery({
      query: 'SELECT id FROM students WHERE user_id = ?',
      values: [session.user.id]
    })

    if (!student || student.length === 0) {
      return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 })
    }

    // Get applications with job and company details
    const applications = await executeQuery({
      query: `
        SELECT 
          sa.*,
          ja.job_profile,
          ja.job_description_file,
          ja.mode_of_hiring,
          ja.place_of_posting,
          ja.ctc_breakdown,
          ja.offer_type,
          ja.total_rounds,
          ja.selection_process,
          ja.eligible_batches,
          ja.eligible_branches,
          ja.eligible_degrees,
          ja.last_date_to_apply,
          c.company_name,
          c.email as company_email,
          c.website,
          ar.round_number,
          ar.round_type,
          ar.status as round_status,
          ar.remarks as round_remarks
        FROM student_applications sa
        JOIN job_announcements ja ON sa.jaf_id = ja.id
        JOIN companies c ON ja.company_id = c.id
        LEFT JOIN application_rounds ar ON sa.id = ar.application_id 
          AND ar.round_number = sa.current_round
        WHERE sa.student_id = ?
        ORDER BY sa.applied_at DESC
      `,
      values: [student[0].id]
    })

    return NextResponse.json({
      success: true,
      applications
    })
  } catch (error) {
    console.error('Error in /api/student/applications:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 