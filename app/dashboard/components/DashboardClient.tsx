// app/dashboard/components/DashboardClient.tsx
'use client'

import { useDashboard } from '../context/DashboardContext'
import Sidebar from './Sidebar'
import TopNav from './TopNav'
import { cn } from '@/lib/utils'

interface DashboardClientProps {
  children: React.ReactNode
  user: any
}

export default function DashboardClient({ children, user }: DashboardClientProps) {
  const { sidebarCollapsed } = useDashboard()

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={user} />
      
      {/* Main content area */}
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
        )}
      >
        <TopNav user={user} />
        
        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}