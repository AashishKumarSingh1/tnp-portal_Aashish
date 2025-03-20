import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { executeQuery } from './db'
import bcrypt from 'bcryptjs'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Find user
          const [user] = await executeQuery({
            query: `
              SELECT u.*, r.name as role
              FROM users u
              JOIN roles r ON u.role_id = r.id
              WHERE u.email = ?
            `,
            values: [credentials.email]
          })

          if (!user) {
            throw new Error('No user found')
          }

          // Check password
          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (!isValid) {
            throw new Error('Invalid password')
          }

          // Check if user is active
          if (!user.is_active) {
            throw new Error('Account is inactive')
          }

          // For non-admin users, check verification
          if (!['super_admin', 'admin'].includes(user.role) && !user.is_verified) {
            throw new Error('Account is not verified')
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            isVerified: user.is_verified,
            isActive: user.is_active
          }
        } catch (error) {
          console.error('Auth Error:', error)
          throw error
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id || token.sub,
          role: token.role,
          isSuper: token.isSuper,
          isAdmin: token.isAdmin,
          roleId: token.roleId,
          redirectPath: token.redirectPath,
        },
      }
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.isSuper = user.isSuper
        token.isAdmin = user.isAdmin
        token.roleId = user.roleId
        token.redirectPath = user.redirectPath
      }
      return token
    },
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