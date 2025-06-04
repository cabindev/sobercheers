// types/form-return.ts
export interface FormReturnData {
  id?: number;
  firstName: string;
  lastName: string;
  organizationName: string;
  addressLine1: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  type?: string;
  phoneNumber: string;
  numberOfSigners: number;
  image1?: string;
  image2?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FormReturnCreateData extends Omit<FormReturnData, 'id' | 'createdAt' | 'updatedAt'> {
  image1File?: File;
  image2File?: File;
}



export interface FormStep {
  step: number;
  title: string;
  isValid: boolean;
}

export interface RegionData {
  district: string;
  amphoe: string;
  province: string;
  zipcode: number | string;
  district_code: number | false;
  amphoe_code: number | false;
  province_code: number;
  type: string;
}

