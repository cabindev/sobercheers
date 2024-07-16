import React from 'react';

interface StyleProps {
  images: string[];
  form: {
    organizationName: string;
    amphoe: string;
    type: string;
  };
}

const Style3: React.FC<StyleProps> = ({ images, form }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 relative max-w-xl mx-auto">
      <div className="relative w-full h-64 mb-4">
        {images.length > 0 && (
          <div className="absolute inset-0">
            <img src={images[0]} alt="Image 1" className="w-full h-full object-cover rounded-lg shadow-lg" />
          </div>
        )}
        {images.length > 1 && (
          <div className="absolute inset-4 w-[70%] h-[70%] transform rotate-2 z-10">
            <img src={images[1]} alt="Image 2" className="w-full h-full object-cover rounded-lg shadow-lg" />
          </div>
        )}
      </div>
      <div className="absolute inset-0 z-0">
        <img
          src="/bg3.svg"
          alt="Background"
          className="w-full h-full object-contain opacity-20"
        />
      </div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
          {form.organizationName}
        </h2>
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-700">
            <strong>อำเภอ:</strong> {form.amphoe}
          </p>
          <p className="text-gray-700">
            <strong>ภาค:</strong> {form.type}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Style3;
