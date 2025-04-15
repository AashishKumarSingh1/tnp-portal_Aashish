import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(req, context) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const jafId = await params.id
    const userRole = session.user.role.toUpperCase()

    // Query to get JAF details with company info and accurate application count
    const query = `
      SELECT 
        j.*,
        c.company_name,
        c.email,
        c.website,
        c.phone,
        c.contact_person_name,
        (
          SELECT JSON_OBJECT(
            'total', COUNT(*),
            'applied', COUNT(CASE WHEN status = 'Applied' THEN 1 END),
            'shortlisted', COUNT(CASE WHEN status = 'Shortlisted' THEN 1 END),
            'selected', COUNT(CASE WHEN status = 'Selected' THEN 1 END),
            'rejected', COUNT(CASE WHEN status = 'Rejected' THEN 1 END)
          )
          FROM student_applications 
          WHERE jaf_id = j.id
        ) as application_stats
      FROM job_announcements j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.id = ?
      ${userRole === 'COMPANY' ? 'AND c.user_id = ?' : ''}
    `

    const values = userRole === 'COMPANY' 
      ? [jafId, session.user.id]
      : [jafId]

    const [jaf] = await executeQuery({ query, values })

    if (!jaf) {
      return NextResponse.json({ success: false, message: 'JAF not found' }, { status: 404 })
    }

    // Enhanced JSON parsing function
    const safeParseJSON = (data, defaultValue = []) => {
      if (!data) return defaultValue
      if (Array.isArray(data)) return data
      try {
        return typeof data === 'string' ? JSON.parse(data) : [data.toString()]
      } catch (e) {
        console.error('Error parsing JSON:', e)
        return defaultValue
      }
    }

    // Parse selection process separately
    const safeParseJSONObject = (data, defaultValue = {}) => {
      if (!data) return defaultValue
      if (typeof data === 'object' && !Array.isArray(data)) return data
      try {
        return typeof data === 'string' ? JSON.parse(data) : defaultValue
      } catch (e) {
        console.error('Error parsing JSON object:', e)
        return defaultValue
      }
    }

    // Transform the response with proper parsing
    const job = {
      ...jaf,
      eligible_batches: safeParseJSON(jaf.eligible_batches),
      eligible_branches: safeParseJSON(jaf.eligible_branches),
      eligible_degrees: safeParseJSON(jaf.eligible_degrees),
      selection_process: safeParseJSONObject(jaf.selection_process, {
        medical_test: false,
        written_test: false,
        group_discussion: false,
        resume_shortlist: false,
        personal_interview: false
      }),
      application_stats: safeParseJSONObject(jaf.application_stats, {
        total: 0,
        applied: 0,
        shortlisted: 0,
        selected: 0,
        rejected: 0
      })
    }

    // Get applicants if company role
    let applicants = []
    if (userRole === 'COMPANY') {
      applicants = await executeQuery({
        query: `
          SELECT 
            sa.id,
            sa.student_id,
            sa.status,
            sa.current_round,
            sa.applied_at,
            sa.updated_at,
            sa.remarks,
            s.full_name as student_name,
            s.roll_number,
            s.branch,
            s.cgpa,
            s.phone,
            s.degree_type,
            s.passing_year,
            u.email,
            sp.fathers_name,
            sp.mothers_name,
            sp.date_of_birth,
            sp.gender,
            sp.category,
            sp.correspondence_address,
            sp.permanent_address,
            GROUP_CONCAT(DISTINCT se.company_name) as experience_companies,
            GROUP_CONCAT(DISTINCT sd.document_url) as document_urls,
            GROUP_CONCAT(DISTINCT sd.document_type) as document_types,
            MAX(ss.technical_skills) as technical_skills,
            MAX(ss.soft_skills) as soft_skills,
            MAX(ss.certifications) as certifications,
            MAX(ss.achievements) as achievements,
            MAX(ss.projects) as projects
          FROM student_applications sa
          JOIN students s ON sa.student_id = s.id
          JOIN users u ON s.user_id = u.id
          LEFT JOIN student_personal_details sp ON s.id = sp.student_id
          LEFT JOIN student_experience se ON s.id = se.student_id
          LEFT JOIN student_documents sd ON s.id = sd.student_id
          LEFT JOIN student_skills ss ON s.id = ss.student_id
          WHERE sa.jaf_id = ?
          GROUP BY 
            sa.id, sa.student_id, sa.status, sa.current_round, 
            sa.applied_at, sa.updated_at, sa.remarks,
            s.full_name, s.roll_number, s.branch, s.cgpa, 
            s.phone, s.degree_type, s.passing_year,
            u.email,
            sp.fathers_name, sp.mothers_name, sp.date_of_birth,
            sp.gender, sp.category, sp.correspondence_address,
            sp.permanent_address
          ORDER BY sa.applied_at DESC
        `,
        values: [jafId]
      })

      // Parse JSON fields for each applicant
      applicants = applicants.map(applicant => ({
        ...applicant,
        technical_skills: safeParseJSON(applicant.technical_skills),
        soft_skills: safeParseJSON(applicant.soft_skills),
        certifications: safeParseJSON(applicant.certifications),
        achievements: safeParseJSON(applicant.achievements),
        projects: safeParseJSON(applicant.projects),
        experience_companies: applicant.experience_companies ? applicant.experience_companies.split(',') : [],
        documents: applicant.document_urls && applicant.document_types ? 
          applicant.document_urls.split(',').map((url, i) => ({
            url,
            type: applicant.document_types.split(',')[i]
          })) : []
      }))
    }

    return NextResponse.json({
      success: true,
      job,
      applicants
    })

  } catch (error) {
    console.error('Error fetching JAF:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    }, { status: 500 })
  }
} 