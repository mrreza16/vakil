import React from 'react';

interface SelectInputProps {
  label: string;
  id: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  id,
  options,
  value,
  onChange,
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id} className="block text-right mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-right text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
      >
        <option value="">انتخاب کنید</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};