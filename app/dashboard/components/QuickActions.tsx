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
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      hoverColor: 'hover:bg-orange-100',
      requireAdmin: false
    },
    ...(isAdmin ? [{
      title: 'ข้อมูลผู้เข้าร่วมเข้าพรรษา',
      description: 'ดูและจัดการข้อมูลทั้งหมด',
      href: '/dashboard/Buddhist2025/tables',
      icon: Database,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      hoverColor: 'hover:bg-orange-100',
      requireAdmin: true
    }] : []),
    ...(isAdmin ? [{
      title: 'แดชบอร์ดเข้าพรรษา',
      description: 'สถิติและรายงาน',
      href: '/dashboard/Buddhist2025',
      icon: BarChart3,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      hoverColor: 'hover:bg-orange-100',
      requireAdmin: true
    }] : []),

    // SoberCheers Actions
    {
      title: 'เพิ่มข้อมูล SoberCheers',
      description: 'ลงทะเบียนงดเหล้าใหม่',
      href: '/soberCheers',
      icon: Wine,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100',
      requireAdmin: false
    },
    ...(isAdmin ? [{
      title: 'ข้อมูลงดเหล้าเข้าพรรษา',
      description: 'จัดการข้อมูลผู้งดเหล้า',
      href: '/dashboard/soberCheers/components/soberTable',
      icon: Database,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100',
      requireAdmin: true
    }] : []),

    // Form Return Actions
    {
      title: 'เพิ่มข้อมูลคืนงดเหล้า',
      description: 'สร้างฟอร์มคืนข้อมูลใหม่',
      href: '/form_return/create',
      icon: ClipboardList,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:bg-purple-100',
      requireAdmin: false
    },
    ...(isAdmin ? [{
      title: 'คืนข้อมูลงดเหล้า',
      description: 'จัดการรายการคืนข้อมูล',
      href: '/dashboard/formReturn',
      icon: FileText,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:bg-purple-100',
      requireAdmin: true
    }] : [])
  ];

  const filteredActions = actions.filter(action => 
    !action.requireAdmin || (action.requireAdmin && isAdmin)
  );

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <PlusCircle className="w-5 h-5 mr-2 text-gray-600" />
        การดำเนินการด่วน
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={index}
              href={action.href}
              className={`group block p-4 rounded-lg border transition-all duration-200 ${action.bgColor} ${action.borderColor} ${action.hoverColor} hover:shadow-md`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded ${action.bgColor} border ${action.borderColor}`}>
                  <Icon className={`w-5 h-5 ${action.textColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium text-sm ${action.textColor} mb-1`}>
                    {action.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}