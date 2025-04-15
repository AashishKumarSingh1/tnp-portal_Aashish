import { NextResponse } from 'next/server'
import { executeQuery, executeTransaction } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logActivity } from '@/app/api/admin/activity-logs/route'
import { sendVerificationConfirmationEmail } from '@/lib/email'
export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions)
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  try {
    const { id } = params
    const data = await req.json()

    // Update student information
    await executeQuery({
      query: `
        UPDATE students s
        JOIN users u ON s.user_id = u.id
        SET 
          s.full_name = ?,
          s.roll_number = ?,
          s.branch = ?,
          s.current_year = ?,
          s.cgpa = ?,
          s.passing_year = ?,
          s.phone = ?,
          u.email = ?
        WHERE s.id = ?
      `,
      values: [
        data.full_name,
        data.roll_number,
        data.branch,
        data.current_year,
        data.cgpa,
        data.passing_year,
        data.phone,
        data.email,
        id
      ]
    })
    await logActivity(session.user.id, 'UPDATE_STUDENT', {
      studentId: id,
      changes: data
    })

    await sendVerificationConfirmationEmail(data.email, data.full_name);
    return NextResponse.json({ message: 'Student updated successfully' })
  } catch (error) {
    console.error('Failed to update student:', error)
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    )
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params

    // Get the user_id first
    const [student] = await executeQuery({
      query: 'SELECT user_id FROM students WHERE id = ?',
      values: [id]
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Delete records in the correct order using a transaction
    await executeTransaction([
      {
        // First, delete from activity_logs
        query: 'DELETE FROM activity_logs WHERE user_id = ?',
        values: [student.user_id]
      },
      {
        // Then delete from students
        query: 'DELETE FROM students WHERE id = ?',
        values: [id]
      },
      {
        // Finally delete from users
        query: 'DELETE FROM users WHERE id = ?',
        values: [student.user_id]
      }
    ])

    return NextResponse.json({ message: 'Student deleted successfully' })
  } catch (error) {
    console.error('Failed to delete student:', error)
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    )
  }
} 