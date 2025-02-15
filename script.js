let data = [];
let searchResults = [];
let currentIndex = -1;

// تابع نمایش یا مخفی کردن منوی آبشاری
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// تابع افزودن مقدار جدید به منوی کشویی
function addOption(inputId, dropdownId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    const value = input.value.trim();

    if (value) {
        // جلوگیری از مقادیر تکراری
        if ([...dropdown.children].some(opt => opt.textContent === value)) {
            alert('این مقدار قبلاً اضافه شده است!');
            return;
        }

        const option = document.createElement('div');
        option.textContent = value;
        option.classList.add('dropdown-option');
        option.onclick = () => {
            input.value = value;
            dropdown.style.display = 'none';
        };

        dropdown.appendChild(option);
        input.value = '';
    } else {
        alert('لطفاً مقداری وارد کنید!');
    }
}

// تابع ذخیره مقدار
function saveData() {
    const inputValue = document.getElementById('fieldInput').value.trim();

    if (!inputValue) {
        alert('لطفاً مقداری وارد کنید.');
        return;
    }

    data.push({ value: inputValue });
    alert('اطلاعات ذخیره شد!');
}

// تابع حذف مقدار
function deleteData() {
    if (currentIndex === -1 || searchResults.length === 0) {
        alert('هیچ رکوردی برای حذف یافت نشد.');
        return;
    }

    const currentRecord = searchResults[currentIndex];
    data = data.filter(entry => JSON.stringify(entry) !== JSON.stringify(currentRecord));

    searchResults.splice(currentIndex, 1);

    if (searchResults.length === 0) {
        alert('رکورد حذف شد و دیگر نتیجه‌ای وجود ندارد.');
        document.getElementById('fieldInput').value = '';
        currentIndex = -1;
    } else {
        currentIndex = Math.min(currentIndex, searchResults.length - 1);
        document.getElementById('fieldInput').value = searchResults[currentIndex].value;
    }
}

// تابع پاک کردن ورودی
function clearInput() {
    document.getElementById('fieldInput').value = '';
}

// تابع جستجو
function searchData() {
    const searchTerm = document.getElementById('searchTerm').value.trim();

    if (!searchTerm) {
        alert('لطفاً عبارت جستجو را وارد کنید.');
        return;
    }

    searchResults = data.filter(entry => entry.value.includes(searchTerm));

    if (searchResults.length === 0) {
        alert('نتیجه‌ای یافت نشد.');
        return;
    }

    currentIndex = 0;
    document.getElementById('fieldInput').value = searchResults[currentIndex].value;
    updateResultCount();
}

// تابع بروزرسانی تعداد نتایج جستجو
function updateResultCount() {
    document.getElementById('resultCount').value = `تعداد نتایج: ${searchResults.length}`;
}

// تابع حرکت به نتیجه قبلی
function prevResult() {
    if (currentIndex > 0) {
        currentIndex--;
        document.getElementById('fieldInput').value = searchResults[currentIndex].value;
    }
}

// تابع حرکت به نتیجه بعدی
function nextResult() {
    if (currentIndex < searchResults.length - 1) {
        currentIndex++;
        document.getElementById('fieldInput').value = searchResults[currentIndex].value;
    }
}
