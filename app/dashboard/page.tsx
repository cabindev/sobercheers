// app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import authOptions from '../lib/configs/auth/authOptions';
import { BarChart3, Users, FileText, TrendingUp, Calendar, Award } from 'lucide-react';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/auth/signin?callbackUrl=/dashboard');
    }

    const isAdmin = session.user.role === 'admin';
    const user = session.user;

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    ยินดีต้อนรับ, {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600">
                    {isAdmin ? 'แดชบอร์ดผู้ดูแลระบบ' : 'แดชบอร์ดผู้ใช้งาน'} - ระบบ SOBER CHEERs
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    icon={<BarChart3 className="w-6 h-6 text-white" />}
                    title="สถานะบัญชี"
                    value={isAdmin ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'}
                    gradient="from-blue-500 to-blue-600"
                />
                <StatsCard
                    icon={<Users className="w-6 h-6 text-white" />}
                    title="อีเมล"
                    value={user.email}
                    gradient="from-green-500 to-green-600"
                />
                <StatsCard
                    icon={<Calendar className="w-6 h-6 text-white" />}
                    title="เข้าสู่ระบบ"
                    value="วันนี้"
                    gradient="from-amber-500 to-amber-600"
                />
                <StatsCard
                    icon={<Award className="w-6 h-6 text-white" />}
                    title="โครงการ"
                    value="งดเหล้าเข้าพรรษา"
                    gradient="from-purple-500 to-purple-600"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {isAdmin && <AdminActions />}
                <UserActions />
            </div>

            {/* Project Info */}
            <ProjectInfo />
        </div>
    );
}

function StatsCard({ icon, title, value, gradient }: { icon: React.ReactNode; title: string; value: string; gradient: string }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
                <div className={`p-3 bg-gradient-to-r ${gradient} rounded-lg`}>
                    {icon}
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
}

function AdminActions() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-amber-500" />
                    การจัดการสำหรับผู้ดูแลระบบ
                </h2>
            </div>
            <div className="p-6 space-y-4">
                <ActionLink
                    href="/dashboard/soberCheers"
                    icon={<TrendingUp className="w-5 h-5 text-white" />}
                    title="SoberCheers Dashboard"
                    description="ดูข้อมูลและสถิติผู้งดเหล้า"
                    gradient="from-amber-50 to-amber-100"
                />
                <ActionLink
                    href="/dashboard/soberCheers/components/soberTable"
                    icon={<FileText className="w-5 h-5 text-white" />}
                    title="ข้อมูลงดเหล้าเข้าพรรษา 2567"
                    description="จัดการและดูตารางข้อมูลผู้งดเหล้า"
                    gradient="from-blue-50 to-blue-100"
                />
                <ActionLink
                    href="/dashboard/member/components/admin"
                    icon={<Users className="w-5 h-5 text-white" />}
                    title="Admin Panel"
                    description="จัดการผู้ดูแลระบบและสิทธิ์"
                    gradient="from-purple-50 to-purple-100"
                />
            </div>
        </div>
    );
}

function UserActions() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-500" />
                    การดำเนินการทั่วไป
                </h2>
            </div>
            <div className="p-6 space-y-4">
                <ActionLink
                    href="/soberCheers"
                    icon={
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    }
                    title="เพิ่มข้อมูล SoberCheers"
                    description="บันทึกข้อมูลการงดเหล้าใหม่"
                    gradient="from-green-50 to-green-100"
                />
                <ActionLink
                    href="/form_return/create"
                    icon={<FileText className="w-5 h-5 text-white" />}
                    title="เพิ่มข้อมูลงดเหล้าเข้าพรรษา"
                    description="สร้างฟอร์มคืนข้อมูลใหม่"
                    gradient="from-orange-50 to-orange-100"
                />
                <ActionLink
                    href="/profile"
                    icon={
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    }
                    title="จัดการโปรไฟล์"
                    description="แก้ไขข้อมูลส่วนตัว"
                    gradient="from-indigo-50 to-indigo-100"
                />
            </div>
        </div>
    );
}

function ActionLink({ href, icon, title, description, gradient }: { href: string; icon: React.ReactNode; title: string; description: string; gradient: string }) {
    return (
        <a
            href={href}
            className={`flex items-center p-4 bg-gradient-to-r ${gradient} border rounded-lg hover:from-opacity-75 transition-all duration-200 group`}
        >
            <div className="p-2 rounded-lg group-hover:bg-opacity-75 transition-colors">
                {icon}
            </div>
            <div className="ml-4">
                <p className="font-medium text-gray-900">{title}</p>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </a>
    );
}

function ProjectInfo() {
    return (
        <div className="mt-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold mb-2">โครงการงดเหล้าเข้าพรรษา 2567</h3>
                    <p className="text-amber-100">
                        ร่วมเป็นส่วนหนึ่งของการสร้างสุขภาวะที่ดีในช่วงเข้าพรรษา
                    </p>
                </div>
                <div className="hidden md:block">
                    <Award className="w-16 h-16 text-amber-200" />
                </div>
            </div>
        </div>
    );
}
