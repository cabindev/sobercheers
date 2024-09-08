import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import thailandMap from '../../../data/thailand.json';

interface ProvinceData {
  province: string;
  count: number;
}

// สร้าง Map component แบบ dynamic
const Map = dynamic(
  () => import('react-leaflet').then((mod) => {
    const { MapContainer, TileLayer, GeoJSON } = mod;
    return function Map({ provinceData, style, onEachFeature }: {
      provinceData: ProvinceData[];
      style: (feature: any) => any;
      onEachFeature: (feature: any, layer: any) => void;
    }) {
      return (
        <MapContainer 
          center={[13.7563, 100.5018]} 
          zoom={6} 
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {thailandMap && (
            <GeoJSON
              data={thailandMap as any}
              style={style}
              onEachFeature={onEachFeature}
            />
          )}
        </MapContainer>
      );
    };
  }),
  { ssr: false, loading: () => <p>กำลังโหลดแผนที่...</p> }
);

const ProvinceMap: React.FC = () => {
  const [provinceData, setProvinceData] = useState<ProvinceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvinceData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/soberCheers/provinces');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProvinceData(data.provinces);
      } catch (e) {
        setError('Failed to fetch province data');
        console.error('Error fetching province data:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProvinceData();
  }, []);

  const getColor = (count: number) => {
    return count > 1000 ? '#166534' :
           count > 500  ? '#BD0026' :
           count > 200  ? '#E31A1C' :
           count > 100  ? '#FC4E2A' :
           count > 50   ? '#FD8D3C' :
           count > 20   ? '#FEB24C' :
           count > 10   ? '#FED976' :
                          '#FFEDA0';
  }

  const style = (feature: any) => {
    const provinceName = feature.properties.name_th;
    const provinceDataItem = provinceData.find(item => item.province === provinceName);
    const count = provinceDataItem ? provinceDataItem.count : 0;
    return {
      fillColor: getColor(count),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  const onEachFeature = (feature: any, layer: any) => {
    const provinceName = feature.properties.name_th;
    const provinceDataItem = provinceData.find(item => item.province === provinceName);
    const count = provinceDataItem ? provinceDataItem.count : 0;
    layer.bindTooltip(`${provinceName}: ${count} คน`, { permanent: false, direction: 'center' });
  }

  if (isLoading) return <div>กำลังโหลดข้อมูล...</div>;
  if (error) return <div>เกิดข้อผิดพลาด: {error}</div>;

  return (
    <div className="w-full h-full">
      <Map provinceData={provinceData} style={style} onEachFeature={onEachFeature} />
    </div>
  );
};

export default ProvinceMap;