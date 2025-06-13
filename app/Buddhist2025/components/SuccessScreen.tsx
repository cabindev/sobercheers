// app/Buddhist2025/components/SuccessScreen.tsx
import { CheckCircle } from 'lucide-react';

interface SuccessScreenProps {
  isEdit: boolean;
}

export default function SuccessScreen({ isEdit }: SuccessScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="
          bg-white/80 backdrop-blur-sm
          rounded-3xl shadow-2xl 
          border border-green-200/50
          p-8 text-center
          animate-in fade-in slide-in-from-bottom-4 duration-500
        ">
          <div className="
            w-20 h-20 mx-auto mb-6
            bg-gradient-to-r from-green-400 to-emerald-500
            rounded-full flex items-center justify-center
            shadow-lg shadow-green-200
          ">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {isEdit ? 'แก้ไขข้อมูลเรียบร้อย!' : 'ลงทะเบียนสำเร็จ!'}
          </h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {isEdit 
              ? 'ข้อมูลของคุณได้รับการอัพเดทแล้ว' 
              : 'ยินดีต้อนรับเข้าสู่โครงการเข้าพรรษา 2568'
            }
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <div className="animate-spin h-5 w-5 border-2 border-green-400 border-t-transparent rounded-full"></div>
            <p className="text-sm">กำลังนำไปหน้ารายการ...</p>
          </div>
        </div>
      </div>
    </div>
  );
}