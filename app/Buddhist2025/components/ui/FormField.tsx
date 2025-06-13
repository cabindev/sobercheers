// app/Buddhist2025/components/ui/FormField.tsx
import { AlertCircle, CheckCircle } from 'lucide-react';
import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  children: ReactNode;
  className?: string;
  helpText?: string;
}

export function FormField({ 
  label, 
  required, 
  error, 
  success,
  children, 
  className = "",
  helpText 
}: FormFieldProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <label className="block text-base font-medium text-gray-900 mb-2">
        {label} 
        {required && <span className="text-red-500 ml-1">*</span>}
        {success && <CheckCircle className="inline h-4 w-4 text-green-500 ml-2" />}
      </label>
      
      {helpText && (
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
          {helpText}
        </p>
      )}
      
      {children}
      
      {error && (
        <div className="flex items-center mt-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// Enhanced Input Component - Orange Theme
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
  icon?: ReactNode;
}

export function Input({ 
  error, 
  success, 
  icon,
  className = "", 
  ...props 
}: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      
      <input
        className={`
          w-full px-4 py-3 
          ${icon ? 'pl-10' : ''} 
          bg-white border border-gray-300 rounded-lg
          text-gray-900 placeholder-gray-500
          focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none
          transition-colors duration-200
          ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}
          ${success ? 'border-green-400 focus:border-green-500 focus:ring-green-100' : ''}
          ${className}
        `}
        {...props}
      />
      
      {success && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <CheckCircle className="h-5 w-5 text-green-500" />
        </div>
      )}
      
      {error && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
      )}
    </div>
  );
}

// Clean Radio Group - Orange Theme
interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export function RadioGroup({ 
  name, 
  options, 
  value, 
  onChange, 
  disabled,
  error 
}: RadioGroupProps) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label 
          key={option.value} 
          className={`
            flex items-start p-4 rounded-lg border cursor-pointer
            transition-colors duration-200
            ${value === option.value 
              ? 'border-orange-500 bg-orange-50' 
              : error
                ? 'border-red-300 hover:border-red-400'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500 mt-1 mr-3 flex-shrink-0"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900 block">
              {option.label}
            </span>
            {option.description && (
              <p className="text-sm text-gray-600 mt-1">
                {option.description}
              </p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}