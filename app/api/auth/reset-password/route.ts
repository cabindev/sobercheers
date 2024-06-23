import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenCreatedAt: {
          gte: new Date(Date.now() - 3600000), // 1 hour ago
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenCreatedAt: null,
      },
    });

    return NextResponse.json({ message: 'Password has been reset' });
  } catch (error) {
    return NextResponse.json({ error: 'Error resetting password' }, { status: 500 });
  }
}
