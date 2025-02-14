import React from 'react';

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
}

export const PhoneModal: React.FC<PhoneModalProps> = ({ isOpen, onClose, phoneNumber }) => {
  if (!isOpen) return null;

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleSMS = () => {
    window.location.href = `sms:${phoneNumber}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl" 
        onClick={e => e.stopPropagation()}
      >
        <div className="text-right mb-4">
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <p className="text-lg text-center mb-6 font-medium" dir="ltr">
          {phoneNumber}
        </p>
        <div className="flex justify-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={handleCall}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            تماس
          </button>
          <button
            onClick={handleSMS}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            پیامک
          </button>
        </div>
      </div>
    </div>
  );
};