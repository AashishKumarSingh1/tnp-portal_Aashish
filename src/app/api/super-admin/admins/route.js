import { executeQuery, executeTransaction } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { logActivity } from '@/app/api/admin/activity-logs/route'
import { NextResponse } from 'next/server'

// Get all admins 
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const admins = await executeQuery({
      query: `
        SELECT 
          u.id, 
          u.email, 
          u.name,
          u.batch_year,
          u.phone,
          u.department,
          u.registration_number,
          u.profile_image,
          u.is_active,
          u.created_at,
          u.updated_at,
          u.last_login,
          u.role_id
        FROM users u
        WHERE email != "kumarashish98526@gmail.com"
        AND deleted_at IS NULL
        ORDER BY u.created_at DESC
      `
    })

    return NextResponse.json(admins)
  } catch (error) {
    console.error('Error fetching admins:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    )
  }
}

// Create new admin
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      email, 
      password, 
      name,
      batchYear,
      phone,
      department,
      registrationNumber,
      isActive,
      isVerified,
      profileImage = null // optional
    } = body

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password and name are required' },
        { status: 400 }
      )
    }

    // Check if admin already exists
    const existingAdmins = await executeQuery({
      query: 'SELECT id FROM users WHERE email = ? OR registration_number = ?',
      values: [email, registrationNumber]
    })

    if (existingAdmins && existingAdmins.length > 0) {
      return NextResponse.json(
        { error: 'An admin with this email or registration number already exists' },
        { status: 400 }
      )
    }

    // Get admin role id
    const adminRoles = await executeQuery({
      query: 'SELECT id FROM roles WHERE name = ?',
      values: ['ADMIN']
    })

    if (!adminRoles || adminRoles.length === 0) {
      return NextResponse.json(
        { error: 'Admin role not found' },
        { status: 500 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new admin
    const result = await executeQuery({
      query: `
        INSERT INTO users (
          email, 
          password, 
          name, 
          batch_year,
          phone,
          department,
          registration_number,
          profile_image,
          role_id,
          is_verified,
          is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?,?)
      `,
      values: [
        email,
        hashedPassword,
        name,
        batchYear || null,
        phone || null,
        department || null,
        registrationNumber || null,
        profileImage,
        adminRoles[0].id,
        isVerified,
        isActive
      ]
    })

    if (!result || !result.insertId) {
      throw new Error('Failed to insert new admin')
    }

    // Log activity
    await logActivity(
      session.user.id,
      'CREATE_ADMIN',
      `Created new admin account: ${email} (${name})`,
      request
    )

    return NextResponse.json({
      message: 'Admin created successfully',
      admin: {
        id: result.insertId,
        email,
        name,
        batchYear,
        department,
        registrationNumber,
        createdAt: new Date()
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: 500 }
    )
  }
}

// Update admin
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      id,
      email,
      password,
      name,
      batchYear,
      phone,
      department,
      registrationNumber,
      profileImage,
      isActive,
      roleId 
    } = body

 
    let updateFields = [
      'name = ?',
      'batch_year = ?',
      'phone = ?',
      'department = ?',
      'registration_number = ?',
      'profile_image = ?',
      'is_active = ?',
      'role_id = ?',
      'email = ?'
    ]
    let values = [
      name,
      batchYear || null,
      phone || null,
      department || null,
      registrationNumber || null,
      profileImage || null,
      isActive,
      roleId,
      email
    ]

   
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateFields.push('password = ?')
      values.push(hashedPassword)
    }

    
    values.push(id)

    
    if (email) {
      const existingUser = await executeQuery({
        query: 'SELECT id FROM users WHERE email = ? AND id != ?',
        values: [email, id]
      })

      if (existingUser && existingUser.length > 0) {
        return NextResponse.json(
          { error: 'Email already in use by another user' },
          { status: 400 }
        )
      }
    }

    const result = await executeQuery({
      query: `
        UPDATE users 
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `,
      values
    })

    if (!result || result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    // Log activity
    await logActivity(
      session.user.id,
      'UPDATE_ADMIN',
      `Updated admin account: ${email} (ID: ${id})`,
      request
    )

    return NextResponse.json({
      message: 'Admin updated successfully'
    })
  } catch (error) {
    console.error('Error updating admin:', error)
    return NextResponse.json(
      { error: 'Failed to update admin' },
      { status: 500 }
    )
  }
}

// Delete admin 
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    // Get admin details for logging
    const admins = await executeQuery({
      query: 'SELECT email, name FROM users WHERE id = ? AND deleted_at IS NULL',
      values: [id]
    })

    if (!admins || admins.length === 0) {
      return NextResponse.json(
        { error: 'Admin not found or already deleted' },
        { status: 404 }
      )
    }

    const adminEmail = admins[0].email
    const adminName = admins[0].name

    // Execute the soft delete within a transaction
    try {
      await executeTransaction([
        {
          query: `
            UPDATE users 
            SET 
              deleted_at = CURRENT_TIMESTAMP,
              is_active = false,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND deleted_at IS NULL
          `,
          values: [id]
        },
        {
          query: `
            INSERT INTO activity_logs 
            (user_id, action, details) 
            VALUES (?, ?, ?)
          `,
          values: [
            session.user.id,
            'DEACTIVATE_ADMIN',
            JSON.stringify({
              message: `Deactivated admin account: ${adminEmail} (${adminName})`,
              deactivated_admin_id: id
            })
          ]
        }
      ])

      return NextResponse.json({
        message: 'Admin deactivated successfully'
      })

    } catch (error) {
      console.error('Transaction error:', error)
      throw error
    }

  } catch (error) {
    console.error('Error deactivating admin:', error)
    return NextResponse.json(
      { 
        error: 'Failed to deactivate admin',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// Add new endpoint to restore deleted admins
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id } = body

    // Get admin details for logging
    const admins = await executeQuery({
      query: 'SELECT email, name FROM users WHERE id = ? AND deleted_at IS NOT NULL',
      values: [id]
    })

    if (!admins || admins.length === 0) {
      return NextResponse.json(
        { error: 'Deleted admin not found' },
        { status: 404 }
      )
    }

    const adminEmail = admins[0].email
    const adminName = admins[0].name

    // Execute the restore within a transaction
    try {
      await executeTransaction([
        {
          query: `
            UPDATE users 
            SET 
              deleted_at = NULL,
              is_active = true,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `,
          values: [id]
        },
        {
          query: `
            INSERT INTO activity_logs 
            (user_id, action, details) 
            VALUES (?, ?, ?)
          `,
          values: [
            session.user.id,
            'RESTORE_ADMIN',
            JSON.stringify({
              message: `Restored admin account: ${adminEmail} (${adminName})`,
              restored_admin_id: id
            })
          ]
        }
      ])

      return NextResponse.json({
        message: 'Admin restored successfully'
      })

    } catch (error) {
      console.error('Transaction error:', error)
      throw error
    }

  } catch (error) {
    console.error('Error restoring admin:', error)
    return NextResponse.json(
      { 
        error: 'Failed to restore admin',
        details: error.message 
      },
      { status: 500 }
    )
  }
} 