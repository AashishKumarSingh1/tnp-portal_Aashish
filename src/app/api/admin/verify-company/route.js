import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendCompanyVerificationEmail, sendCompanyRejectionEmail } from '@/lib/email'

// Get pending company verifications
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['super_admin', 'admin'].includes(session.user.role.toLowerCase())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const companies = await executeQuery({
      query: `
        SELECT 
          c.id,
          c.user_id,
          c.company_name,
          c.website,
          c.description,
          c.contact_person_name,
          c.contact_person_designation,
          c.phone,
          c.is_email_verified,
          c.is_verified_by_admin,
          u.email,
          u.created_at,
          cd.head_office_address,
          cd.hr_head_name,
          cd.hr_head_contact,
          cd.hr_executive_name,
          cd.hr_executive_contact,
          cd.total_employees,
          cd.annual_turnover,
          cd.company_category,
          cd.industry_sector
        FROM companies c
        JOIN users u ON c.user_id = u.id
        LEFT JOIN company_details cd ON c.id = cd.company_id
        WHERE c.is_verified_by_admin = false
        ORDER BY c.created_at DESC
      `
    })

    return NextResponse.json({ companies })
  } catch (error) {
    console.error('Error fetching pending companies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending companies' },
      { status: 500 }
    )
  }
}

// Verify or reject company
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['super_admin', 'admin'].includes(session.user.role.toLowerCase())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { companyId, action } = await req.json()

    if (!companyId || !action) {
      return NextResponse.json(
        { error: 'Company ID and action are required' },
        { status: 400 }
      )
    }

    
    const [company] = await executeQuery({
      query: `
        SELECT c.*, u.email 
        FROM companies c
        JOIN users u ON u.id = c.user_id
        WHERE c.id = ?
      `,
      values: [companyId]
    })

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

   
    await executeQuery({
      query: `
        UPDATE companies c
        JOIN users u ON u.id = c.user_id
        SET 
          c.is_verified_by_admin = ?,
          u.is_verified = ?,
          c.updated_at = UTC_TIMESTAMP()
        WHERE c.id = ?
      `,
      values: [action === 'verify' ? 1 : 0, action === 'verify' ? 1 : 0, companyId]
    })

    
    if (action === 'verify') {
      await sendCompanyVerificationEmail(company.email, company.company_name)
    } else {
      await sendCompanyRejectionEmail(company.email, company.company_name)
    }

    
    await executeQuery({
      query: `
        INSERT INTO activity_logs
        (user_id, action, details, ip_address)
        VALUES (?, ?, ?, ?)
      `,
      values: [
        session.user.id,
        'COMPANY_VERIFICATION',
        JSON.stringify({ companyId, action, companyName: company.company_name }),
        req.headers.get('x-forwarded-for') || '127.0.0.1'
      ]
    })

    return NextResponse.json({
      message: `Company ${action === 'verify' ? 'verified' : 'rejected'} successfully`
    })

  } catch (error) {
    console.error('Error processing company verification:', error)
    return NextResponse.json(
      { error: 'Failed to process company verification' },
      { status: 500 }
    )
  }
} 