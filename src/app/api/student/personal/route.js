import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

// GET endpoint to fetch personal details
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

    // Fetch personal details
    const [details] = await executeQuery({
      query: `
        SELECT 
          fathers_name,
          fathers_occupation,
          mothers_name,
          mothers_occupation,
          date_of_birth,
          alternate_mobile,
          guardian_mobile,
          gender,
          category,
          blood_group,
          height,
          weight,
          is_physically_handicapped,
          ph_percent,
          disability_type,
          permanent_address,
          permanent_city,
          permanent_state,
          permanent_pincode,
          correspondence_address,
          correspondence_city,
          correspondence_state,
          correspondence_pincode,
          domicile,
          aadhar_number,
          driving_license,
          driving_license_number,
          pan_number
        FROM student_personal_details 
        WHERE student_id = ?
      `,
      values: [student.id]
    })

    // If no record exists, return empty object
    if (!details) {
      return NextResponse.json({})
    }

    // Format date
    if (details.date_of_birth) {
      details.date_of_birth = details.date_of_birth.toISOString().split('T')[0]
    }

    // Convert boolean fields
    details.is_physically_handicapped = Boolean(details.is_physically_handicapped)
    details.driving_license = Boolean(details.driving_license)

    return NextResponse.json(details)
  } catch (error) {
    console.error('Error fetching personal details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch personal details' },
      { status: 500 }
    )
  }
}

// PUT endpoint to update personal details
export async function PUT(request) {
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
      'fathers_name',
      'fathers_occupation',
      'mothers_name',
      'mothers_occupation',
      'date_of_birth',
      'guardian_mobile',
      'gender',
      'category',
      'blood_group',
      'height',
      'weight',
      'permanent_address',
      'permanent_city',
      'permanent_state',
      'permanent_pincode',
      'correspondence_address',
      'correspondence_city',
      'correspondence_state',
      'correspondence_pincode',
      'domicile',
      'aadhar_number',
      'pan_number'
    ]

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Validate phone numbers
    const phoneRegex = /^\d{10}$/
    if (data.alternate_mobile && !phoneRegex.test(data.alternate_mobile)) {
      return NextResponse.json(
        { error: 'Invalid alternate mobile number' },
        { status: 400 }
      )
    }
    if (!phoneRegex.test(data.guardian_mobile)) {
      return NextResponse.json(
        { error: 'Invalid guardian mobile number' },
        { status: 400 }
      )
    }

    // Validate PIN codes
    const pinRegex = /^\d{6}$/
    if (!pinRegex.test(data.permanent_pincode) || !pinRegex.test(data.correspondence_pincode)) {
      return NextResponse.json(
        { error: 'Invalid PIN code' },
        { status: 400 }
      )
    }

    // Validate Aadhar number
    if (!/^\d{12}$/.test(data.aadhar_number)) {
      return NextResponse.json(
        { error: 'Invalid Aadhar number' },
        { status: 400 }
      )
    }

    // Validate PAN number
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.pan_number)) {
      return NextResponse.json(
        { error: 'Invalid PAN number' },
        { status: 400 }
      )
    }

    // Check if record exists
    const [existingRecord] = await executeQuery({
      query: 'SELECT id FROM student_personal_details WHERE student_id = ?',
      values: [student.id]
    })

    const query = existingRecord
      ? `UPDATE student_personal_details SET
          fathers_name = ?,
          fathers_occupation = ?,
          mothers_name = ?,
          mothers_occupation = ?,
          date_of_birth = ?,
          alternate_mobile = ?,
          guardian_mobile = ?,
          gender = ?,
          category = ?,
          blood_group = ?,
          height = ?,
          weight = ?,
          is_physically_handicapped = ?,
          ph_percent = ?,
          disability_type = ?,
          permanent_address = ?,
          permanent_city = ?,
          permanent_state = ?,
          permanent_pincode = ?,
          correspondence_address = ?,
          correspondence_city = ?,
          correspondence_state = ?,
          correspondence_pincode = ?,
          domicile = ?,
          aadhar_number = ?,
          driving_license = ?,
          driving_license_number = ?,
          pan_number = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE student_id = ?`
      : `INSERT INTO student_personal_details (
          student_id,
          fathers_name,
          fathers_occupation,
          mothers_name,
          mothers_occupation,
          date_of_birth,
          alternate_mobile,
          guardian_mobile,
          gender,
          category,
          blood_group,
          height,
          weight,
          is_physically_handicapped,
          ph_percent,
          disability_type,
          permanent_address,
          permanent_city,
          permanent_state,
          permanent_pincode,
          correspondence_address,
          correspondence_city,
          correspondence_state,
          correspondence_pincode,
          domicile,
          aadhar_number,
          driving_license,
          driving_license_number,
          pan_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

    const values = [
      data.fathers_name,
      data.fathers_occupation,
      data.mothers_name,
      data.mothers_occupation,
      data.date_of_birth,
      data.alternate_mobile || null,
      data.guardian_mobile,
      data.gender,
      data.category,
      data.blood_group,
      parseFloat(data.height),
      parseFloat(data.weight),
      Boolean(data.is_physically_handicapped),
      data.is_physically_handicapped ? parseInt(data.ph_percent) : null,
      data.is_physically_handicapped ? data.disability_type : null,
      data.permanent_address,
      data.permanent_city,
      data.permanent_state,
      data.permanent_pincode,
      data.correspondence_address,
      data.correspondence_city,
      data.correspondence_state,
      data.correspondence_pincode,
      data.domicile,
      data.aadhar_number,
      Boolean(data.driving_license),
      data.driving_license ? data.driving_license_number : null,
      data.pan_number
    ]

    if (existingRecord) {
      values.push(student.id) // Add student_id for WHERE clause
    } else {
      values.unshift(student.id) // Add student_id at the beginning for INSERT
    }

    await executeQuery({
      query,
      values
    })

    return NextResponse.json({ message: 'Personal details updated successfully' })
  } catch (error) {
    console.error('Error updating personal details:', error)
    return NextResponse.json(
      { error: 'Failed to update personal details' },
      { status: 500 }
    )
  }
} 