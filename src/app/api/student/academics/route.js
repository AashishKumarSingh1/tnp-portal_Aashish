import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

// GET endpoint to fetch academic details
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // First get the student_id from students table
    const [student] = await executeQuery({
      query: 'SELECT id FROM students WHERE user_id = ?',
      values: [session.user.id]
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Fetch academic details
    const [academics] = await executeQuery({
      query: `
        SELECT 
          tenth_board,
          tenth_percentage,
          tenth_year,
          tenth_school,
          twelfth_board,
          twelfth_percentage,
          twelfth_year,
          twelfth_school,
          ug_university,
          ug_college,
          ug_year_of_admission,
          sem1_cgpa,
          sem2_cgpa,
          sem3_cgpa,
          sem4_cgpa,
          sem5_cgpa,
          sem6_cgpa,
          sem7_cgpa,
          sem8_cgpa,
          sem9_cgpa,
          sem10_cgpa,
          overall_cgpa,
          backlogs,
          current_backlogs,
          gap_years,
          jee_rank,
          jee_score,
          gate_score,
          gate_rank
        FROM student_academics 
        WHERE student_id = ?
      `,
      values: [student.id]
    })

    // If no academic record exists, return empty default values
    if (!academics) {
      return NextResponse.json({
        tenth_board: '',
        tenth_percentage: '',
        tenth_year: '',
        tenth_school: '',
        twelfth_board: '',
        twelfth_percentage: '',
        twelfth_year: '',
        twelfth_school: '',
        ug_university: '',
        ug_college: '',
        ug_year_of_admission: '',
        sem1_cgpa: '',
        sem2_cgpa: '',
        sem3_cgpa: '',
        sem4_cgpa: '',
        sem5_cgpa: '',
        sem6_cgpa: '',
        sem7_cgpa: '',
        sem8_cgpa: '',
        sem9_cgpa: '',
        sem10_cgpa: '',
        overall_cgpa: '',
        backlogs: 0,
        current_backlogs: 0,
        gap_years: 0,
        jee_rank: '',
        jee_score: '',
        gate_score: '',
        gate_rank: ''
      })
    }

    return NextResponse.json(academics)
  } catch (error) {
    console.error('Error fetching academic details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch academic details' },
      { status: 500 }
    )
  }
}

