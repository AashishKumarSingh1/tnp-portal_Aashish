import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    // Get total companies
    const [totalCompanies] = await executeQuery({
      query: 'SELECT COUNT(*) as count FROM companies WHERE is_verified_by_admin = true'
    })

    // Get total students
    const [totalStudents] = await executeQuery({
      query: 'SELECT COUNT(*) as count FROM students WHERE is_verified_by_admin = true'
    })

    // Get pending verifications
    const [pendingCompanies] = await executeQuery({
      query: 'SELECT COUNT(*) as count FROM companies WHERE is_verified_by_admin = false'
    })

    const [pendingStudents] = await executeQuery({
      query: 'SELECT COUNT(*) as count FROM students WHERE is_verified_by_admin = false'
    })

    // Get recent registrations
    const recentRegistrations = await executeQuery({
      query: `
        SELECT 
          CASE 
            WHEN c.id IS NOT NULL THEN 'company'
            WHEN s.id IS NOT NULL THEN 'student'
          END as type,
          COALESCE(c.company_name, s.full_name) as name,
          u.email,
          u.created_at
        FROM users u
        LEFT JOIN companies c ON u.id = c.user_id
        LEFT JOIN students s ON u.id = s.user_id
        WHERE u.role_id IN (3, 4) -- Student and Company roles
        ORDER BY u.created_at DESC
        LIMIT 5
      `
    })

    return NextResponse.json({
      stats: {
        totalCompanies: totalCompanies.count,
        totalStudents: totalStudents.count,
        pendingVerifications: pendingCompanies.count + pendingStudents.count,
        recentRegistrations
      }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
} 