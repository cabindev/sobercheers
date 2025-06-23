// app/organization/components/OrganizationSelector.tsx
'use client';

import { useState, useEffect } from 'react';
import { OrganizationCategory } from '@/types/organization';
import { getActiveOrganizationCategories } from '@/app/dashboard/organization-category/actions/Get';
import { FormField } from './ui/FormField';
import LoadingSkeleton from './ui/LoadingSkeleton';

interface OrganizationSelectorProps {
  value?: number;
  onChange: (organizationCategoryId: number, organizationCategory: OrganizationCategory) => void;
  error?: string;
  disabled?: boolean;
}

export default function OrganizationSelector({ value, onChange, error, disabled = false }: OrganizationSelectorProps) {
  const [organizationCategories, setOrganizationCategories] = useState<OrganizationCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrganizationCategories();
  }, []);

  const loadOrganizationCategories = async () => {
    try {
      setIsLoading(true);
      const categories = await getActiveOrganizationCategories();
      setOrganizationCategories(Array.isArray(categories) ? categories : []);
    } catch (error) {
      console.error('Error loading organization categories:', error);
      setOrganizationCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (categoryId: string) => {
    const category = organizationCategories.find(cat => cat.id === parseInt(categoryId));
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
    <FormField label="ชื่อองค์กร | Organization" required error={error}>
      {organizationCategories.length > 0 ? (
        <div className="space-y-3">
          {/* Group by category type */}
          {Array.from(new Set(organizationCategories.map(cat => cat.categoryType))).map((categoryType) => {
            const categoriesInType = organizationCategories.filter(cat => cat.categoryType === categoryType);
            
            return (
              <div key={categoryType} className="space-y-2">
                <div className="text-xs font-medium text-gray-600 uppercase tracking-wide px-1">
                  {categoryType}
                </div>
                <div className="flex flex-wrap gap-2">
                  {categoriesInType.map((category) => (
                    <label 
                      key={category.id}
                      className={`
                        inline-flex items-center px-2 py-1.5 rounded text-xs cursor-pointer border
                        transition-colors duration-150
                        ${value === category.id
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-orange-400 hover:bg-orange-50'
                        }
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <input
                        type="radio"
                        name="organizationCategory"
                        value={category.id}
                        checked={value === category.id}
                        onChange={() => handleSelect(category.id.toString())}
                        disabled={disabled}
                        className="sr-only"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {category.name}
                        </span>
                 
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-sm">ไม่มีองค์กรให้เลือก</p>
        </div>
      )}

      {/* แสดงคำอธิบายขององค์กรที่เลือก */}
      {Boolean(value) && (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          {(() => {
            const selectedCategory = organizationCategories.find(cat => cat.id === value);
            return selectedCategory?.description ? (
              <p className="text-sm text-gray-700">
                <span className="text-gray-900 font-medium">คำอธิบาย:</span> {selectedCategory.description}
              </p>
            ) : null;
          })()}
        </div>
      )}
    </FormField>
  );
}