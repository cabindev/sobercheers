import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { SMTPClient, Message } from 'emailjs';

const prisma = new PrismaClient();

const client = new SMTPClient({
  user: process.env.EMAIL_USER!,
  password: process.env.EMAIL_PASS!,
  host: 'smtp.gmail.com',
  ssl: true,
});

async function sendEmail(message: Message) {
  return new Promise((resolve, reject) => {
    client.send(message, (err, result) => {
      if (err) {
        console.error('Error sending email:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.error('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenCreatedAt: new Date(),
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

    const message: Message = {
      from: process.env.EMAIL_USER!,
      to: email,
      subject: 'Password Reset Request',
      attachment: [
        {
          data: `<html>Click the link below to reset your password:<br><a href="${resetUrl}">Reset Password</a></html>`,
          alternative: true,
        },
      ],
    };

    await sendEmail(message);

    return NextResponse.json({ message: 'Password reset link has been sent to your email.' });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
