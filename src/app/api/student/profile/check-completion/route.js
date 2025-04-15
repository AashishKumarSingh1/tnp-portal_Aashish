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

    // Check all required tables for student data
    const results = await executeQuery({
      query: `SELECT 
        (SELECT COUNT(*) FROM students WHERE user_id = ?) as has_personal,
        (SELECT COUNT(*) FROM student_academics WHERE student_id = (SELECT id FROM students WHERE user_id = ?)) as has_academics,
        (SELECT COUNT(*) FROM student_documents WHERE student_id = (SELECT id FROM students WHERE user_id = ?)) as has_documents,
        (SELECT COUNT(*) FROM student_job_preferences WHERE student_id = (SELECT id FROM students WHERE user_id = ?)) as has_preferences
      `,
      values: [session.user.id, session.user.id, session.user.id, session.user.id]
    })

    if (!results || results.length === 0) {
      return NextResponse.json({ success: false, message: 'Failed to check profile' }, { status: 500 })
    }

    const data = results[0]
    const isComplete = (
      data.has_personal > 0 &&
      data.has_academics > 0 &&
      data.has_documents > 0 &&
      data.has_preferences > 0
    )

    return NextResponse.json({
      success: true,
      isComplete,
      missing: {
        personal: data.has_personal === 0,
        academics: data.has_academics === 0,
        documents: data.has_documents === 0,
        preferences: data.has_preferences === 0
      }
    })
  } catch (error) {
    console.error('Error in /api/student/profile/check-completion:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 