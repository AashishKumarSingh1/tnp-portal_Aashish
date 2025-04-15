import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(req, context) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const params = await context.params
    const jafId = params.id

    // First verify company access
    if (session.user.role.toUpperCase() === 'COMPANY') {
      const [access] = await executeQuery({
        query: `
          SELECT 1 FROM job_announcements ja
          JOIN companies c ON ja.company_id = c.id
          WHERE ja.id = ? AND c.user_id = ?
        `,
        values: [jafId, session.user.id]
      })

      if (!access) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 })
      }
    }

    // Get application statistics first
    const [stats] = await executeQuery({
      query: `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'Applied' THEN 1 ELSE 0 END) as applied,
          SUM(CASE WHEN status = 'Shortlisted' THEN 1 ELSE 0 END) as shortlisted,
          SUM(CASE WHEN status = 'Selected' THEN 1 ELSE 0 END) as selected,
          SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected,
          SUM(CASE WHEN status = 'On Hold' THEN 1 ELSE 0 END) as on_hold
        FROM student_applications
        WHERE jaf_id = ?
      `,
      values: [jafId]
    })

    // Get applications with student details - Fixed GROUP BY issue
    const applications = await executeQuery({
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
          MAX(CASE WHEN sd.document_type = 'resume' THEN sd.document_url ELSE NULL END) as resume_url,
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
        WHERE sa.jaf_id = ?
        GROUP BY 
          sa.id, sa.student_id, sa.jaf_id, sa.status, sa.current_round, sa.remarks, 
          sa.applied_at, sa.updated_at, s.full_name, s.roll_number, s.branch, s.cgpa, 
          s.phone, s.degree_type, u.email, u.registration_number, sa2.overall_cgpa, 
          sa2.backlogs, sa2.current_backlogs, sp.fathers_name, sp.mothers_name, 
          sp.date_of_birth, sp.gender, sp.category, sp.permanent_address, 
          sp.correspondence_address, sjp.linkedin_url, sjp.github_url, sjp.portfolio_url, 
          ss.technical_skills, ss.soft_skills, ss.certifications, ss.achievements, ss.projects
        ORDER BY sa.applied_at DESC
      `,
      values: [jafId]
    })

    // Process empty arrays for skills, projects, etc.
    const processedApplications = applications.map(app => {
      // Parse document types and URLs for easier access
      const documents = [];
      if (app.document_types && app.document_urls) {
        const types = app.document_types.split(',');
        const urls = app.document_urls.split(',');
        
        for (let i = 0; i < types.length; i++) {
          if (types[i] && urls[i]) {
            documents.push({
              type: types[i],
              url: urls[i]
            });
          }
        }
      }
      
      // Handle empty values
      return {
        ...app,
        documents,
        technical_skills: app.technical_skills ? JSON.parse(app.technical_skills) : [],
        soft_skills: app.soft_skills ? JSON.parse(app.soft_skills) : [],
        certifications: app.certifications ? JSON.parse(app.certifications) : [],
        achievements: app.achievements ? JSON.parse(app.achievements) : [],
        projects: app.projects ? JSON.parse(app.projects) : [],
        experience_companies: app.experience_companies ? app.experience_companies.split(',') : []
      };
    });
    
    // Get rounds information for each application
    const applicationRounds = await executeQuery({
      query: `
        SELECT 
          ar.application_id,
          ar.round_number,
          ar.round_type,
          ar.status,
          ar.remarks,
          ar.created_at
        FROM application_rounds ar
        JOIN student_applications sa ON ar.application_id = sa.id
        WHERE sa.jaf_id = ?
        ORDER BY ar.application_id, ar.round_number
      `,
      values: [jafId]
    })

    // Group rounds by application
    const roundsByApplication = applicationRounds.reduce((acc, round) => {
      if (!acc[round.application_id]) {
        acc[round.application_id] = []
      }
      acc[round.application_id].push(round)
      return acc
    }, {})

    // Attach rounds to applications
    const enrichedApplications = processedApplications.map(app => ({
      ...app,
      rounds: roundsByApplication[app.id] || []
    }))

    return new Response(JSON.stringify({
      success: true,
      applications: enrichedApplications,
      stats: {
        total: Number(stats.total) || 0,
        applied: Number(stats.applied) || 0,
        shortlisted: Number(stats.shortlisted) || 0,
        selected: Number(stats.selected) || 0,
        rejected: Number(stats.rejected) || 0,
        on_hold: Number(stats.on_hold) || 0
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error fetching applications:', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    }), { status: 500 })
  }
}

export async function PUT(req, context) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const params = await context.params
    const jafId = params.id
    const body = await req.json()
    const { applicationId, status, current_round, remarks } = body

    if (!applicationId || !status) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Missing required fields' 
      }), { status: 400 })
    }

    // Verify company access
    if (session.user.role.toUpperCase() === 'COMPANY') {
      const [access] = await executeQuery({
        query: `
          SELECT 1 FROM job_announcements ja
          JOIN companies c ON ja.company_id = c.id
          JOIN student_applications sa ON ja.id = sa.jaf_id
          WHERE sa.id = ? AND ja.id = ? AND c.user_id = ?
        `,
        values: [applicationId, jafId, session.user.id]
      })

      if (!access) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 })
      }
    }

    // Update application status
    await executeQuery({
      query: `
        UPDATE student_applications 
        SET 
          status = ?,
          current_round = ?,
          remarks = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND jaf_id = ?
      `,
      values: [status, current_round || 1, remarks || null, applicationId, jafId]
    })

    // If moving to next round, create a new application round entry
    if (current_round > 1) {
      await executeQuery({
        query: `
          INSERT INTO application_rounds 
          (application_id, round_number, round_type, status, remarks)
          VALUES (?, ?, ?, 'Pending', ?)
        `,
        values: [applicationId, current_round, 'interview', remarks || null]
      })
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Application updated successfully'
    }), { status: 200 })

  } catch (error) {
    console.error('Error updating application:', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    }), { status: 500 })
  }
} 