import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { executeQuery } from '@/lib/db'
import bcrypt from 'bcryptjs'

// Role mapping constants
const ROLE_IDS = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  STUDENT: 3,
  COMPANY: 4
}

// Role to redirect path mapping
const REDIRECT_PATHS = {
  [ROLE_IDS.SUPER_ADMIN]: '/super-admin/dashboard',
  [ROLE_IDS.ADMIN]: '/admin/dashboard',
  [ROLE_IDS.STUDENT]: '/student/profile',
  [ROLE_IDS.COMPANY]: '/company/dashboard'
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
          // Early validation of all required fields
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

          // Validate selected role
          const validRoles = ['admin', 'student', 'company']
          if (!validRoles.includes(selectedRole)) {
            console.log('Invalid role selected:', selectedRole)
            return null
          }

          // First, check if user exists and get their role
          const [user] = await executeQuery({
            query: `
              SELECT 
                s.id,
          s.user_id,
          s.full_name,
          s.roll_number,
          s.branch,
          s.current_year,
          s.cgpa,
          s.phone,
          s.secondary_phone,
          s.passing_year,
          s.is_email_verified,
          s.is_verified_by_admin,
          s.degree_type,
          s.specialization,
          s.secondary_email,
          u.email as primary_email,
          u.created_at as registration_date
        FROM students s
        JOIN users u ON u.id = s.user_id
        WHERE s.user_id = ?
            `,
            values: [email]
          })

          if (!user) {
            console.log('User  not found:', email)
            return null;
          }

          // Verify password
          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) {
            console.log('Invalid password for user:', email)
            return null;
          }

          // Check role match
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
            return { error: 'Invalid credentials' };
          }

          // Additional check for student verification by admin
        if (user.role_id === ROLE_IDS.STUDENT && user.is_verified_by_admin===0) {
          console.log('Student account is pending admin verification:', email)
          return null;
        }
        if (user.role_id === ROLE_IDS.COMPANY && user.is_verified_by_admin===0) {
          console.log('Company account is pending admin verification:', email)
          return null;
        }
          // Log successful login activity
          await executeQuery({
            query: `
              INSERT INTO activity_logs 
              (user_id, action, details, ip_address) 
              VALUES (?, ?, ?, ?)
            `,
            values: [
              user.id,
              'LOGIN',
              JSON.stringify({
                role: user.role_name,
                timestamp: new Date().toISOString()
              }),
              '127.0.0.1'
            ]
          })

          // Return user object with role information and redirect path
          return {
            id: user.id,
            email: user.email,
            role: user.role_name.toUpperCase(),
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