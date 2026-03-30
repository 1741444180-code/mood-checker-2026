import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
<<<<<<< HEAD

export default prisma
=======
>>>>>>> 9b1466c (feat: Day 25 会员系统 API 完成)
