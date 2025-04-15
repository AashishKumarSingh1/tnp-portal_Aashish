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

    console.log('Received settings data:', data)

    const smtp_host = data.smtp_host ?? null
    const smtp_port = data.smtp_port ? parseInt(data.smtp_port, 10) : null
    const smtp_secure = data.smtp_secure === true ? 1 : 0
    const smtp_user = data.smtp_user ?? null
    const smtp_pass = data.smtp_pass ?? null
    const smtp_from = data.smtp_from ?? null

    if (smtp_host === null || smtp_port === null || smtp_user === null || smtp_pass === null || smtp_from === null) {
      console.error('Missing required SMTP fields:', { smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from })
      return NextResponse.json({ error: 'Missing required SMTP settings fields' }, { status: 400 })
    }

    const existingSettingsResult = await executeQuery({
      query: 'SELECT id FROM system_settings ORDER BY id DESC LIMIT 1'
    })
    const existingSettingId = existingSettingsResult?.[0]?.id

    if (existingSettingId) {
      console.log(`Updating settings for ID: ${existingSettingId}`)
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
          smtp_host,
          smtp_port,
          smtp_secure,
          smtp_user,
          smtp_pass,
          smtp_from,
          existingSettingId
        ]
      })
    } else {
      console.log('Inserting new settings')
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
          smtp_host,
          smtp_port,
          smtp_secure,
          smtp_user,
          smtp_pass,
          smtp_from
        ]
      })
    }

    await executeQuery({
        query: `
            INSERT INTO activity_logs (user_id, action, details)
            VALUES (?, ?, ?)
        `,
        values: [session.user.id, 'updated_settings', `SMTP settings ${existingSettingId ? 'updated' : 'created'}`]
    })

    return NextResponse.json({ message: `Settings ${existingSettingId ? 'updated' : 'created'} successfully` })
  } catch (error) {
    console.error('Error processing settings:', error)
    if (error.message?.includes('Bind parameters must not contain undefined')) {
       return NextResponse.json({ error: 'Internal Server Error: Undefined value passed to database query.' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}


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

 
    const validSections = ['email', 'security', 'notifications', 'maintenance']
    if (!validSections.includes(section)) {
      return NextResponse.json(
        { error: 'Invalid settings section' },
        { status: 400 }
      )
    }


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


    await logActivity(
      session.user.id,
      'settings_updated',
      `Updated ${section} settings`,
      request
    )

    // If maintenance mode is toggled, update application state
    if (section === 'maintenance' && settings.maintenance_mode !== undefined) {
      //We might use it in future to implement a way to broadcast this change to all connected clients
      
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