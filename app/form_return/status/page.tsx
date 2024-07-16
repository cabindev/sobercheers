'use client';
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface FormReturn {
  id: number;
  firstName: string;
  lastName: string;
  organizationName: string;
  addressLine1: string;
  district: string;
  province: string;
  zipcode: string;
  phoneNumber: string;
  numberOfSigners: number;
  createdAt: string;
  updatedAt: string;
  image1: string | null;
  image2: string | null;
  amphoe: string;
  type: string;
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'firstName', headerName: 'First name', width: 150 },
  { field: 'lastName', headerName: 'Last name', width: 150 },
  { field: 'organizationName', headerName: 'Organization', width: 150 },
  { field: 'addressLine1', headerName: 'Address Line 1', width: 150 },
  { field: 'district', headerName: 'District', width: 150 },
  { field: 'province', headerName: 'Province', width: 150 },
  { field: 'zipcode', headerName: 'Zipcode', width: 150 },
  { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
  { field: 'numberOfSigners', headerName: 'Number of Signers', width: 150 },
  { field: 'createdAt', headerName: 'Created At', width: 150 },
  { field: 'updatedAt', headerName: 'Updated At', width: 150 },
  { field: 'amphoe', headerName: 'Amphoe', width: 150 },
  { field: 'type', headerName: 'Type', width: 150 },
  { field: 'image1', headerName: 'Image 1', width: 150, renderCell: (params) => (<img src={params.value as string} alt="" width="50" />)},
  { field: 'image2', headerName: 'Image 2', width: 150, renderCell: (params) => (<img src={params.value as string} alt="" width="50" />)}
];

export default function DataTable() {
  const [rows, setRows] = useState<FormReturn[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/form_return');
      setRows(res.data.forms);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[10, 20, 30]}
        pagination
      />
    </div>
  );
}
