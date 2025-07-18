import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendVerificationConfirmationEmail } from '@/lib/email'
import { sendVerificationRejectionEmail } from '@/lib/email'

// Get pending student verifications
export async function GET(request) {
  
  try {
  const session = await getServerSession(authOptions)
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const students = await executeQuery({
      query: `
        SELECT 
          s.id,
          s.full_name,
          s.roll_number,
          s.branch,
          s.current_year,
          s.cgpa,
          s.phone,
          s.passing_year,
          s.is_email_verified,
          s.is_verified_by_admin,
          u.email,
          u.created_at as registration_date
        FROM students s
        JOIN users u ON u.id = s.user_id
        WHERE s.is_email_verified = true 
        AND s.is_verified_by_admin = false
        ORDER BY s.created_at DESC
      `
    })

    return NextResponse.json(students)

  } catch (error) {
    console.error('Error fetching pending students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending students' },
      { status: 500 }
    )
  }
}


export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { studentId, action } = await request.json()

    if (!studentId || !action) {
      return NextResponse.json(
        { error: 'Student ID and action are required' },
        { status: 400 }
      )
    }

    
    const [student] = await executeQuery({
      query: `
        SELECT s.full_name, u.email ,s.roll_number
        FROM students s
        JOIN users u ON u.id = s.user_id
        WHERE s.id = ?
      `,
      values: [studentId]
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

   if(action === 'verify'){
    const result = await executeQuery({
      query: `
        UPDATE students s
        SET s.is_verified_by_admin = ?
        WHERE s.id = ?
      `,
      values: [action === 'verify' ? 1 : 0, studentId]
    })

    
    if (action === 'verify') {
      await sendVerificationConfirmationEmail(student.email, student.full_name)
    }}
    else{
      const result = await executeQuery({
        query: `
          DELETE FROM students s
          WHERE s.id = ?
        `,
        values: [studentId]
      })
      const userResult = await executeQuery({
        query: `
          DELETE FROM users u
          WHERE u.id = ?
        `,
        values: [studentId]
      });
      await sendVerificationRejectionEmail(student.email, student.full_name, student.roll_number)
    }
    

    
    await executeQuery({
      query: `
        INSERT INTO activity_logs
        (user_id, action, details, ip_address)
        VALUES (?, ?, ?, ?)
      `,
      values: [
        session.user.id,
        'STUDENT VERIFICATION',
        JSON.stringify({ studentId, action, studentName: student.full_name, roll_number: student.roll_number }),
        '127.0.0.1'
      ]
    })

    return NextResponse.json({
      message: `Student ${action === 'verify' ? 'verified' : 'rejected'} successfully`
    })

  } catch (error) {
    console.error('Error verifying student:', error)
    return NextResponse.json(
      { error: 'Failed to verify student' },
      { status: 500 }
    )
  }
} 