// app/Buddhist2025/components/ui/StatusBadge.tsx
interface StatusBadgeProps {
  status: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
}

const statusStyles = {
  success: 'bg-green-50/80 backdrop-blur-sm border-green-200 text-green-700',
  error: 'bg-rose-50/80 backdrop-blur-sm border-rose-200 text-rose-700',
  warning: 'bg-amber-50/80 backdrop-blur-sm border-amber-200 text-amber-700',
  info: 'bg-blue-50/80 backdrop-blur-sm border-blue-200 text-blue-700'
};

export default function StatusBadge({ status, children, className = "" }: StatusBadgeProps) {
  return (
    <div className={`
      px-3 py-2 rounded-lg border shadow-sm text-sm font-medium
      ${statusStyles[status]}
      ${className}
    `}>
      {children}
    </div>
  );
}