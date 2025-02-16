// تابع نمایش یا مخفی کردن منوی آبشاری
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// تابع افزودن گزینه به فیلد
function addOption(inputId, dropdownId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    const value = input.value.trim();

    if (value) {
        // ایجاد گزینه جدید
        const option = document.createElement('div');
        option.textContent = value;
        option.onclick = () => {
            input.value = value; // مقدار را در فیلد قرار می‌دهد
            dropdown.style.display = 'none'; // منو را می‌بندد
        };
        dropdown.appendChild(option); // گزینه را به منو اضافه می‌کند
        input.value = ''; // فیلد را پاک می‌کند
    } else {
        alert('لطفاً مقداری وارد کنید!');
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
            data[indexInData] = entry; // به‌روزرسانی رکورد در داده‌ها
            searchResults[currentIndex] = entry; // به‌روزرسانی رکورد در نتایج جستجو
            alert('اطلاعات با موفقیت به‌روزرسانی شد!');
        }
    } else {
        data.push(entry); // ایجاد رکورد جدید
        alert('اطلاعات با موفقیت ثبت شد!');
    }

    form.reset();
    isEditing = false; // حالت ویرایش غیرفعال می‌شود
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
    isEditing = true; // فعال کردن حالت ویرایش

    // پاک کردن فیلد جستجو
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

    searchResults.splice(currentIndex, 1); // حذف رکورد از نتایج جستجو

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
    isEditing = false; // حالت ویرایش غیرفعال می‌شود
}

// تابع فرمت‌دهی تاریخ شمسی هنگام خروج از فیلد
function formatDateOnBlur(event) {
    const input = event.target;
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

// مدیریت رویدادها
document.addEventListener('DOMContentLoaded', () => {
    // بستن منوهای آبشاری با کلیک خارج از آنها
    window.addEventListener('click', (event) => {
        if (!event.target.matches('.dropdown-arrow') && !event.target.matches('.add-button')) {
            const dropdowns = document.querySelectorAll('.dropdown-menu');
            dropdowns.forEach(dropdown => {
                dropdown.style.display = 'none';
            });
        }
    });

    // افزودن رویداد کلیک به مثلث‌ها برای باز کردن منوها
    const dropdownArrows = document.querySelectorAll('.dropdown-arrow');
    dropdownArrows.forEach(arrow => {
        arrow.addEventListener('click', (event) => {
            event.stopPropagation(); // جلوگیری از بسته شدن منو
            const dropdownId = arrow.getAttribute('onclick').match(/'(.*?)'/)[1];
            toggleDropdown(dropdownId);
        });
    });

    // افزودن رویداد کلیک به دکمه‌های + برای ثبت مقادیر
    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // جلوگیری از بسته شدن منو
            const onclickAttribute = button.getAttribute('onclick');
            const [inputId, dropdownId] = onclickAttribute.match(/'(.*?)'/g).map(match => match.replace(/'/g, ''));
            addOption(inputId, dropdownId);
        });
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