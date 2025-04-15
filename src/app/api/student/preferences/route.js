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

    // Get preferences
    const preferences = await executeQuery({
      query: 'SELECT * FROM student_job_preferences WHERE student_id = ?',
      values: [student[0].id]
    })

    return NextResponse.json({
      success: true,
      preferences: preferences[0] || null
    })
  } catch (error) {
    console.error('Error in /api/student/preferences:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    // Get student ID
    const student = await executeQuery({
      query: 'SELECT id FROM students WHERE user_id = ?',
      values: [session.user.id]
    })

    if (!student || student.length === 0) {
      return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 })
    }

    const studentId = student[0].id

    // Check if preferences exist
    const existingPrefs = await executeQuery({
      query: 'SELECT id FROM student_job_preferences WHERE student_id = ?',
      values: [studentId]
    })

    if (existingPrefs && existingPrefs.length > 0) {
      // Update existing preferences
      await executeQuery({
        query: `UPDATE student_job_preferences 
                SET preferred_sectors = ?,
                    preferred_locations = ?,
                    expected_salary = ?,
                    willing_to_relocate = ?,
                    linkedin_url = ?,
                    github_url = ?,
                    portfolio_url = ?,
                    updated_at = NOW()
                WHERE student_id = ?`,
        values: [
          JSON.stringify(data.preferred_sectors),
          JSON.stringify(data.preferred_locations),
          data.expected_salary,
          data.willing_to_relocate,
          data.linkedin_url,
          data.github_url,
          data.portfolio_url,
          studentId
        ]
      })
    } else {
      // Insert new preferences
      await executeQuery({
        query: `INSERT INTO student_job_preferences 
                (student_id, preferred_sectors, preferred_locations, expected_salary,
                 willing_to_relocate, linkedin_url, github_url, portfolio_url,
                 created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        values: [
          studentId,
          JSON.stringify(data.preferred_sectors),
          JSON.stringify(data.preferred_locations),
          data.expected_salary,
          data.willing_to_relocate,
          data.linkedin_url,
          data.github_url,
          data.portfolio_url
        ]
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Job preferences updated successfully'
    })
  } catch (error) {
    console.error('Error in /api/student/preferences:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 