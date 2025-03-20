import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions)
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  try {
    const { id } = params
    const data = await req.json()

    await executeQuery({
      query: `
        UPDATE companies 
        SET 
          company_name = ?,
          website = ?,
          contact_person_name = ?,
          contact_person_designation = ?,
          phone = ?,
          description = ?,
          updated_at = UTC_TIMESTAMP()
        WHERE id = ?
      `,
      values: [
        data.company_name,
        data.website,
        data.contact_person_name,
        data.contact_person_designation,
        data.phone,
        data.description,
        id
      ]
    })

    // Update email in users table if it changed
    if (data.email) {
      await executeQuery({
        query: `
          UPDATE users u
          JOIN companies c ON u.id = c.user_id
          SET u.email = ?
          WHERE c.id = ?
        `,
        values: [data.email, id]
      })
    }

    await logActivity(session.user.id, 'UPDATE_COMPANY', {
      companyId: id,
      changes: data
    })

    return NextResponse.json({ message: 'Company updated successfully' })
  } catch (error) {
    console.error('Error updating company:', error)
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    )
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions)
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  try {
    const { id } = params

    // Start a transaction
    await executeQuery({ query: 'START TRANSACTION' })

    try {
      // Get user_id from companies table
      const companies = await executeQuery({
        query: 'SELECT user_id FROM companies WHERE id = ?',
        values: [id]
      })

      if (!companies.length) {
        throw new Error('Company not found')
      }

      const userId = companies[0].user_id

      // Delete from companies table
      await executeQuery({
        query: 'DELETE FROM companies WHERE id = ?',
        values: [id]
      })

      // Delete from users table
      await executeQuery({
        query: 'DELETE FROM users WHERE id = ?',
        values: [userId]
      })

      // Commit the transaction
      await executeQuery({ query: 'COMMIT' })
      await logActivity(session.user.id, 'DELETE_COMPANY', {
        companyId: id,
        userId: userId
      })

      return NextResponse.json({ message: 'Company deleted successfully' })
    } catch (error) {
      // Rollback in case of error
      await executeQuery({ query: 'ROLLBACK' })
      throw error
    }
  } catch (error) {
    console.error('Error deleting company:', error)
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    )
  }
} 