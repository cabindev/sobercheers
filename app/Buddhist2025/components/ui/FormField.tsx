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
   <div className={`mb-4 ${className}`}>
     <label className="block text-sm text-gray-700 mb-2">
       {label} 
       {required && <span className="text-red-500 ml-1">*</span>}
       {success && <CheckCircle className="inline h-4 w-4 text-green-500 ml-2" />}
     </label>
     
     {helpText && (
       <p className="text-xs text-gray-500 mb-2 bg-gray-50 p-2 rounded">
         {helpText}
       </p>
     )}
     
     {children}
     
     {error && (
       <div className="flex items-center mt-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
         <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
         <span>{error}</span>
       </div>
     )}
   </div>
 );
}

// Enhanced Input Component - Minimal Style
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
         w-full px-3 py-3 text-sm
         ${icon ? 'pl-10' : ''} 
         bg-white border border-gray-300 rounded-lg
         text-gray-900 placeholder-gray-400
         focus:border-orange-500 focus:ring-1 focus:ring-orange-200 focus:outline-none
         transition-colors duration-150
         ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''}
         ${success ? 'border-green-400 focus:border-green-500 focus:ring-green-200' : ''}
         ${className}
       `}
       {...props}
     />
     
     {success && (
       <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
         <CheckCircle className="h-4 w-4 text-green-500" />
       </div>
     )}
     
     {error && (
       <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
         <AlertCircle className="h-4 w-4 text-red-500" />
       </div>
     )}
   </div>
 );
}

// Clean Radio Group - Minimal Style
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
   <div className="space-y-2">
     {options.map((option) => (
       <label 
         key={option.value} 
         className={`
           flex items-start p-3 rounded-lg border cursor-pointer
           transition-colors duration-150
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
           className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-200 mt-0.5 mr-3 flex-shrink-0"
         />
         <div className="flex-1">
           <span className="text-sm text-gray-900 block">
             {option.label}
           </span>
           {option.description && (
             <p className="text-xs text-gray-600 mt-1">
               {option.description}
             </p>
           )}
         </div>
       </label>
     ))}
   </div>
 );
}