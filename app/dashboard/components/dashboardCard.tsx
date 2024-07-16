import React from 'react';

type DashboardCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
};

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, bgColor }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md ${bgColor}`}>
      <div className="flex items-center">
        <div className="p-2 rounded-full bg-white">
          {icon}
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-500">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
