// app/Buddhist2025/components/ui/Toast.tsx
'use client';

import { toast, Toaster, ToastOptions } from 'react-hot-toast';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const SuccessToast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className="flex items-center p-4 bg-white border border-green-200 rounded-lg shadow-lg max-w-md">
    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-900">{message}</p>
    </div>
    <button onClick={onClose} className="ml-3 text-gray-400 hover:text-gray-600">
      <X className="h-4 w-4" />
    </button>
  </div>
);

const ErrorToast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className="flex items-center p-4 bg-white border border-red-200 rounded-lg shadow-lg max-w-md">
    <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-900">{message}</p>
    </div>
    <button onClick={onClose} className="ml-3 text-gray-400 hover:text-gray-600">
      <X className="h-4 w-4" />
    </button>
  </div>
);

const InfoToast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className="flex items-center p-4 bg-white border border-blue-200 rounded-lg shadow-lg max-w-md">
    <Info className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-900">{message}</p>
    </div>
    <button onClick={onClose} className="ml-3 text-gray-400 hover:text-gray-600">
      <X className="h-4 w-4" />
    </button>
  </div>
);

export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return toast.custom(
    (t) => <SuccessToast message={message} onClose={() => toast.dismiss(t.id)} />,
    { duration: 3000, position: 'top-right', ...options }
  );
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  return toast.custom(
    (t) => <ErrorToast message={message} onClose={() => toast.dismiss(t.id)} />,
    { duration: 5000, position: 'top-right', ...options }
  );
};

export const showInfoToast = (message: string, options?: ToastOptions) => {
  return toast.custom(
    (t) => <InfoToast message={message} onClose={() => toast.dismiss(t.id)} />,
    { duration: 3000, position: 'top-right', ...options }
  );
};

export const showPhoneDuplicateToast = (phoneNumber: string) => {
  return toast.custom(
    (t) => (
      <div className="p-4 bg-white border border-red-200 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">เบอร์โทรถูกใช้แล้ว</p>
            <p className="text-sm text-gray-600">
              เบอร์โทร <span className="font-medium">{phoneNumber}</span> ถูกใช้งานแล้ว<br />
              กรุณาใช้เบอร์โทรอื่น หรือติดต่อผู้ดูแลระบบ
            </p>
          </div>
          <button onClick={() => toast.dismiss(t.id)} className="ml-3 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    ),
    { duration: 8000, position: 'top-center' }
  );
};

export const ToastContainer = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: { background: 'transparent', boxShadow: 'none', padding: 0 },
      }}
    />
  );
};