import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

const DOCUMENT_TYPES = {
  PROFILE_PHOTO: 'profile_photo',
  RESUME: 'resume',
  TENTH_MARKSHEET: 'tenth_marksheet',
  TWELFTH_MARKSHEET: 'twelfth_marksheet',
  BTECH_MARKSHEET: 'btech_marksheet',
  MTECH_MARKSHEET: 'mtech_marksheet',
  PHD_MARKSHEET: 'phd_marksheet',
  AADHAR_CARD: 'aadhar_card',
  PAN_CARD: 'pan_card',
  CATEGORY_CERTIFICATE: 'category_certificate',
  PH_CERTIFICATE: 'ph_certificate'
}

// GET endpoint to fetch student documents
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // First get the student_id using user_id from session
    const [student] = await executeQuery({
      query: 'SELECT id FROM students WHERE user_id = ?',
      values: [session.user.id]
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Then use student.id to fetch documents
    const documents = await executeQuery({
      query: `
        SELECT 
          sd.id,
          sd.document_type,
          sd.document_url as file_url,
          sd.caption as file_name,
          sd.created_at,
          sd.updated_at
        FROM student_documents sd
        WHERE sd.student_id = ?
      `,
      values: [student.id]
    })

    // Convert array to object with document_type as keys
    const documentMap = {}
    documents.forEach(doc => {
      documentMap[doc.document_type] = {
        id: doc.id,
        file_url: doc.file_url,
        file_name: doc.file_name,
        created_at: doc.created_at,
        updated_at: doc.updated_at
      }
    })

    return NextResponse.json(documentMap)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

// POST endpoint to add/update document
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [student] = await executeQuery({
      query: 'SELECT id FROM students WHERE user_id = ?',
      values: [session.user.id]
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const data = await request.json()
    const { document_type, file_url, file_name } = data

    // For resume and marksheet, replace if exists, for certificates add new
    if (document_type === DOCUMENT_TYPES.RESUME || document_type === DOCUMENT_TYPES.MARKSHEET) {
      await executeQuery({
        query: `
          INSERT INTO student_documents (
            student_id, 
            document_type, 
            document_url, 
            caption,
            is_link
          ) VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          document_url = VALUES(document_url),
          caption = VALUES(caption),
          updated_at = CURRENT_TIMESTAMP
        `,
        values: [
          student.id,
          document_type,
          file_url,
          file_name,
          1 // is_link = true since it's a Google Drive link
        ]
      })
    } else {
      // For certificates, just insert new
      await executeQuery({
        query: `
          INSERT INTO student_documents (
            student_id, 
            document_type, 
            document_url, 
            caption,
            is_link
          ) VALUES (?, ?, ?, ?, ?)
        `,
        values: [
          student.id,
          document_type,
          file_url,
          file_name,
          1
        ]
      })
    }

    return NextResponse.json({ message: 'Document saved successfully' })
  } catch (error) {
    console.error('Error saving document:', error)
    return NextResponse.json(
      { error: 'Failed to save document' },
      { status: 500 }
    )
  }
}

// DELETE endpoint to remove a document
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('id')

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 })
    }

    // Verify the document belongs to the student
    const [student] = await executeQuery({
      query: 'SELECT id FROM students WHERE user_id = ?',
      values: [session.user.id]
    })

    await executeQuery({
      query: 'DELETE FROM student_documents WHERE id = ? AND student_id = ?',
      values: [documentId, student.id]
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