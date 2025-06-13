// app/dashboard/profile/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Edit, 
  LayoutDashboard, 
  LogOut,
  ArrowLeft,
  Camera
} from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  role: string;
}

interface Session {
  user: User;
}

export default function Profile() {
  const { data: session, status } = useSession() as { data: Session | null; status: string };
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status !== "authenticated" || !session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const isAdmin = session.user.role === 'admin';

  const handleEditProfile = () => {
    router.push(`/auth/form_signup/edit/${session.user.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              กลับ
            </button>
            <h1 className="text-2xl font-bold text-gray-900">โปรไฟล์ของฉัน</h1>
            <div className="w-16"></div> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-32 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                  <img
                    src={
                      imageError
                        ? "/images/default-profile.png"
                        : session.user.image || "/images/default-profile.png"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                </div>
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-20 pb-8 px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {session.user.firstName} {session.user.lastName}
                </h2>
                <p className="text-gray-600 flex items-center mb-4">
                  <Mail className="w-4 h-4 mr-2" />
                  {session.user.email}
                </p>
                <div className="flex items-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isAdmin 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    <Shield className="w-4 h-4 mr-1" />
                    {isAdmin ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <User className="w-6 h-6 text-amber-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">ข้อมูลส่วนตัว</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">ชื่อ</p>
                <p className="font-medium text-gray-900">{session.user.firstName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">นามสกุล</p>
                <p className="font-medium text-gray-900">{session.user.lastName}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-blue-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">ข้อมูลบัญชี</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">อีเมล</p>
                <p className="font-medium text-gray-900">{session.user.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">ประเภทสมาชิก</p>
                <p className="font-medium text-gray-900">
                  {isAdmin ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">การดำเนินการ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={handleEditProfile}
              className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
            >
              <Edit className="w-5 h-5 mr-2" />
              แก้ไขโปรไฟล์
            </button>

            {isAdmin && (
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-sm"
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                แดชบอร์ด
              </button>
            )}

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm"
            >
              <LogOut className="w-5 h-5 mr-2" />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}