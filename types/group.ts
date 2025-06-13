export interface GroupCategory {
  id: number;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    buddhist2025: number;
  };
}

export interface GroupCategoryFormData {
  id?: number;
  name: string;
  description?: string;
}

export interface CreateGroupCategoryData {
  name: string;
  description?: string;
}

export interface UpdateGroupCategoryData {
  name?: string;
  description?: string;
}

export interface GroupCategoryResponse {
  success: boolean;
  data?: GroupCategory;
  error?: string;
}

export interface GroupCategoriesResponse {
  success: boolean;
  data?: GroupCategory[];
  error?: string;
  totalCount?: number;
}

export interface GroupCategoryFilters {
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}