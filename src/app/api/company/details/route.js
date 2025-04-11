//company detail route 
import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

// GET endpoint to fetch company details
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get company_id
    const [company] = await executeQuery({
      query: 'SELECT id FROM companies WHERE user_id = ?',
      values: [session.user.id]
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    // Fetch company details
    const [details] = await executeQuery({
      query: `
        SELECT 
          head_office_address,
          hr_head_name,
          mailing_address,
          hr_head_contact,
          hr_executive_name,
          hr_executive_contact,
          spoc_name,
          spoc_contact,
          total_employees,
          annual_turnover,
          company_category,
          other_category,
          industry_sector,
          other_sector
        FROM company_details 
        WHERE company_id = ?
      `,
      values: [company.id]
    })

    return NextResponse.json(details || {})
  } catch (error) {
    console.error('Error fetching company details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch company details' },
      { status: 500 }
    )
  }
}

// PUT endpoint to update company details
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get company_id
    const [company] = await executeQuery({
      query: 'SELECT id FROM companies WHERE user_id = ?',
      values: [session.user.id]
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    const data = await request.json()

    // Validate required fields
    const requiredFields = [
      'head_office_address',
      'hr_head_name',
      'hr_executive_name',
      'hr_executive_contact',
      'spoc_name',
      'spoc_contact',
      'total_employees',
      'company_category',
      'industry_sector'
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
    const phoneFields = ['hr_head_contact', 'hr_executive_contact', 'spoc_contact']
    for (const field of phoneFields) {
      if (data[field] && !phoneRegex.test(data[field])) {
        return NextResponse.json(
          { error: `Invalid phone number for ${field}` },
          { status: 400 }
        )
      }
    }

    // Check if record exists
    const [existingRecord] = await executeQuery({
      query: 'SELECT id FROM company_details WHERE company_id = ?',
      values: [company.id]
    })

    const query = existingRecord
      ? `UPDATE company_details SET
          head_office_address = ?,
          hr_head_name = ?,
          mailing_address = ?,
          hr_head_contact = ?,
          hr_executive_name = ?,
          hr_executive_contact = ?,
          spoc_name = ?,
          spoc_contact = ?,
          total_employees = ?,
          annual_turnover = ?,
          company_category = ?,
          other_category = ?,
          industry_sector = ?,
          other_sector = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE company_id = ?`
      : `INSERT INTO company_details (
          company_id,
          head_office_address,
          hr_head_name,
          mailing_address,
          hr_head_contact,
          hr_executive_name,
          hr_executive_contact,
          spoc_name,
          spoc_contact,
          total_employees,
          annual_turnover,
          company_category,
          other_category,
          industry_sector,
          other_sector
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

    const values = [
      data.head_office_address,
      data.hr_head_name,
      data.mailing_address || null,
      data.hr_head_contact || null,
      data.hr_executive_name,
      data.hr_executive_contact,
      data.spoc_name,
      data.spoc_contact,
      parseInt(data.total_employees),
      data.annual_turnover || null,
      data.company_category,
      data.company_category === 'Other' ? data.other_category : null,
      data.industry_sector,
      data.industry_sector === 'Other' ? data.other_sector : null
    ]

    if (existingRecord) {
      values.push(company.id) // Add company_id for WHERE clause
    } else {
      values.unshift(company.id) // Add company_id at the beginning for INSERT
    }

    await executeQuery({
      query,
      values
    })

    return NextResponse.json({ message: 'Company details updated successfully' })
  } catch (error) {
    console.error('Error updating company details:', error)
    return NextResponse.json(
      { error: 'Failed to update company details' },
      { status: 500 }
    )
  }
}