// app/Buddhist2025/edit/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getBuddhist2025ById } from '../../actions/Get';
import BuddhistLentForm from '../../components/BuddhistLentForm';
import { Buddhist2025FormData } from '@/types/buddhist';

interface EditPageProps {
  params: {
    id: string;
  };
}

export default async function EditBuddhist2025Page({ params }: EditPageProps) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    notFound();
  }

  try {
    const result = await getBuddhist2025ById(id);

    if (!result.success || !result.data) {
      notFound();
    }

    const buddhist = result.data;

    // แปลงข้อมูลให้เข้ากับ FormData format
    const formData: Buddhist2025FormData = {
      id: buddhist.id,
      gender: buddhist.gender || undefined,
      firstName: buddhist.firstName,
      lastName: buddhist.lastName,
      age: buddhist.age,
      addressLine1: buddhist.addressLine1,
      district: buddhist.district,
      amphoe: buddhist.amphoe,
      province: buddhist.province,
      zipcode: buddhist.zipcode,
      type: buddhist.type || undefined,
      phone: buddhist.phone || undefined,
      alcoholConsumption: buddhist.alcoholConsumption,
      drinkingFrequency: buddhist.drinkingFrequency || undefined,
      intentPeriod: buddhist.intentPeriod || undefined,
      monthlyExpense: buddhist.monthlyExpense || undefined,
      motivations: Array.isArray(buddhist.motivations) 
        ? buddhist.motivations 
        : typeof buddhist.motivations === 'string' 
          ? JSON.parse(buddhist.motivations)
          : [],
      healthImpact: buddhist.healthImpact,
      groupCategoryId: buddhist.groupCategoryId,
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <BuddhistLentForm 
            initialData={formData}
            isEdit={true}
          />
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading Buddhist2025 data:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: EditPageProps) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return {
      title: 'ไม่พบข้อมูล - แก้ไขผู้สมัครเข้าพรรษา 2025',
    };
  }

  try {
    const result = await getBuddhist2025ById(id);
    
    if (!result.success || !result.data) {
      return {
        title: 'ไม่พบข้อมูล - แก้ไขผู้สมัครเข้าพรรษา 2025',
      };
    }

    const buddhist = result.data;
    
    return {
      title: `แก้ไขข้อมูล ${buddhist.firstName} ${buddhist.lastName} - เข้าพรรษา 2025`,
      description: `แก้ไขข้อมูลผู้สมัครโครงการเข้าพรรษา 2025: ${buddhist.firstName} ${buddhist.lastName}`,
    };
  } catch (error) {
    return {
      title: 'เกิดข้อผิดพลาด - แก้ไขผู้สมัครเข้าพรรษา 2025',
    };
  }
}

export const dynamic = 'force-dynamic';