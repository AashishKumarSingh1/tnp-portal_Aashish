import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { DEGREE_WITH_SPECIALIZATION } from '@/lib/data'


// GET endpoint to fetch student profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    console.log('Full Session:', JSON.stringify(session, null, 2)) // Detailed logging

    // Check if session exists and has required properties
    if (!session) {
      return NextResponse.json({ 
        error: 'No session found',
        session: null
      }, { status: 401 })
    }

    // More lenient session validation
    const userId = session?.user?.id || session?.id
    const userRole = session?.user?.role || session?.role

    if (!userId || userRole !== 'STUDENT') {
      return NextResponse.json({ 
        error: 'Invalid session data', 
        debug: {
          userId,
          userRole,
          session: session
        }
      }, { status: 401 })
    }

    // Fetch student profile from database with proper type checking
    const results = await executeQuery({
      query: `
        SELECT 
          s.id,
          s.user_id,
          s.full_name,
          s.roll_number,
          s.branch,
          s.current_year,
          s.cgpa,
          s.phone,
          s.secondary_phone,
          s.passing_year,
          s.is_email_verified,
          s.is_verified_by_admin,
          s.degree_type,
          s.specialization,
          s.secondary_email,
          u.email as primary_email,
          u.created_at as registration_date
        FROM students s
        JOIN users u ON u.id = s.user_id
        WHERE s.user_id = ?
      `,
      values: [Number(userId)]
    })

    // Check if student exists
    if (!results || results.length === 0) {
      return NextResponse.json(
        { error: 'Student profile not found' }, 
        { status: 404 }
      )
    }

    // Format the response data
    const student = {
      ...results[0],
      current_year: Number(results[0].current_year),
      cgpa: Number(results[0].cgpa),
      passing_year: results[0].passing_year?.toString(),
      is_email_verified: Boolean(results[0].is_email_verified),
      is_verified_by_admin: Boolean(results[0].is_verified_by_admin),
      degree_type: results[0].degree_type || 'UG',
      specialization: results[0].specialization || null
    }

    return NextResponse.json(student)

  } catch (error) {
    console.error('Error fetching student profile:', error)
    return NextResponse.json({
      error: 'Failed to fetch student profile',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

// PUT endpoint to update student profile
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    console.log('Full Session PUT:', JSON.stringify(session, null, 2))

    // More lenient session validation
    const userId = session?.user?.id || session?.id
    const userRole = session?.user?.role || session?.role

    if (!userId || userRole !== 'STUDENT') {
      return NextResponse.json({ 
        error: 'Invalid session data', 
        debug: {
          userId,
          userRole,
          session: session
        }
      }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    const requiredFields = ['cgpa', 'phone', 'passing_year', 'degree_type']
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === '') {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Validate specialization if degree type requires it
    if (DEGREE_WITH_SPECIALIZATION.includes(data.degree_type) && !data.specialization) {
      return NextResponse.json(
        { error: 'Specialization is required for this degree type' },
        { status: 400 }
      )
    }

    // Validate numeric fields
    if (isNaN(Number(data.cgpa)) || isNaN(Number(data.passing_year))) {
      return NextResponse.json(
        { error: 'Invalid numeric value provided' },
        { status: 400 }
      )
    }

    // Validate phone numbers if provided
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(data.phone)) {
      return NextResponse.json(
        { error: 'Invalid primary phone number format' },
        { status: 400 }
      )
    }
    if (data.secondary_phone && !phoneRegex.test(data.secondary_phone)) {
      return NextResponse.json(
        { error: 'Invalid secondary phone number format' },
        { status: 400 }
      )
    }

    // Validate secondary email if provided
    if (data.secondary_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.secondary_email)) {
        return NextResponse.json(
          { error: 'Invalid secondary email format' },
          { status: 400 }
        )
      }
    }

    // Update student profile
    await executeQuery({
      query: `
        UPDATE students 
        SET 
          cgpa = ?,
          phone = ?,
          secondary_phone = ?,
          passing_year = ?,
          secondary_email = ?,
          degree_type = ?,
          specialization = ?,
          updated_at = UTC_TIMESTAMP()
        WHERE user_id = ?
      `,
      values: [
        Number(data.cgpa),
        data.phone,
        data.secondary_phone || null,
        Number(data.passing_year),
        data.secondary_email || null,
        data.degree_type,
        DEGREE_WITH_SPECIALIZATION.includes(data.degree_type) ? data.specialization : null,
        Number(userId)
      ]
    })

    return NextResponse.json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Error updating student profile:', error)
    return NextResponse.json(
      { error: 'Failed to update student profile' },
      { status: 500 }
    )
  }
} 