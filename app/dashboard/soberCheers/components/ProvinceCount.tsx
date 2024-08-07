import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRenderCellParams } from '@mui/x-data-grid';

interface ProvinceData {
  id: number;
  province: string;
  count: number;
}

interface ApiResponse {
  provinces: Omit<ProvinceData, 'id'>[];
}

const ProvinceCount: React.FC = () => {
  const [provinceData, setProvinceData] = useState<ProvinceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllCards, setShowAllCards] = useState(false);

  useEffect(() => {
    const fetchProvinceData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/soberCheers/provinces');
        const data: ApiResponse = await response.json();
        const sortedData = data.provinces
          .sort((a, b) => b.count - a.count)
          .map((item, index) => ({
            id: index + 1,
            ...item
          }));
        setProvinceData(sortedData);
      } catch (error) {
        console.error('Error fetching province data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProvinceData();
  }, []);

  const getRowClassName = (params: any) => {
    const rank = params.row.id;
    if (rank === 1) return 'bg-yellow-300';
    if (rank === 2) return 'bg-gray-300';
    if (rank === 3) return 'bg-yellow-600';
    if (rank === 4 || rank === 5) return 'bg-blue-100';
    return '';
  };

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'อันดับ', 
      width: 70, 
      type: 'number',
      renderCell: (params: GridRenderCellParams) => (
        <div className={`font-bold ${params.value <= 3 ? 'text-white' : ''}`}>
          {params.value}
        </div>
      )
    },
    { field: 'province', headerName: 'จังหวัด', width: 130, type: 'string' },
    { 
      field: 'count', 
      headerName: 'จำนวนผู้ลงทะเบียน', 
      width: 160, 
      type: 'number',
      renderCell: (params: GridRenderCellParams) => (
        <div className="font-semibold">
          {params.value.toLocaleString()} คน
        </div>
      )
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getCardColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-300 text-yellow-800';
    if (rank === 2) return 'bg-gray-300 text-gray-800';
    if (rank === 3) return 'bg-yellow-600 text-yellow-100';
    if (rank === 4 || rank === 5) return 'bg-blue-100 text-blue-800';
    return 'bg-white';
  };

  const displayedProvinces = showAllCards ? provinceData : provinceData.slice(0, 10);

  return (
    <div>
      {/* Card view for small screens */}
      <div className="lg:hidden">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {displayedProvinces.map((province) => (
            <div key={province.id} className={`p-4 rounded-lg shadow ${getCardColor(province.id)}`}>
              <div className="font-bold text-lg">{province.id}. {province.province}</div>
              <div className="mt-2 text-xl font-semibold">{province.count.toLocaleString()} คน</div>
            </div>
          ))}
        </div>
        {!showAllCards && provinceData.length > 10 && (
          <div className="mt-4 text-center">
            <button 
              onClick={() => setShowAllCards(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              ดูเพิ่มเติม
            </button>
          </div>
        )}
      </div>

      {/* Table view for large screens */}
      <div className="hidden lg:block h-[600px] w-full">
        <DataGrid
          rows={provinceData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          checkboxSelection={false}
          getRowClassName={getRowClassName}
        />
      </div>
    </div>
  );
};

export default ProvinceCount;