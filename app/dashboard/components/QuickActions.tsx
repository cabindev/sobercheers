// app/dashboard/components/QuickActions.tsx
import Link from 'next/link';
import { 
  PlusCircle, 
  Database, 
  BarChart3, 
  FileText,
  Church,
  Wine,
  ClipboardList
} from 'lucide-react';

interface QuickActionsProps {
  isAdmin: boolean;
}

export default function QuickActions({ isAdmin }: QuickActionsProps) {
  const actions = [
    // Buddhist Lent 2025 Actions
    {
      title: 'เพิ่มข้อมูลเข้าพรรษา',
      description: 'เพิ่มผู้เข้าร่วมกิจกรรมใหม่',
      href: '/Buddhist2025/create',
      icon: Church,
      color: 'from-emerald-500 to-emerald-600',
      requireAdmin: false
    },
    ...(isAdmin ? [{
      title: 'ข้อมูลผู้เข้าร่วมเข้าพรรษา',
      description: 'ดูและจัดการข้อมูลทั้งหมด',
      href: '/dashboard/Buddhist2025/tables',
      icon: Database,
      color: 'from-emerald-600 to-emerald-700',
      requireAdmin: true
    }] : []),
    ...(isAdmin ? [{
      title: 'แดชบอร์ดเข้าพรรษา',
      description: 'สถิติและรายงาน',
      href: '/dashboard/Buddhist2025',
      icon: BarChart3,
      color: 'from-emerald-500 to-green-600',
      requireAdmin: true
    }] : []),

    // SoberCheers Actions
    {
      title: 'เพิ่มข้อมูล SoberCheers',
      description: 'ลงทะเบียนงดเหล้าใหม่',
      href: '/soberCheers',
      icon: Wine,
      color: 'from-violet-500 to-violet-600',
      requireAdmin: false
    },
    ...(isAdmin ? [{
      title: 'ข้อมูลงดเหล้าเข้าพรรษา',
      description: 'จัดการข้อมูลผู้งดเหล้า',
      href: '/dashboard/soberCheers/components/soberTable',
      icon: Database,
      color: 'from-violet-600 to-violet-700',
      requireAdmin: true
    }] : []),

    // Form Return Actions
    {
      title: 'เพิ่มข้อมูลคืนงดเหล้า',
      description: 'สร้างฟอร์มคืนข้อมูลใหม่',
      href: '/form_return/create',
      icon: ClipboardList,
      color: 'from-blue-500 to-blue-600',
      requireAdmin: false
    },
    ...(isAdmin ? [{
      title: 'คืนข้อมูลงดเหล้า',
      description: 'จัดการรายการคืนข้อมูล',
      href: '/dashboard/formReturn',
      icon: FileText,
      color: 'from-blue-600 to-blue-700',
      requireAdmin: true
    }] : [])
  ];

  const filteredActions = actions.filter(action => 
    !action.requireAdmin || (action.requireAdmin && isAdmin)
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
        <PlusCircle className="w-6 h-6 mr-2 text-blue-500" />
        การดำเนินการด่วน
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={index}
              href={action.href}
              className="group relative overflow-hidden bg-gradient-to-r text-white rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
              <div className="relative z-10">
                <Icon className="w-8 h-8 mb-3 text-white/90" />
                <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                <p className="text-white/80 text-sm">{action.description}</p>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}