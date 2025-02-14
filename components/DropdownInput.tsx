import React, { useState, useRef, useEffect } from 'react';
import { PhoneModal } from './PhoneModal';

interface DropdownInputProps {
  label: string;
  placeholder: string;
  id: string;
}

export const DropdownInput: React.FC<DropdownInputProps> = ({ label, placeholder, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddOption = () => {
    if (inputValue && !options.includes(inputValue)) {
      setOptions([...options, inputValue]);
      setInputValue('');
    }
  };

  const handleSelectOption = (option: string) => {
    setInputValue(option);
    setIsOpen(false);
  };

  const extractPhoneNumber = (text: string) => {
    const match = text.match(/(\d{11})/);
    return match ? match[1] : null;
  };

  const handlePhoneClick = (option: string) => {
    const phoneNumber = extractPhoneNumber(option);
    if (phoneNumber) {
      setSelectedPhone(phoneNumber);
      setModalOpen(true);
    }
  };

  const renderOption = (option: string) => {
    const phoneNumber = extractPhoneNumber(option);
    if (phoneNumber) {
      const parts = option.split(phoneNumber);
      return (
        <div className="flex justify-between items-center w-full">
          <span>{parts[0]}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePhoneClick(option);
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {phoneNumber}
          </button>
        </div>
      );
    }
    return option;
  };

  return (
    <div className="relative mb-6 sm:mb-4" ref={dropdownRef}>
      <label 
        htmlFor={id} 
        className="block text-right mb-3 sm:mb-2 text-base sm:text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id={id}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full px-4 py-3 sm:py-2 text-right text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          placeholder={placeholder}
          dir="rtl"
        />
        <div className="absolute inset-y-0 left-0 flex items-center gap-1">
          <button
            type="button"
            onClick={handleAddOption}
            className="px-4 sm:px-3 py-3 sm:py-1 text-blue-600 hover:text-blue-800 active:text-blue-900 text-lg sm:text-base touch-manipulation"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 sm:px-3 py-3 sm:py-1 text-gray-600 hover:text-gray-800 active:text-gray-900 text-lg sm:text-base touch-manipulation"
          >
            ▼
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto overscroll-contain">
          {options.map((option, index) => (
            <div
              key={index}
              className="px-4 py-3 sm:py-2 text-right cursor-pointer hover:bg-gray-100 active:bg-gray-200 text-base sm:text-sm touch-manipulation"
              onClick={() => handleSelectOption(option)}
            >
              {renderOption(option)}
            </div>
          ))}
          {options.length === 0 && (
            <div className="px-4 py-3 sm:py-2 text-right text-gray-500 text-base sm:text-sm">
              موردی یافت نشد
            </div>
          )}
        </div>
      )}
      <PhoneModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        phoneNumber={selectedPhone}
      />
    </div>
  );
};