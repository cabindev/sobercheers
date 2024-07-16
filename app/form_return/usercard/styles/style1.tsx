import React from 'react';

interface StyleProps {
  images: string[];
  form: {
    organizationName: string;
    amphoe: string;
    type: string;
  };
}

const Style1: React.FC<StyleProps> = ({ images, form }) => {
  return (
    <div className="relative bg-white shadow-md rounded-lg overflow-hidden p-4">
      <div className="absolute inset-0">
        <img
          src="/bg3.svg"
          alt="Background"
          className="w-full h-full object-contain opacity-30"
        />
      </div>
      <div className="relative z-10">
        <h2 className="text-2xl font-semibold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          {form.organizationName}
        </h2>
        <div className="flex justify-center items-center flex-wrap mb-4">
          {images.map((src, index) => (
            <div key={index} className="polaroid mx-2 my-2 relative">
              <div className="relative w-[170px] h-[210px] bg-white">
                <img src={src} alt={`Image ${index + 1}`} className="w-full h-full object-contain" />
              </div>
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
    </div>
  );
};

export default Style1;
