import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const campaign = await prisma.campaignBuddhistLent.findUnique({
      where: { id: Number(params.id) },
    });
    return NextResponse.json(campaign);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const formData = await req.json();
  const { firstName, lastName, gender, birthday, addressLine1, district, amphoe, province, zipcode, type, phone, job, alcoholConsumption, drinkingFrequency, intentPeriod, monthlyExpense, motivations, healthImpact } = formData;

  try {
    const updatedCampaign = await prisma.campaignBuddhistLent.update({
      where: { id: Number(params.id) },
      data: {
        firstName,
        lastName,
        gender,
        birthday: new Date(birthday),
        addressLine1,
        district,
        amphoe,
        province,
        zipcode,
        type,
        phone,
        job,
        alcoholConsumption,
        drinkingFrequency,
        intentPeriod,
        monthlyExpense: monthlyExpense ? parseInt(monthlyExpense) : null,
        motivations,
        healthImpact,
      },
    });

    revalidatePath('/profile');

    return NextResponse.json(updatedCampaign);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const campaign = await prisma.campaignBuddhistLent.findUnique({
      where: { id: Number(params.id) },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const deletedCampaign = await prisma.campaignBuddhistLent.delete({
      where: { id: Number(params.id) },
    });

    revalidatePath('/profile');

    return NextResponse.json(deletedCampaign);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}