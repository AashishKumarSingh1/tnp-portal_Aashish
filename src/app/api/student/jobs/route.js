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

    // Get student details using correct columns from students table
    const student = await executeQuery({
      query: `SELECT s.id as student_id, s.*, 
              s.degree_type as degree,
              s.branch,
              s.passing_year as batch_year
              FROM students s 
              WHERE s.user_id = ?`,
      values: [session.user.id]
    })

    if (!student || student.length === 0) {
      return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 })
    }

    const studentData = student[0]
    const studentId = studentData.student_id;

    // Fetch jobs that match student's eligibility
    const jobs = await executeQuery({
      query: `SELECT 
                ja.*,
                c.company_name,
                CASE WHEN sa.student_id IS NOT NULL THEN true ELSE false END as hasApplied
              FROM job_announcements ja
              JOIN companies c ON ja.company_id = c.id
              LEFT JOIN student_applications sa ON ja.id = sa.jaf_id AND sa.student_id = ?
              WHERE 
                ja.job_status = 'Open'
                AND ja.last_date_to_apply >= CURDATE()
                AND JSON_CONTAINS(ja.eligible_batches, ?)
                AND JSON_CONTAINS(ja.eligible_branches, ?)
                AND JSON_CONTAINS(ja.eligible_degrees, ?)
              ORDER BY ja.created_at DESC`,
      values: [
        studentId,
        JSON.stringify(studentData.batch_year.toString()),
        JSON.stringify(studentData.branch),
        JSON.stringify(studentData.degree)
      ]
    })

    return NextResponse.json({ success: true, jobs })
  } catch (error) {
    console.error('Error in /api/student/jobs:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 