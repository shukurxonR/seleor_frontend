import { authOptions } from '@/lib/auth-options'
import NextAuth from 'next-auth'

const hendler = NextAuth(authOptions)

export { hendler as GET, hendler as POST }
