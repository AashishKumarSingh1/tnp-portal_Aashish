import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { executeQuery } from '@/lib/db'
``
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    //# id, user_id, company_name, website, email, description, contact_person_name, contact_person_designation, phone, created_at, updated_at, is_email_verified, is_verified_by_admin
//'2', '9', 'Ashish Software solutions Pvt. Ltd', 'https://glucoguard.github.io/landing-page/', 'araash375@gmail.com', 'https://glucoguard.github.io/landing-page/', 'Ashish ', 'HR', '8083285661', '2025-03-12 13:06:01', '2025-03-13 11:24:17', '1', '1'

    const query = `
      SELECT c.company_name, c.email,
      c.description, c.website, c.contact_person_name, c.contact_person_designation, c.phone
      FROM companies c 
      WHERE c.user_id = ?
    `
    const result = await executeQuery({
      query,
      values: [session.user.id]
    })

    if (!result.length) {
      return new Response(JSON.stringify({ error: 'Company not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify(result[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
} 

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await request.json()

    const query = `
      UPDATE companies 
      SET description = ?, website = ?, contact_person_name = ?, contact_person_designation = ?, phone = ?, is_verified_by_admin = ?
      WHERE user_id = ?
    `
    const result = await executeQuery({
      query,
      values: [
        data.description,
        data.website,
        data.contact_person_name,
        data.contact_person_designation,
        data.phone,
        session.user.id
      ]
    })

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: 'Failed to update profile' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ message: 'Profile updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}