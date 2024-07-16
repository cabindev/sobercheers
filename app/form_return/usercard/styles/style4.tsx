import React from 'react';

interface StyleProps {
  images: string[];
  form: {
    organizationName: string;
    amphoe: string;
    type: string;
  };
}

const Style4: React.FC<StyleProps> = ({ images, form }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
      <h2 className="text-2xl text-center font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-sky-500">
        {form.organizationName}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {images.map((src, index) => (
          <div key={index} className="relative w-full h-48 bg-white">
            <img src={src} alt={`Image ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow-md" />
          </div>
        ))}
      </div>
      <p className="text-gray-700 mb-2">
        <strong>อำเภอ:</strong> {form.amphoe}
      </p>
      <p className="text-gray-700 mb-4">
        <strong>ภาค:</strong> {form.type}
      </p>
    </div>
  );
};

export default Style4;
