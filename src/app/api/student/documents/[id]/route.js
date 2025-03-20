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

    const documentId = params.id

    // First verify ownership using proper joins
    const [document] = await executeQuery({
      query: `
        SELECT sd.* 
        FROM student_documents sd
        JOIN students s ON sd.student_id = s.id
        WHERE sd.id = ? AND s.user_id = ?
      `,
      values: [documentId, session.user.id]
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Delete the document
    await executeQuery({
      query: 'DELETE FROM student_documents WHERE id = ?',
      values: [documentId]
    })

    return NextResponse.json({ message: 'Document deleted successfully' })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
} 