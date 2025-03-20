import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

// GET endpoint to fetch experiences
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get student_id
    const [student] = await executeQuery({
      query: 'SELECT id FROM students WHERE user_id = ?',
      values: [session.user.id]
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Fetch experiences
    const experiences = await executeQuery({
      query: `
        SELECT * FROM student_experience 
        WHERE student_id = ?
        ORDER BY start_date DESC
      `,
      values: [student.id]
    })

    return NextResponse.json(experiences)
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    )
  }
}

// POST endpoint to add experience
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get student_id
    const [student] = await executeQuery({
      query: 'SELECT id FROM students WHERE user_id = ?',
      values: [session.user.id]
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const data = await request.json()

    // Validate required fields
    const requiredFields = [
      'company_name', 
      'position', 
      'start_date', 
      'description',
      'experience_type'
    ]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Validate experience type
    if (!['internship', 'job'].includes(data.experience_type)) {
      return NextResponse.json(
        { error: 'Invalid experience type' },
        { status: 400 }
      )
    }

    // Validate end date if not current job
    if (!data.current_job && !data.end_date) {
      return NextResponse.json(
        { error: 'End date is required for past jobs' },
        { status: 400 }
      )
    }

    // Insert experience
    await executeQuery({
      query: `
        INSERT INTO student_experience (
          student_id,
          company_name,
          position,
          start_date,
          end_date,
          current_job,
          description,
          experience_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        student.id,
        data.company_name,
        data.position,
        data.start_date,
        data.current_job ? null : data.end_date,
        Boolean(data.current_job),
        data.description,
        data.experience_type
      ]
    })

    return NextResponse.json({ message: 'Experience added successfully' })
  } catch (error) {
    console.error('Error adding experience:', error)
    return NextResponse.json(
      { error: 'Failed to add experience' },
      { status: 500 }
    )
  }
}

// PUT endpoint to update experience
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    if (!data.id) {
      return NextResponse.json(
        { error: 'Experience ID is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const [experience] = await executeQuery({
      query: `
        SELECT se.* FROM student_experience se
        JOIN students s ON se.student_id = s.id
        WHERE se.id = ? AND s.user_id = ?
      `,
      values: [data.id, session.user.id]
    })

    if (!experience) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      )
    }

    // Update experience
    await executeQuery({
      query: `
        UPDATE student_experience 
        SET 
          company_name = ?,
          position = ?,
          start_date = ?,
          end_date = ?,
          current_job = ?,
          description = ?,
          experience_type = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      values: [
        data.company_name,
        data.position,
        data.start_date,
        data.current_job ? null : data.end_date,
        Boolean(data.current_job),
        data.description,
        data.experience_type,
        data.id
      ]
    })

    return NextResponse.json({ message: 'Experience updated successfully' })
  } catch (error) {
    console.error('Error updating experience:', error)
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    )
  }
} 