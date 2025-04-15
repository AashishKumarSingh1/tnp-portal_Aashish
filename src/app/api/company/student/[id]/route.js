import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(req, context) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'COMPANY') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const studentId = context.params.id

    // First verify if the company has access to this student's details
    const hasAccess = await executeQuery({
      query: `
        SELECT 1
        FROM student_applications sa
        JOIN job_announcements ja ON sa.jaf_id = ja.id
        JOIN companies c ON ja.company_id = c.id
        WHERE sa.student_id = ? AND c.user_id = ?
        LIMIT 1
      `,
      values: [studentId, session.user.id]
    })

    if (!hasAccess.length) {
      return NextResponse.json({ 
        success: false, 
        message: 'You do not have access to this student\'s details' 
      }, { status: 403 })
    }

    // Get student profile
    const [profile] = await executeQuery({
      query: `
        SELECT 
          s.*,
          u.email
        FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = ?
      `,
      values: [studentId]
    })

    if (!profile) {
      return NextResponse.json({ 
        success: false, 
        message: 'Student not found' 
      }, { status: 404 })
    }

    // Get academic details
    const [academics] = await executeQuery({
      query: `
        SELECT * FROM student_academics 
        WHERE student_id = ?
      `,
      values: [studentId]
    })

    // Get documents
    const documents = await executeQuery({
      query: `
        SELECT * FROM student_documents
        WHERE student_id = ?
      `,
      values: [studentId]
    })

    // Get experience
    const experiences = await executeQuery({
      query: `
        SELECT * FROM student_experience
        WHERE student_id = ?
        ORDER BY end_date DESC
      `,
      values: [studentId]
    })

    // Get personal details
    const [personal] = await executeQuery({
      query: `
        SELECT * FROM student_personal_details
        WHERE student_id = ?
      `,
      values: [studentId]
    })

    // Get skills
    const [skills] = await executeQuery({
      query: `
        SELECT * FROM student_skills
        WHERE student_id = ?
      `,
      values: [studentId]
    })

    // Parse JSON fields
    const safeParseJSON = (data, defaultValue = []) => {
      if (!data) return defaultValue
      try {
        return typeof data === 'string' ? JSON.parse(data) : data
      } catch (e) {
        return defaultValue
      }
    }

    const formattedResponse = {
      success: true,
      student: {
        profile: {
          id: profile.id,
          full_name: profile.full_name,
          roll_number: profile.roll_number,
          email: profile.email,
          phone: profile.phone,
          branch: profile.branch,
          current_year: profile.current_year,
          cgpa: Number(profile.cgpa),
          passing_year: profile.passing_year,
          degree_type: profile.degree_type,
          specialization: profile.specialization
        },
        academics: academics ? {
          ...academics,
          tenth_percentage: Number(academics.tenth_percentage),
          twelfth_percentage: Number(academics.twelfth_percentage),
          overall_cgpa: Number(academics.overall_cgpa),
          backlogs: Number(academics.backlogs),
          current_backlogs: Number(academics.current_backlogs)
        } : null,
        documents: documents.map(doc => ({
          type: doc.document_type,
          url: doc.document_url,
          caption: doc.caption
        })),
        experiences: experiences.map(exp => ({
          ...exp,
          start_date: exp.start_date?.toISOString().split('T')[0],
          end_date: exp.end_date?.toISOString().split('T')[0]
        })),
        personal: personal ? {
          father_name: personal.father_name,
          mother_name: personal.mother_name,
          date_of_birth: personal.date_of_birth?.toISOString().split('T')[0],
          gender: personal.gender,
          category: personal.category,
          blood_group: personal.blood_group
        } : null,
        skills: skills ? {
          technical_skills: safeParseJSON(skills.technical_skills),
          soft_skills: safeParseJSON(skills.soft_skills),
          certifications: safeParseJSON(skills.certifications),
          achievements: safeParseJSON(skills.achievements),
          projects: safeParseJSON(skills.projects)
        } : null
      }
    }

    return NextResponse.json(formattedResponse)

  } catch (error) {
    console.error('Error fetching student details:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    }, { status: 500 })
  }
} 