import React from 'react';

interface TextInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
}) => {
  const formatDate = (input: string) => {
    // Remove any non-digit characters
    const numbers = input.replace(/\D/g, '');
    
    // Check if we have exactly 8 digits for a date (YYYYMMDD)
    if (numbers.length === 8) {
      const year = numbers.substring(0, 4);
      const month = numbers.substring(4, 6);
      const day = numbers.substring(6, 8);
      return `${year}/${month}/${day}`;
    }
    return input;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const isDateField = id === 'date' || id === 'reportDate';
    if (isDateField) {
      const formattedValue = formatDate(e.target.value);
      onChange(formattedValue);
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={id} className="block text-right mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-right text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        dir="rtl"
      />
    </div>
  );
};