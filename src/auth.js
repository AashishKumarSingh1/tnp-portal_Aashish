import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { executeQuery } from '@/lib/db'
import bcrypt from 'bcryptjs'


const ROLE_IDS = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  STUDENT: 3,
  COMPANY: 4
}

const REDIRECT_PATHS = {
  [ROLE_IDS.SUPER_ADMIN]: '/super-admin/dashboard',
  [ROLE_IDS.ADMIN]: '/admin/dashboard',
  [ROLE_IDS.STUDENT]: '/student/dashboard',
  [ROLE_IDS.COMPANY]: '/company/dashboard'
}


const ROLE_NAMES = {
  [ROLE_IDS.SUPER_ADMIN]: 'SUPER_ADMIN',
  [ROLE_IDS.ADMIN]: 'ADMIN',
  [ROLE_IDS.STUDENT]: 'STUDENT',
  [ROLE_IDS.COMPANY]: 'COMPANY'
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' }
      },
      
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password || !credentials?.role) {
            console.log('Missing credentials:', { 
              hasEmail: !!credentials?.email, 
              hasPassword: !!credentials?.password, 
              hasRole: !!credentials?.role 
            })
            return null
          }

          const { email, password, role } = credentials
          const selectedRole = role.toLowerCase()

          const validRoles = ['admin', 'student', 'company']
          if (!validRoles.includes(selectedRole)) {
            console.log('Invalid role selected:', selectedRole)
            return null
          }
          console.log('Selected role:', selectedRole)

          const [user] = await executeQuery({
            query: `
              SELECT 
                u.*,
                s.id as student_id,
                s.full_name,
                s.roll_number,
                s.branch,
                s.current_year,
                s.cgpa,
                s.phone,
                s.secondary_phone,
                s.passing_year,
                s.is_email_verified as student_is_email_verified,
                s.is_verified_by_admin as student_is_verified_by_admin,
                s.degree_type,
                s.specialization,
                s.secondary_email,
                c.id as company_id,
                c.company_name,
                c.is_verified_by_admin as company_is_verified_by_admin,
                r.name as role_name
              FROM users u
              LEFT JOIN students s ON s.user_id = u.id
              LEFT JOIN companies c ON c.user_id = u.id
              LEFT JOIN roles r ON u.role_id = r.id
              WHERE u.email = ?
            `,
            values: [email]
          })

          if (!user) {
            console.log('User not found:', email)
            return null
          }

          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) {
            console.log('Invalid password for user:', email)
            return null
          }

          // Check if account is deactivated
          if (!user.is_active) {
            console.log('Account is deactivated:', email)
            throw new Error(
              'Your account has been deactivated by the admin. ' +
              'Please contact office.tnp@nitp.ac.in with your details for assistance. ' +
              (user.deactivation_reason ? `\n\nReason: ${user.deactivation_reason}` : '')
            )
          }

          const isAdminRole = user.role_id === ROLE_IDS.SUPER_ADMIN || user.role_id === ROLE_IDS.ADMIN
          const hasValidRole = (
            (selectedRole === 'admin' && isAdminRole) ||
            (selectedRole === 'student' && user.role_id === ROLE_IDS.STUDENT) ||
            (selectedRole === 'company' && user.role_id === ROLE_IDS.COMPANY)
          )

          if (!hasValidRole) {
            console.log('Role mismatch:', {
              selectedRole,
              actualRole: user.role_name,
              roleId: user.role_id
            })
            return { error: 'Invalid credentials' }
          }

          if (user.role_id === ROLE_IDS.STUDENT && (!user.student_is_verified_by_admin || user.student_is_verified_by_admin === 0)) {
            console.log('Student account is pending admin verification:', email)
            throw new Error('Your account is pending admin verification. Please contact T&P office for assistance.')
          }
          if (user.role_id === ROLE_IDS.COMPANY && (!user.company_is_verified_by_admin || user.company_is_verified_by_admin === 0)) {
            console.log('Company account is pending admin verification:', email)
            throw new Error('Your company account is pending admin verification. Please contact T&P office for assistance.')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.full_name,
            role: ROLE_NAMES[user.role_id],
            isSuper: user.role_id === ROLE_IDS.SUPER_ADMIN,
            isAdmin: user.role_id === ROLE_IDS.ADMIN,
            roleId: user.role_id,
            redirectPath: REDIRECT_PATHS[user.role_id]
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          id: user.id,
          role: user.role,
          isSuper: user.isSuper,
          isAdmin: user.isAdmin,
          roleId: user.roleId,
          redirectPath: user.redirectPath
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          isSuper: token.isSuper,
          isAdmin: token.isAdmin,
          roleId: token.roleId,
          redirectPath: token.redirectPath
        }
      }
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }