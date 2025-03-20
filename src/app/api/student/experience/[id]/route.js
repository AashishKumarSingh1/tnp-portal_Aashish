import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const experienceId = params.id

    // Verify ownership before deletion
    const [experience] = await executeQuery({
      query: `
        SELECT se.* FROM student_experience se
        JOIN students s ON se.student_id = s.id
        WHERE se.id = ? AND s.user_id = ?
      `,
      values: [experienceId, session.user.id]
    })

    if (!experience) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      )
    }

    // Delete experience
    await executeQuery({
      query: 'DELETE FROM student_experience WHERE id = ?',
      values: [experienceId]
    })

    return NextResponse.json({ message: 'Experience deleted successfully' })
  } catch (error) {
    console.error('Error deleting experience:', error)
    return NextResponse.json(
      { error: 'Failed to delete experience' },
      { status: 500 }
    )
  }
} 