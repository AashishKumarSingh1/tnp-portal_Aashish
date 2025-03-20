import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logActivity } from '@/app/api/admin/activity-logs/route'
import { executeQuery } from '@/lib/db'

// Get SMTP settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await executeQuery({
      query: 'SELECT * FROM system_settings ORDER BY id DESC LIMIT 1'
    })
    if (!settings || !settings[0]) {  
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }
    return NextResponse.json(settings[0])
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// Update SMTP settings
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Check if settings exist
    const existingSettings = await executeQuery({
      query: 'SELECT id FROM system_settings LIMIT 1'
    })

    if (existingSettings) {
      // Update existing settings
      await executeQuery({
        query: `
            UPDATE system_settings SET 
              smtp_host = ?,
              smtp_port = ?,
              smtp_secure = ?,
              smtp_user = ?,
              smtp_pass = ?,
          smtp_from = ?
        WHERE id = ?`,
        values: [
          data.smtp_host,
          data.smtp_port,
          data.smtp_secure ? 1 : 0,
          data.smtp_user,
          data.smtp_pass,
          data.smtp_from,
          existingSettings.id
        ]
      })
    } else {
      // Insert new settings
      await executeQuery({
        query: `
          INSERT INTO system_settings (
            smtp_host,
            smtp_port,
            smtp_secure,
            smtp_user,
            smtp_pass,
            smtp_from
          ) VALUES (?, ?, ?, ?, ?, ?)`,
        values: [
          data.smtp_host,
          data.smtp_port,
          data.smtp_secure ? 1 : 0,
          data.smtp_user,
          data.smtp_pass,
          data.smtp_from
        ]
      })
    }

    //add detail in activity logs
    await executeQuery({
        query: `
            INSERT INTO activity_logs (user_id, action, details)
            VALUES (?, ?, ?)
        `,
        values: [session.user.id, 'updated_settings', 'SMTP settings updated']
    })

    return NextResponse.json({ message: 'Settings updated successfully' })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}

// Get settings
export async function GET_old(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get settings from database
    const settings = await executeQuery({
      query: 'SELECT * FROM system_settings WHERE id = 1'
    })

    if (!settings || !settings[0]) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }

    // Parse JSON fields
    const parsedSettings = {
      email: JSON.parse(settings?.email_settings || '{}'),
      security: JSON.parse(settings?.security_settings || '{}'),
      notifications: JSON.parse(settings?.notification_settings || '{}'),
      maintenance: JSON.parse(settings?.maintenance_settings || '{}')
    }

    return NextResponse.json(parsedSettings)
  } catch (error) {
    console.error('Get Settings Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// Update settings
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { section, settings } = await request.json()

    // Validate section
    const validSections = ['email', 'security', 'notifications', 'maintenance']
    if (!validSections.includes(section)) {
      return NextResponse.json(
        { error: 'Invalid settings section' },
        { status: 400 }
      )
    }

    // Update settings in database
    const columnName = `${section}_settings`
    await executeQuery({
      query: `
        INSERT INTO system_settings (id, ${columnName}, updated_at)
        VALUES (1, ?, CURRENT_TIMESTAMP)
        ON DUPLICATE KEY UPDATE
        ${columnName} = ?,
        updated_at = CURRENT_TIMESTAMP
      `,
      values: [JSON.stringify(settings), JSON.stringify(settings)]
    })

    // Log activity
    await logActivity(
      session.user.id,
      'settings_updated',
      `Updated ${section} settings`,
      request
    )

    // If maintenance mode is toggled, update application state
    if (section === 'maintenance' && settings.maintenance_mode !== undefined) {
      // You might want to implement a way to broadcast this change to all connected clients
      // For example, using WebSocket or Server-Sent Events
    }

    return NextResponse.json({
      message: 'Settings updated successfully'
    })
  } catch (error) {
    console.error('Update Settings Error:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
} 