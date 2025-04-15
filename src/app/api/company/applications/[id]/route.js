import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(req, context) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 })
    }

    const params = await context.params
    const applicationId = params.id

    if (!applicationId) {
      return new Response(JSON.stringify({ success: false, message: 'Application ID is required' }), { status: 400 })
    }

    // Get application details with student information
    const [application] = await executeQuery({
      query: `
        SELECT 
          sa.id,
          sa.student_id,
          sa.jaf_id,
          sa.status,
          sa.current_round,
          sa.remarks,
          sa.applied_at,
          sa.updated_at,
          s.full_name as student_name,
          s.roll_number,
          s.branch,
          s.cgpa,
          s.phone,
          s.degree_type,
          u.email,
          u.registration_number,
          sa2.overall_cgpa,
          sa2.backlogs,
          sa2.current_backlogs,
          sp.fathers_name,
          sp.mothers_name,
          sp.date_of_birth,
          sp.gender,
          sp.category,
          sp.permanent_address,
          sp.correspondence_address,
          sjp.linkedin_url,
          sjp.github_url,
          sjp.portfolio_url,
          ss.technical_skills,
          ss.soft_skills,
          ss.certifications,
          ss.achievements,
          ss.projects,
          GROUP_CONCAT(DISTINCT sd.document_type) as document_types,
          GROUP_CONCAT(DISTINCT sd.document_url) as document_urls,
          GROUP_CONCAT(DISTINCT se.company_name) as experience_companies,
          (
            SELECT COUNT(DISTINCT ar2.id) 
            FROM application_rounds ar2 
            WHERE ar2.application_id = sa.id AND ar2.status = 'Cleared'
          ) as rounds_cleared
        FROM student_applications sa
        JOIN students s ON sa.student_id = s.id
        JOIN users u ON s.user_id = u.id
        LEFT JOIN student_academics sa2 ON s.id = sa2.student_id
        LEFT JOIN student_personal_details sp ON s.id = sp.student_id
        LEFT JOIN student_job_preferences sjp ON s.id = sjp.student_id
        LEFT JOIN student_skills ss ON s.id = ss.student_id
        LEFT JOIN student_experience se ON s.id = se.student_id
        LEFT JOIN student_documents sd ON s.id = sd.student_id
        WHERE sa.id = ?
        GROUP BY 
          sa.id, sa.student_id, sa.jaf_id, sa.status, sa.current_round, sa.remarks, 
          sa.applied_at, sa.updated_at, s.full_name, s.roll_number, s.branch, s.cgpa, 
          s.phone, s.degree_type, u.email, u.registration_number, sa2.overall_cgpa, 
          sa2.backlogs, sa2.current_backlogs, sp.fathers_name, sp.mothers_name, 
          sp.date_of_birth, sp.gender, sp.category, sp.permanent_address, 
          sp.correspondence_address, sjp.linkedin_url, sjp.github_url, sjp.portfolio_url, 
          ss.technical_skills, ss.soft_skills, ss.certifications, ss.achievements, ss.projects
      `,
      values: [applicationId]
    })

    if (!application) {
      return new Response(JSON.stringify({ success: false, message: 'Application not found' }), { status: 404 })
    }

    // Verify company access if company role
    if (session.user.role.toUpperCase() === 'COMPANY') {
      const [access] = await executeQuery({
        query: `
          SELECT 1 FROM job_announcements ja
          JOIN companies c ON ja.company_id = c.id
          WHERE ja.id = ? AND c.user_id = ?
        `,
        values: [application.jaf_id, session.user.id]
      })

      if (!access) {
        return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 403 })
      }
    }

    // Process documents
    const documents = [];
    if (application.document_types && application.document_urls) {
      const types = application.document_types.split(',');
      const urls = application.document_urls.split(',');
      
      for (let i = 0; i < types.length; i++) {
        if (types[i] && urls[i]) {
          documents.push({
            type: types[i],
            url: urls[i]
          });
        }
      }
    }
    
    // Process other fields
    const processedApplication = {
      ...application,
      documents,
      technical_skills: application.technical_skills ? JSON.parse(application.technical_skills) : [],
      soft_skills: application.soft_skills ? JSON.parse(application.soft_skills) : [],
      certifications: application.certifications ? JSON.parse(application.certifications) : [],
      achievements: application.achievements ? JSON.parse(application.achievements) : [],
      projects: application.projects ? JSON.parse(application.projects) : [],
      experience_companies: application.experience_companies ? application.experience_companies.split(',') : []
    };

    // Get rounds information
    const rounds = await executeQuery({
      query: `
        SELECT 
          round_number,
          round_type,
          status,
          remarks,
          created_at
        FROM application_rounds
        WHERE application_id = ?
        ORDER BY round_number
      `,
      values: [applicationId]
    })

    return new Response(JSON.stringify({
      success: true,
      application: {
        ...processedApplication,
        rounds
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error fetching application details:', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error',
      message: error.message
    }), { status: 500 })
  }
} 