import { authOptions } from '@/auth'
import NextAuth from 'next-auth'

const handler = NextAuth(authOptions)

export async function GET(req, context) {
  await context.params;
  return handler(req, context);
}

export async function POST(req, context) {
  await context.params;
  return handler(req, context);
}