// PUT endpoint to update academic details
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

    // Validate numeric fields
    const numericFields = {
      tenth_percentage: parseFloat(data.tenth_percentage),
      tenth_year: parseInt(data.tenth_year),
      twelfth_percentage: parseFloat(data.twelfth_percentage),
      twelfth_year: parseInt(data.twelfth_year),
      ug_year_of_admission: parseInt(data.ug_year_of_admission),
      sem1_cgpa: data.sem1_cgpa ? parseFloat(data.sem1_cgpa) : null,
      sem2_cgpa: data.sem2_cgpa ? parseFloat(data.sem2_cgpa) : null,
      sem3_cgpa: data.sem3_cgpa ? parseFloat(data.sem3_cgpa) : null,
      sem4_cgpa: data.sem4_cgpa ? parseFloat(data.sem4_cgpa) : null,
      sem5_cgpa: data.sem5_cgpa ? parseFloat(data.sem5_cgpa) : null,
      sem6_cgpa: data.sem6_cgpa ? parseFloat(data.sem6_cgpa) : null,
      sem7_cgpa: data.sem7_cgpa ? parseFloat(data.sem7_cgpa) : null,
      sem8_cgpa: data.sem8_cgpa ? parseFloat(data.sem8_cgpa) : null,
      sem9_cgpa: data.sem9_cgpa ? parseFloat(data.sem9_cgpa) : null,
      sem10_cgpa: data.sem10_cgpa ? parseFloat(data.sem10_cgpa) : null,
      overall_cgpa: parseFloat(data.overall_cgpa),
      backlogs: parseInt(data.backlogs) || 0,
      current_backlogs: parseInt(data.current_backlogs) || 0,
      gap_years: parseInt(data.gap_years) || 0,
      jee_rank: data.jee_rank ? parseInt(data.jee_rank) : null,
      jee_score: data.jee_score ? parseFloat(data.jee_score) : null,
      gate_score: data.gate_score ? parseFloat(data.gate_score) : null,
      gate_rank: data.gate_rank ? parseInt(data.gate_rank) : null
    }

    // Validate percentages
    if (numericFields.tenth_percentage < 0 || numericFields.tenth_percentage > 100 ||
        numericFields.twelfth_percentage < 0 || numericFields.twelfth_percentage > 100) {
      return NextResponse.json(
        { error: 'Percentage must be between 0 and 100' },
        { status: 400 }
      )
    }

    // Check if academic record exists
    const [existingRecord] = await executeQuery({
      query: 'SELECT id FROM student_academics WHERE student_id = ?',
      values: [student.id]
    })

    if (existingRecord) {
      // Update existing record
      await executeQuery({
        query: `
          UPDATE student_academics 
          SET 
            tenth_board = ?,
            tenth_percentage = ?,
            tenth_year = ?,
            tenth_school = ?,
            twelfth_board = ?,
            twelfth_percentage = ?,
            twelfth_year = ?,
            twelfth_school = ?,
            ug_university = ?,
            ug_college = ?,
            ug_year_of_admission = ?,
            sem1_cgpa = ?,
            sem2_cgpa = ?,
            sem3_cgpa = ?,
            sem4_cgpa = ?,
            sem5_cgpa = ?,
            sem6_cgpa = ?,
            sem7_cgpa = ?,
            sem8_cgpa = ?,
            sem9_cgpa = ?,
            sem10_cgpa = ?,
            overall_cgpa = ?,
            backlogs = ?,
            current_backlogs = ?,
            gap_years = ?,
            jee_rank = ?,
            jee_score = ?,
            gate_score = ?,
            gate_rank = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE student_id = ?
        `,
        values: [
          data.tenth_board,
          numericFields.tenth_percentage,
          numericFields.tenth_year,
          data.tenth_school,
          data.twelfth_board,
          numericFields.twelfth_percentage,
          numericFields.twelfth_year,
          data.twelfth_school,
          data.ug_university,
          data.ug_college,
          numericFields.ug_year_of_admission,
          numericFields.sem1_cgpa,
          numericFields.sem2_cgpa,
          numericFields.sem3_cgpa,
          numericFields.sem4_cgpa,
          numericFields.sem5_cgpa,
          numericFields.sem6_cgpa,
          numericFields.sem7_cgpa,
          numericFields.sem8_cgpa,
          numericFields.sem9_cgpa,
          numericFields.sem10_cgpa,
          numericFields.overall_cgpa,
          numericFields.backlogs,
          numericFields.current_backlogs,
          numericFields.gap_years,
          numericFields.jee_rank,
          numericFields.jee_score,
          numericFields.gate_score,
          numericFields.gate_rank,
          student.id
        ]
      })
    } else {
      // Insert new record with all fields
      await executeQuery({
        query: `
          INSERT INTO student_academics (
            student_id,
            tenth_board,
            tenth_percentage,
            tenth_year,
            tenth_school,
            twelfth_board,
            twelfth_percentage,
            twelfth_year,
            twelfth_school,
            ug_university,
            ug_college,
            ug_year_of_admission,
            sem1_cgpa,
            sem2_cgpa,
            sem3_cgpa,
            sem4_cgpa,
            sem5_cgpa,
            sem6_cgpa,
            sem7_cgpa,
            sem8_cgpa,
            sem9_cgpa,
            sem10_cgpa,
            overall_cgpa,
            backlogs,
            current_backlogs,
            gap_years,
            jee_rank,
            jee_score,
            gate_score,
            gate_rank
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        values: [
          student.id,
          data.tenth_board,
          numericFields.tenth_percentage,
          numericFields.tenth_year,
          data.tenth_school,
          data.twelfth_board,
          numericFields.twelfth_percentage,
          numericFields.twelfth_year,
          data.twelfth_school,
          data.ug_university,
          data.ug_college,
          numericFields.ug_year_of_admission,
          numericFields.sem1_cgpa,
          numericFields.sem2_cgpa,
          numericFields.sem3_cgpa,
          numericFields.sem4_cgpa,
          numericFields.sem5_cgpa,
          numericFields.sem6_cgpa,
          numericFields.sem7_cgpa,
          numericFields.sem8_cgpa,
          numericFields.sem9_cgpa,
          numericFields.sem10_cgpa,
          numericFields.overall_cgpa,
          numericFields.backlogs,
          numericFields.current_backlogs,
          numericFields.gap_years,
          numericFields.jee_rank,
          numericFields.jee_score,
          numericFields.gate_score,
          numericFields.gate_rank
        ]
      })
    }

    return NextResponse.json({ message: 'Academic details updated successfully' })
  } catch (error) {
    console.error('Error updating academic details:', error)
    return NextResponse.json(
      { error: 'Failed to update academic details' },
      { status: 500 }
    )
  }
} 