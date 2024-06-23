// components/ui/stepIndicator.tsx
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center mb-6">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              currentStep >= index + 1 ? 'bg-yellow-600 text-white' : 'bg-slate-100 text-gray-600'
            }`}
          >
            {currentStep > index + 1 ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            ) : (
              index + 1
            )}
          </div>
          {index < totalSteps - 1 && (
            <div className="flex-1 border-t-2 border-gray-200 mx-2"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
