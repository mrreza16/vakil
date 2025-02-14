import React, { useState, useCallback } from 'react';
import { DropdownInput } from './components/DropdownInput';
import { SelectInput } from './components/SelectInput';
import { TextInput } from './components/TextInput';
import { SearchSection } from './components/SearchSection';
import { storage } from './lib/storage';
import type { Notice } from './types';

function App() {
  const [formData, setFormData] = useState<Notice>({
    type: '',
    date: '',
    courtType: '',
    individualOrPanel: '',
    city: '',
    courtCategory: '',
    branchNumber: '',
    archiveNumber: '',
    noticeNumber: '',
    caseNumber: '',
    reportDate: '',
    trackingCode: '',
    amount: '',
    status: '',
    plaintiff: '',
    defendant: '',
    panelMembers: '',
    cooperatedExperts: '',
    nonCooperatedExperts: '',
  });

  const [searchResults, setSearchResults] = useState<Notice[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = storage.saveNotice(formData);
      if (error) throw error;
      alert('اطلاعات با موفقیت ثبت شد');
      handleClear();
    } catch (error) {
      console.error('Error saving data:', error);
      alert('خطا در ثبت اطلاعات');
    }
  };

  const handleClear = () => {
    setFormData({
      type: '',
      date: '',
      courtType: '',
      individualOrPanel: '',
      city: '',
      courtCategory: '',
      branchNumber: '',
      archiveNumber: '',
      noticeNumber: '',
      caseNumber: '',
      reportDate: '',
      trackingCode: '',
      amount: '',
      status: '',
      plaintiff: '',
      defendant: '',
      panelMembers: '',
      cooperatedExperts: '',
      nonCooperatedExperts: '',
    });
  };

  const handleDelete = () => {
    handleClear();
  };

  const handleSearch = (field: string, term: string) => {
    const results = storage.searchNotices(field, term);
    setSearchResults(results);
    if (results.length > 0) {
      setCurrentResultIndex(0);
      displayResult(results[0]);
    } else {
      alert('موردی یافت نشد');
    }
  };

  const displayResult = (result: Notice) => {
    setFormData(result);
  };

  const handlePrevious = () => {
    if (currentResultIndex > 0) {
      const newIndex = currentResultIndex - 1;
      setCurrentResultIndex(newIndex);
      displayResult(searchResults[newIndex]);
    }
  };

  const handleNext = () => {
    if (currentResultIndex < searchResults.length - 1) {
      const newIndex = currentResultIndex + 1;
      setCurrentResultIndex(newIndex);
      displayResult(searchResults[newIndex]);
    }
  };

  const cityOptions = [
    { value: 'زنجان', label: 'زنجان' },
    { value: 'ابهر', label: 'ابهر' },
    { value: 'خرمدره', label: 'خرمدره' },
    { value: 'خدابنده', label: 'خدابنده' },
    { value: 'ماهنشان', label: 'ماهنشان' },
    { value: 'طارم', label: 'طارم' },
  ];

  const courtTypeOptions = [
    { value: 'بدوی', label: 'بدوی' },
    { value: 'تکمیلی', label: 'تکمیلی' },
  ];

  const courtCategoryOptions = [
    { value: 'حقوقی', label: 'حقوقی' },
    { value: 'کیفری', label: 'کیفری' },
    { value: 'بازپرسی', label: 'بازپرسی' },
    { value: 'دادیاری', label: 'دادیاری' },
    { value: 'صلح', label: 'صلح' },
    { value: 'تجدیدنظر', label: 'تجدیدنظر' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-8 text-right">ثبت اطلاعات ابلاغیه</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectInput
                label="نوع قرار"
                id="type"
                options={[
                  { value: 'کارشناسی', label: 'کارشناسی' },
                  { value: 'تامین دلیل', label: 'تامین دلیل' },
                ]}
                value={formData.type}
                onChange={(value) => handleInputChange('type', value)}
              />
              <TextInput
                label="تاریخ ابلاغیه"
                id="date"
                value={formData.date}
                onChange={(value) => handleInputChange('date', value)}
                placeholder="yyyy/mm/dd"
              />
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectInput
                label="بدوی یا تکمیلی"
                id="courtType"
                options={courtTypeOptions}
                value={formData.courtType}
                onChange={(value) => handleInputChange('courtType', value)}
              />
              <SelectInput
                label="انفرادی-هیأت"
                id="individualOrPanel"
                options={[
                  { value: 'انفرادی', label: 'انفرادی' },
                  { value: 'هیأت', label: 'هیأت' },
                ]}
                value={formData.individualOrPanel}
                onChange={(value) => handleInputChange('individualOrPanel', value)}
              />
            </div>

            {/* Third Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectInput
                label="شهر"
                id="city"
                options={cityOptions}
                value={formData.city}
                onChange={(value) => handleInputChange('city', value)}
              />
              <SelectInput
                label="نوع دادگاه"
                id="courtCategory"
                options={courtCategoryOptions}
                value={formData.courtCategory}
                onChange={(value) => handleInputChange('courtCategory', value)}
              />
            </div>

            {/* Fourth Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="شماره شعبه"
                id="branchNumber"
                value={formData.branchNumber}
                onChange={(value) => handleInputChange('branchNumber', value)}
              />
              <TextInput
                label="شماره بایگانی"
                id="archiveNumber"
                value={formData.archiveNumber}
                onChange={(value) => handleInputChange('archiveNumber', value)}
              />
            </div>

            {/* Other Fields */}
            <TextInput
              label="شماره ابلاغیه"
              id="noticeNumber"
              value={formData.noticeNumber}
              onChange={(value) => handleInputChange('noticeNumber', value)}
            />

            <TextInput
              label="شماره پرونده"
              id="caseNumber"
              value={formData.caseNumber}
              onChange={(value) => handleInputChange('caseNumber', value)}
            />

            {/* Dropdown Inputs */}
            <DropdownInput
              label="نام خواهان با شماره تماس"
              placeholder="مقدار را وارد کنید"
              id="plaintiffInput"
            />
            <DropdownInput
              label="نام خوانده با شماره تماس"
              placeholder="مقدار را وارد کنید"
              id="defendantInput"
            />
            <DropdownInput
              label="اعضای هیأت کارشناسی با شماره تماس"
              placeholder="مقدار را وارد کنید"
              id="panelMembersInput"
            />

            <TextInput
              label="تاریخ ارسال گزارش"
              id="reportDate"
              value={formData.reportDate}
              onChange={(value) => handleInputChange('reportDate', value)}
              placeholder="yyyy/mm/dd"
            />

            <TextInput
              label="کد رهگیری"
              id="trackingCode"
              value={formData.trackingCode}
              onChange={(value) => handleInputChange('trackingCode', value)}
            />

            <DropdownInput
              label="کارشناسان هیأت که همکاری کردند"
              placeholder="مقدار را وارد کنید"
              id="cooperatedExpertsInput"
            />

            <DropdownInput
              label="کارشناسان هیأت که همکاری نکردند"
              placeholder="مقدار را وارد کنید"
              id="nonCooperatedExpertsInput"
            />

            {/* Fifth Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="مبلغ"
                id="amount"
                value={formData.amount}
                onChange={(value) => handleInputChange('amount', value)}
              />
              <SelectInput
                label="وضعیت"
                id="status"
                options={[
                  { value: 'دریافت شده', label: 'دریافت شده' },
                  { value: 'دریافت نشده', label: 'دریافت نشده' },
                ]}
                value={formData.status}
                onChange={(value) => handleInputChange('status', value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 rtl:space-x-reverse">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                ثبت اطلاعات
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                حذف اطلاعات
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                پاک کردن فرم
              </button>
            </div>
          </form>

          {/* Search Section */}
          <SearchSection
            onSearch={handleSearch}
            resultCount={searchResults.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            hasMore={currentResultIndex < searchResults.length - 1}
          />
        </div>
      </div>
    </div>
  );
}

export default App;