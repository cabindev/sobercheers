// app/Buddhist2025/components/GroupSelector.tsx
'use client';

import { useState, useEffect } from 'react';
import { GroupCategory } from '@/types/group';
import { getActiveGroupCategories } from '@/app/dashboard/group-category/actions/Get';
import { FormField } from './ui/FormField';
import LoadingSkeleton from './ui/LoadingSkeleton';

interface GroupSelectorProps {
value?: number;
onChange: (groupCategoryId: number, groupCategory: GroupCategory) => void;
error?: string;
disabled?: boolean;
}

export default function GroupSelector({ value, onChange, error, disabled = false }: GroupSelectorProps) {
const [groupCategories, setGroupCategories] = useState<GroupCategory[]>([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  loadGroupCategories();
}, []);

const loadGroupCategories = async () => {
  try {
    setIsLoading(true);
    const categories = await getActiveGroupCategories();
    setGroupCategories(Array.isArray(categories) ? categories : []);
  } catch (error) {
    console.error('Error loading group categories:', error);
    setGroupCategories([]);
  } finally {
    setIsLoading(false);
  }
};

const handleSelect = (categoryId: string) => {
  const category = groupCategories.find(cat => cat.id === parseInt(categoryId));
  if (category) {
    onChange(category.id, category);
  }
};

if (isLoading) {
  return (
    <FormField label="ชื่อองค์กร" required>
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <LoadingSkeleton lines={2} />
      </div>
    </FormField>
  );
}

return (
  <FormField label="ชื่อองค์กร" required error={error}>
    {groupCategories.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {groupCategories.map((category) => (
          <label 
            key={category.id}
            className={`
              inline-flex items-center px-3 py-2 rounded-lg border cursor-pointer
              text-sm transition-colors duration-150
              ${value === category.id
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-orange-400 hover:bg-orange-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input
              type="radio"
              name="groupCategory"
              value={category.id}
              checked={value === category.id}
              onChange={() => handleSelect(category.id.toString())}
              disabled={disabled}
              className="sr-only"
            />
            <span className="whitespace-nowrap">
              {category.name}
            </span>
          </label>
        ))}
      </div>
    ) : (
      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-sm">ไม่มีองค์กรให้เลือก</p>
      </div>
    )}

    {/* แสดงคำอธิบายของหมวดหมู่ที่เลือก - Minimal Style */}
    {Boolean(value) && (
      <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        {(() => {
          const selectedCategory = groupCategories.find(cat => cat.id === value);
          return selectedCategory?.description ? (
            <p className="text-sm text-gray-700">
              <span className="text-gray-900">คำอธิบาย:</span> {selectedCategory.description}
            </p>
          ) : null;
        })()}
      </div>
    )}
  </FormField>
);
}