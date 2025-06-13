// /types/buddhist.ts
export interface LocationData {
  district: string;
  amphoe: string;
  province: string;
  type: string;
  geocode: string;
  lat: number;
  lng: number;
  zipcode?: string;
}


export interface Buddhist2025FormData {
  id?: number;
  gender?: string;
  firstName: string;
  lastName: string;
  age?: number;
  addressLine1: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  type?: string;
  phone?: string;
  alcoholConsumption: string;
  drinkingFrequency?: string;
  intentPeriod?: string;
  monthlyExpense?: number;
  motivations: string[];
  healthImpact: string;
  groupCategoryId: number;
}

export interface Buddhist2025 {
  id: number;
  gender?: string | null;
  firstName: string;
  lastName: string;
  age: number;
  addressLine1: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  type?: string | null;
  phone?: string | null;
  alcoholConsumption: string;
  drinkingFrequency?: string | null;
  intentPeriod?: string | null;
  monthlyExpense?: number | null;
  motivations: any; // JSON type from Prisma
  healthImpact: string;
  groupCategoryId: number;
  groupCategory: import('@/types/group').GroupCategory; // ✅ ใช้จาก /types/group.ts
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBuddhist2025Data {
  gender?: string;
  firstName: string;
  lastName: string;
  age: number;
  addressLine1: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  type?: string;
  phone?: string;
  alcoholConsumption: string;
  drinkingFrequency?: string;
  intentPeriod?: string;
  monthlyExpense?: number;
  motivations: string[];
  healthImpact: string;
  groupCategoryId: number;
}

// ไม่ต้องมี id ใน UpdateBuddhist2025Data เพราะส่งแยกเป็น parameter
export interface UpdateBuddhist2025Data extends Partial<CreateBuddhist2025Data> {}

export interface Buddhist2025Response {
  success: boolean;
  data?: Buddhist2025;
  error?: string;
}

export interface Buddhist2025ListResponse {
  success: boolean;
  data?: Buddhist2025[];
  error?: string;
  totalCount?: number;
}

export interface Buddhist2025Filters {
  search?: string;
  groupCategoryId?: number;
  province?: string;
  alcoholConsumption?: string;
  sortBy?: 'firstName' | 'lastName' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface Buddhist2025Stats {
  totalParticipants: number;
  byGroupCategory: Array<{
    groupCategoryId: number;
    groupCategoryName: string;
    count: number;
  }>;
  byProvince: Array<{
    province: string;
    count: number;
  }>;
  byAlcoholConsumption: Array<{
    status: string;
    count: number;
  }>;
  byGender: Array<{
    gender: string;
    count: number;
  }>;
  byAge: Array<{
    ageRange: string;
    count: number;
  }>;
}