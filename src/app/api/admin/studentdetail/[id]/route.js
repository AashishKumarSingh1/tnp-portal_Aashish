import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

// GET endpoint to fetch all student details
export async function GET(request, context) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the student ID from context.params
    const studentId = context.params.id

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }

    // Fetch basic profile with all fields
    const [profile] = await executeQuery({
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
          s.created_at,
          s.updated_at,
          u.email as primary_email,
          u.created_at as registration_date
        FROM students s
        JOIN users u ON u.id = s.user_id
        WHERE s.id = ?
      `,
      values: [studentId]
    })

    if (!profile) {
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
      values: [studentId]
    })

    // Fetch documents
    const documents = await executeQuery({
      query: `
        SELECT 
          id,
          document_type,
          document_url as file_url,
          caption as file_name,
          created_at,
          updated_at
        FROM student_documents 
        WHERE student_id = ?
      `,
      values: [studentId]
    })

    // Fetch experiences with all fields
    const experiences = await executeQuery({
      query: `
        SELECT 
          id,
          company_name,
          position,
          start_date,
          end_date,
          current_job,
          description,
          experience_type,
          created_at,
          updated_at
        FROM student_experience 
        WHERE student_id = ?
        ORDER BY start_date DESC
      `,
      values: [studentId]
    })

    // Fetch personal details with all fields
    const [personal] = await executeQuery({
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
      values: [studentId]
    })

    // Format the response with all fields
    const formattedResponse = {
      profile: {
        id: profile.id,
        user_id: profile.user_id,
        full_name: profile.full_name,
        roll_number: profile.roll_number,
        email: profile.primary_email,
        secondary_email: profile.secondary_email,
        phone: profile.phone,
        secondary_phone: profile.secondary_phone,
        branch: profile.branch,
        current_year: Number(profile.current_year),
        cgpa: Number(profile.cgpa),
        passing_year: profile.passing_year?.toString(),
        is_email_verified: Boolean(profile.is_email_verified),
        is_verified_by_admin: Boolean(profile.is_verified_by_admin),
        degree_type: profile.degree_type,
        specialization: profile.specialization,
        registration_date: profile.registration_date,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      },
      academics: academics ? {
        ...academics,
        tenth_percentage: Number(academics.tenth_percentage),
        twelfth_percentage: Number(academics.twelfth_percentage),
        sem1_cgpa: academics.sem1_cgpa ? Number(academics.sem1_cgpa) : null,
        sem2_cgpa: academics.sem2_cgpa ? Number(academics.sem2_cgpa) : null,
        sem3_cgpa: academics.sem3_cgpa ? Number(academics.sem3_cgpa) : null,
        sem4_cgpa: academics.sem4_cgpa ? Number(academics.sem4_cgpa) : null,
        sem5_cgpa: academics.sem5_cgpa ? Number(academics.sem5_cgpa) : null,
        sem6_cgpa: academics.sem6_cgpa ? Number(academics.sem6_cgpa) : null,
        sem7_cgpa: academics.sem7_cgpa ? Number(academics.sem7_cgpa) : null,
        sem8_cgpa: academics.sem8_cgpa ? Number(academics.sem8_cgpa) : null,
        sem9_cgpa: academics.sem9_cgpa ? Number(academics.sem9_cgpa) : null,
        sem10_cgpa: academics.sem10_cgpa ? Number(academics.sem10_cgpa) : null,
        overall_cgpa: Number(academics.overall_cgpa),
        backlogs: Number(academics.backlogs),
        current_backlogs: Number(academics.current_backlogs),
        gap_years: Number(academics.gap_years),
        jee_rank: academics.jee_rank ? Number(academics.jee_rank) : null,
        jee_score: academics.jee_score ? Number(academics.jee_score) : null,
        gate_score: academics.gate_score ? Number(academics.gate_score) : null,
        gate_rank: academics.gate_rank ? Number(academics.gate_rank) : null
      } : {},
      documents: documents.reduce((acc, doc) => {
        acc[doc.document_type] = {
          id: doc.id,
          file_url: doc.file_url,
          file_name: doc.file_name,
          created_at: doc.created_at,
          updated_at: doc.updated_at
        }
        return acc
      }, {}),
      experiences: experiences.map(exp => ({
        ...exp,
        current_job: Boolean(exp.current_job),
        start_date: exp.start_date?.toISOString().split('T')[0],
        end_date: exp.end_date?.toISOString().split('T')[0]
      })),
      personal: personal ? {
        ...personal,
        date_of_birth: personal.date_of_birth?.toISOString().split('T')[0],
        height: Number(personal.height),
        weight: Number(personal.weight),
        is_physically_handicapped: Boolean(personal.is_physically_handicapped),
        ph_percent: personal.ph_percent ? Number(personal.ph_percent) : null,
        driving_license: Boolean(personal.driving_license)
      } : {}
    }

    return NextResponse.json(formattedResponse)

  } catch (error) {
    console.error('Error fetching student details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student details' },
      { status: 500 }
    )
  }
} 