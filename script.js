let data = [];
let searchResults = [];
let currentIndex = -1;
let isEditing = false;

// تابع تبدیل اعداد به فرمت تاریخ شمسی
function formatDateInput(input) {
    const value = input.value.replace(/\D/g, '');
    if (value.length === 8) {
        const year = value.slice(0, 4);
        const month = value.slice(4, 6);
        const day = value.slice(6, 8);
        input.value = `${year}/${month}/${day}`;
    } else {
        alert('تاریخ وارد شده نامعتبر است!');
        input.value = '';
    }
}

// تابع ذخیره یا به‌روزرسانی اطلاعات
function saveData() {
    const form = document.getElementById('form');
    const formData = new FormData(form);
    const entry = {};
    formData.forEach((value, key) => {
        entry[key] = value;
    });

    if (isEditing && currentIndex !== -1 && searchResults[currentIndex]) {
        const originalRecord = searchResults[currentIndex];
        const indexInData = data.findIndex(record => JSON.stringify(record) === JSON.stringify(originalRecord));
        if (indexInData !== -1) {
            data[indexInData] = entry;
            searchResults[currentIndex] = entry;
            alert('اطلاعات با موفقیت به‌روزرسانی شد!');
        }
    } else {
        data.push(entry);
        alert('اطلاعات با موفقیت ثبت شد!');
    }

    form.reset();
    isEditing = false;
}

// تابع جستجو
function searchData() {
    const searchField = document.getElementById('searchField').value;
    const searchTerm = document.getElementById('searchTerm').value;

    if (!searchTerm) {
        alert('لطفاً عبارت جستجو را وارد کنید.');
        return;
    }

    searchResults = data.filter(entry => {
        return entry[searchField] && entry[searchField].toString().includes(searchTerm);
    });

    if (searchResults.length === 0) {
        alert('نتیجه‌ای یافت نشد.');
        return;
    }

    currentIndex = 0;
    updateFormWithResult(searchResults[currentIndex]);
    updateNavigationButtons();
    updateResultCount();
    isEditing = true;
    document.getElementById('searchTerm').value = '';
}

// تابع نمایش نتیجه در فیلدها
function updateFormWithResult(result) {
    const form = document.getElementById('form');
    for (const key in result) {
        if (form.elements[key]) {
            form.elements[key].value = result[key];
        }
    }
}

// تابع به‌روزرسانی دکمه‌های قبلی و بعدی
function updateNavigationButtons() {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    prevButton.disabled = currentIndex <= 0;
    nextButton.disabled = currentIndex >= searchResults.length - 1;
}

// تابع به‌روزرسانی تعداد نتایج
function updateResultCount() {
    const resultCount = document.getElementById('resultCount');
    resultCount.value = `تعداد نتایج: ${searchResults.length}`;
}

// تابع حرکت به رکورد قبلی
function prevResult() {
    if (currentIndex > 0) {
        currentIndex--;
        updateFormWithResult(searchResults[currentIndex]);
        updateNavigationButtons();
    }
}

// تابع حرکت به رکورد بعدی
function nextResult() {
    if (currentIndex < searchResults.length - 1) {
        currentIndex++;
        updateFormWithResult(searchResults[currentIndex]);
        updateNavigationButtons();
    }
}

// تابع حذف اطلاعات
function deleteData() {
    if (currentIndex === -1 || searchResults.length === 0) {
        alert('هیچ رکوردی برای حذف یافت نشد.');
        return;
    }

    const currentRecord = searchResults[currentIndex];
    data = data.filter(entry => {
        return JSON.stringify(entry) !== JSON.stringify(currentRecord);
    });

    searchResults.splice(currentIndex, 1);

    if (searchResults.length === 0) {
        alert('رکورد حذف شد و دیگر نتیجه‌ای وجود ندارد.');
        document.getElementById('form').reset();
        currentIndex = -1;
    } else {
        currentIndex = Math.min(currentIndex, searchResults.length - 1);
        updateFormWithResult(searchResults[currentIndex]);
    }

    updateNavigationButtons();
    updateResultCount();
}

// تابع پاک کردن فرم
function clearForm() {
    document.getElementById('form').reset();
    alert('فرم با موفقیت پاک شد!');
    isEditing = false;
}

// تابع فرمت‌دهی تاریخ شمسی هنگام خروج از فیلد
function formatDateOnBlur(event) {
    const input = event.target;
    formatDateInput(input);
}

// مدیریت Modal برای تماس یا پیامک
let currentPhoneNumber = '';

function showPhoneModal(phoneNumber) {
    currentPhoneNumber = phoneNumber;
    const modal = document.getElementById('phoneModal');
    const modalPhoneNumber = document.getElementById('modalPhoneNumber');
    modalPhoneNumber.textContent = `شماره تماس: ${phoneNumber}`;
    modal.style.display = 'block';
}

function closePhoneModal() {
    const modal = document.getElementById('phoneModal');
    modal.style.display = 'none';
}

function makeCall() {
    if (currentPhoneNumber) {
        window.location.href = `tel:${currentPhoneNumber}`;
    }
    closePhoneModal();
}

function sendSms() {
    if (currentPhoneNumber) {
        window.location.href = `sms:${currentPhoneNumber}`;
    }
    closePhoneModal();
}

// تابع استخراج شماره تماس از متن
function extractPhoneNumber(text) {
    const phoneRegex = /(\+98|0)?9\d{9}/g;
    const matches = text.match(phoneRegex);
    return matches ? matches[0] : null;
}

// افزودن رویداد کلیک به فیلدهای مربوط به شماره تماس
document.addEventListener('DOMContentLoaded', () => {
    const phoneFields = ['plaintiff', 'defendant', 'panelMembers'];
    phoneFields.forEach(fieldId => {
        const textarea = document.getElementById(fieldId);
        textarea.addEventListener('click', () => {
            const phoneNumber = extractPhoneNumber(textarea.value);
            if (phoneNumber) {
                showPhoneModal(phoneNumber);
            } else {
                alert('شماره تماس معتبری یافت نشد!');
            }
        });
    });

    // رویدادهای Modal
    document.getElementById('callButton').addEventListener('click', makeCall);
    document.getElementById('smsButton').addEventListener('click', sendSms);
    document.querySelector('.close').addEventListener('click', closePhoneModal);

    // بستن Modal با کلیک خارج از آن
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('phoneModal');
        if (event.target === modal) {
            closePhoneModal();
        }
    });

    // افزودن رویداد blur برای فیلدهای تاریخ
    document.getElementById('date').addEventListener('blur', formatDateOnBlur);
    document.getElementById('reportDate').addEventListener('blur', formatDateOnBlur);

    // رویدادهای دکمه‌ها
    document.getElementById('saveButton').addEventListener('click', saveData);
    document.getElementById('deleteButton').addEventListener('click', deleteData);
    document.getElementById('clearButton').addEventListener('click', clearForm);
    document.getElementById('searchButton').addEventListener('click', searchData);
    document.getElementById('prevButton').addEventListener('click', prevResult);
    document.getElementById('nextButton').addEventListener('click', nextResult);
});