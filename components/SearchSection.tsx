import React from 'react';
import { SelectInput } from './SelectInput';
import { TextInput } from './TextInput';

interface SearchSectionProps {
  onSearch: (field: string, term: string) => void;
  resultCount: number;
  onPrevious: () => void;
  onNext: () => void;
  hasMore: boolean;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  onSearch,
  resultCount,
  onPrevious,
  onNext,
  hasMore,
}) => {
  const [searchField, setSearchField] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');

  const searchFields = [
    { value: 'type', label: 'نوع قرار' },
    { value: 'date', label: 'تاریخ ابلاغیه' },
    { value: 'courtType', label: 'بدوی یا تکمیلی' },
    { value: 'individualOrPanel', label: 'انفرادی-هیأت' },
    { value: 'city', label: 'شهر' },
    { value: 'courtCategory', label: 'نوع دادگاه' },
    { value: 'branchNumber', label: 'شماره شعبه' },
    { value: 'archiveNumber', label: 'شماره بایگانی' },
    { value: 'noticeNumber', label: 'شماره ابلاغیه' },
    { value: 'caseNumber', label: 'شماره پرونده' },
    { value: 'plaintiff', label: 'نام خواهان با شماره تماس' },
    { value: 'defendant', label: 'نام خوانده با شماره تماس' },
    { value: 'panelMembers', label: 'اعضای هیأت کارشناسی با شماره تماس' },
    { value: 'reportDate', label: 'تاریخ ارسال گزارش' },
    { value: 'trackingCode', label: 'کد رهگیری' },
    { value: 'cooperatedExperts', label: 'کارشناسان هیأت که همکاری کردند' },
    { value: 'nonCooperatedExperts', label: 'کارشناسان هیأت که همکاری نکردند' },
    { value: 'amount', label: 'مبلغ' },
    { value: 'status', label: 'وضعیت' },
  ];

  return (
    <div className="mt-8 space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-right mb-4">جستجو</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput
            label="جستجو بر اساس:"
            id="searchField"
            options={searchFields}
            value={searchField}
            onChange={setSearchField}
          />
          <div className="flex space-x-2 rtl:space-x-reverse">
            <TextInput
              label="عبارت جستجو"
              id="searchTerm"
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="عبارت جستجو را وارد کنید"
            />
            <button
              onClick={() => onSearch(searchField, searchTerm)}
              className="mt-8 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              جستجو
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={onPrevious}
              disabled={resultCount === 0}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              قبلی
            </button>
            <button
              onClick={onNext}
              disabled={!hasMore}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              بعدی
            </button>
          </div>
          <div className="text-sm text-gray-600">
            تعداد نتایج: {resultCount}
          </div>
        </div>
      </div>
    </div>
  );
};