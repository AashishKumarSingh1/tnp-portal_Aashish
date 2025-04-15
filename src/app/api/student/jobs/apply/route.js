import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { sendApplicationSubmittedEmail } from '@/lib/email'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { jobId } = await request.json()

    // Get student details - make sure to select the correct student id
    const student = await executeQuery({
      query: `SELECT s.id as student_id, s.*, sa.*, u.email
              FROM students s 
              JOIN student_academics sa ON s.id = sa.student_id 
              JOIN users u ON s.user_id = u.id
              WHERE s.user_id = ?`,
      values: [session.user.id]
    })

    if (!student || student.length === 0) {
      return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 })
    }

    const studentData = student[0]
    
    // Make sure we're using the student ID from the students table, not the user ID
    const studentId = studentData.student_id;

    // Check if student has already applied
    const existingApplication = await executeQuery({
      query: 'SELECT * FROM student_applications WHERE student_id = ? AND jaf_id = ?',
      values: [studentId, jobId]
    })

    if (existingApplication && existingApplication.length > 0) {
      return NextResponse.json(
        { success: false, message: 'You have already applied for this position' },
        { status: 400 }
      )
    }

    // Get job details
    const job = await executeQuery({
      query: `SELECT ja.*, c.company_name as company_name, c.email as company_email
              FROM job_announcements ja
              JOIN companies c ON ja.company_id = c.id
              WHERE ja.id = ?`,
      values: [jobId]
    })

    if (!job || job.length === 0) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 })
    }

    const jobData = job[0]

    // Check eligibility
    let eligibleBatches, eligibleBranches, eligibleDegrees;
    try {
      eligibleBatches = typeof jobData.eligible_batches === 'string' 
        ? JSON.parse(jobData.eligible_batches) 
        : jobData.eligible_batches;
      
      eligibleBranches = typeof jobData.eligible_branches === 'string'
        ? JSON.parse(jobData.eligible_branches)
        : jobData.eligible_branches;
      
      eligibleDegrees = typeof jobData.eligible_degrees === 'string'
        ? JSON.parse(jobData.eligible_degrees)
        : jobData.eligible_degrees;
    } catch (error) {
      console.error('Error parsing eligibility criteria:', error);
      return NextResponse.json(
        { success: false, message: 'Invalid job eligibility criteria' },
        { status: 500 }
      )
    }

    // Convert student data to match format
    const studentBatchYear = studentData.passing_year?.toString();
    const studentBranch = studentData.branch?.toString();
    const studentDegree = studentData.degree_type?.toString();

    // Debug logging
    console.log('Eligibility Check:', {
      student: {
        year: studentBatchYear,
        branch: studentBranch,
        degree: studentDegree
      },
      requirements: {
        batches: eligibleBatches,
        branches: eligibleBranches,
        degrees: eligibleDegrees
      }
    });

    const isEligible = (
      eligibleBatches.includes(studentBatchYear) &&
      eligibleBranches.includes(studentBranch) &&
      eligibleDegrees.includes(studentDegree)
    )

    // Debug logging
    console.log('Eligibility Result:', {
      isEligible,
      yearMatch: eligibleBatches.includes(studentBatchYear),
      branchMatch: eligibleBranches.includes(studentBranch),
      degreeMatch: eligibleDegrees.includes(studentDegree)
    });

    if (!isEligible) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'You are not eligible for this position',
          details: {
            yearEligible: eligibleBatches.includes(studentBatchYear),
            branchEligible: eligibleBranches.includes(studentBranch),
            degreeEligible: eligibleDegrees.includes(studentDegree)
          }
        },
        { status: 400 }
      )
    }

    // Create application - use the correct student ID
    await executeQuery({
      query: `INSERT INTO student_applications 
              (student_id, jaf_id, status, current_round, applied_at) 
              VALUES (?, ?, 'Applied', 1, NOW())`,
      values: [studentId, jobId]
    })

    // Send email to student
    await sendApplicationSubmittedEmail(studentData, jobData);

    return NextResponse.json({ success: true, message: 'Application submitted successfully' })
  } catch (error) {
    console.error('Error in /api/student/jobs/apply:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 