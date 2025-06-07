// app/lib/db.ts
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    // ✅ ปรับปรุง log configuration
    log: process.env.NODE_ENV === 'development' 
      ? ['error', 'warn'] // ลดจาก ['query', 'error', 'warn']
      : ['error'], // production ให้ log เฉพาะ error
    errorFormat: 'minimal',
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma