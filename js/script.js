document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const saveButton = document.getElementById('saveButton');
    const editButton = document.getElementById('editButton');
    const deleteButton = document.getElementById('deleteButton');
    const clearButton = document.getElementById('clearButton');
    const searchButton = document.getElementById('searchButton');
    const searchField = document.getElementById('searchField');
    const searchTerm = document.getElementById('searchTerm');
    const resultCount = document.getElementById('resultCount');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    // فیلدهای منوهای آبشاری
    const defendantInput = document.getElementById('defendantInput');
    const addDefendantButton = document.getElementById('addDefendantButton');
    const toggleDefendantDropdown = document.getElementById('toggleDefendantDropdown');
    const defendantDropdown = document.getElementById('defendantDropdown');

    const applicantInput = document.getElementById('applicantInput');
    const addApplicantButton = document.getElementById('addApplicantButton');
    const toggleApplicantDropdown = document.getElementById('toggleApplicantDropdown');
    const applicantDropdown = document.getElementById('applicantDropdown');

    const expertPanelInput = document.getElementById('expertPanelInput');
    const addExpertPanelButton = document.getElementById('addExpertPanelButton');
    const toggleExpertPanelDropdown = document.getElementById('toggleExpertPanelDropdown');
    const expertPanelDropdown = document.getElementById('expertPanelDropdown');

    const cooperatedMembersInput = document.getElementById('cooperatedMembersInput');
    const addCooperatedMembersButton = document.getElementById('addCooperatedMembersButton');
    const toggleCooperatedMembersDropdown = document.getElementById('toggleCooperatedMembersDropdown');
    const cooperatedMembersDropdown = document.getElementById('cooperatedMembersDropdown');

    const nonCooperatedMembersInput = document.getElementById('nonCooperatedMembersInput');
    const addNonCooperatedMembersButton = document.getElementById('addNonCooperatedMembersButton');
    const toggleNonCooperatedMembersDropdown = document.getElementById('toggleNonCooperatedMembersDropdown');
    const nonCooperatedMembersDropdown = document.getElementById('nonCooperatedMembersDropdown');

    let records = []; // ذخیره‌سازی رکوردها
    let currentRecordIndex = -1; // رکورد جاری
    let searchResults = []; // نتایج جستجو

    // غیرفعال کردن ویرایش فیلدها
    const disableForm = () => {
        Array.from(form.elements).forEach(element => {
            if (element.tagName !== 'BUTTON') element.disabled = true;
        });
    };

    // فعال کردن ویرایش فیلدها
    const enableForm = () => {
        Array.from(form.elements).forEach(element => {
            if (element.tagName !== 'BUTTON') element.disabled = false;
        });
    };

    // پاک کردن فیلدها و منوهای آبشاری
    const clearForm = () => {
        Array.from(form.elements).forEach(element => {
            if (element.tagName !== 'BUTTON') element.value = '';
        });

        // پاک کردن منوهای آبشاری
        defendantDropdown.innerHTML = '';
        applicantDropdown.innerHTML = '';
        expertPanelDropdown.innerHTML = '';
        cooperatedMembersDropdown.innerHTML = '';
        nonCooperatedMembersDropdown.innerHTML = '';

        currentRecordIndex = -1;
        enableForm(); // فعال کردن فیلدها پس از پاک کردن فرم
    };

    // تبدیل تاریخ به فرمت yyyy/mm/dd
    const formatDate = (dateString) => {
        if (dateString.length === 8) {
            return `${dateString.slice(0, 4)}/${dateString.slice(4, 6)}/${dateString.slice(6, 8)}`;
        }
        return dateString;
    };

    // اعمال فرمت تاریخ هنگام خروج از فیلد
    const dateFields = document.querySelectorAll('input[name="date"], input[name="reportDate"]');
    dateFields.forEach(field => {
        field.addEventListener('blur', () => {
            field.value = formatDate(field.value.replace(/\D/g, ''));
        });
    });

    // ثبت رکورد جدید
    saveButton.addEventListener('click', () => {
        const formData = new FormData(form);
        const record = {};
        formData.forEach((value, key) => {
            record[key] = value;
        });

        // افزودن مقادیر منوهای آبشاری به رکورد
        record.defendants = Array.from(defendantDropdown.children).map(li => li.textContent);
        record.applicants = Array.from(applicantDropdown.children).map(li => li.textContent);
        record.expertPanel = Array.from(expertPanelDropdown.children).map(li => li.textContent);
        record.cooperatedMembers = Array.from(cooperatedMembersDropdown.children).map(li => li.textContent);
        record.nonCooperatedMembers = Array.from(nonCooperatedMembersDropdown.children).map(li => li.textContent);

        if (currentRecordIndex === -1) {
            // افزودن رکورد جدید
            records.push(record);
        } else {
            // ویرایش رکورد موجود
            records[currentRecordIndex] = record;
        }

        clearForm(); // پاک کردن فیلدها و منوهای آبشاری پس از ثبت
        enableForm(); // فعال کردن فیلدها پس از ثبت
    });

    // جستجوی رکوردها
    searchButton.addEventListener('click', () => {
        const field = searchField.value;
        const term = searchTerm.value.trim().toLowerCase();
        searchResults = records.filter(record => record[field]?.toLowerCase().includes(term));

        if (searchResults.length > 0) {
            currentRecordIndex = 0;
            loadRecord(searchResults[currentRecordIndex]);
            resultCount.value = `${currentRecordIndex + 1}/${searchResults.length}`;
            prevButton.disabled = currentRecordIndex === 0;
            nextButton.disabled = currentRecordIndex === searchResults.length - 1;
            disableForm(); // غیرفعال کردن فیلدها پس از بارگذاری رکورد
        } else {
            alert('رکوردی یافت نشد.');
        }

        searchTerm.value = ''; // پاک کردن مقدار جستجو
    });

    // بارگذاری رکورد در فرم
    const loadRecord = (record) => {
        Object.keys(record).forEach(key => {
            const element = form.elements[key];
            if (element) element.value = record[key];
        });

        // بارگذاری منوهای آبشاری
        defendantDropdown.innerHTML = record.defendants?.map(defendant => `<li>${defendant}</li>`).join('') || '';
        applicantDropdown.innerHTML = record.applicants?.map(applicant => `<li>${applicant}</li>`).join('') || '';
        expertPanelDropdown.innerHTML = record.expertPanel?.map(expert => `<li>${expert}</li>`).join('') || '';
        cooperatedMembersDropdown.innerHTML = record.cooperatedMembers?.map(member => `<li>${member}</li>`).join('') || '';
        nonCooperatedMembersDropdown.innerHTML = record.nonCooperatedMembers?.map(member => `<li>${member}</li>`).join('') || '';

        disableForm(); // غیرفعال کردن فیلدها پس از بارگذاری
    };

    // ویرایش رکورد
    editButton.addEventListener('click', () => {
        if (currentRecordIndex !== -1) {
            enableForm(); // فعال کردن فیلدها برای ویرایش
        } else {
            alert('لطفاً ابتدا یک رکورد را جستجو کنید.');
        }
    });

    // حذف رکورد
    deleteButton.addEventListener('click', () => {
        if (currentRecordIndex !== -1) {
            records.splice(currentRecordIndex, 1);
            clearForm();
            disableForm(); // غیرفعال کردن فیلدها پس از حذف
        } else {
            alert('لطفاً ابتدا یک رکورد را جستجو کنید.');
        }
    });

    // پاک کردن فرم و منوهای آبشاری
    clearButton.addEventListener('click', () => {
        clearForm();
        enableForm(); // فعال کردن فیلدها پس از پاک کردن
    });

    // مدیریت منوهای آبشاری
    const setupDropdown = (input, addButton, dropdown) => {
        addButton.addEventListener('click', (event) => {
            event.preventDefault();
            const value = input.value.trim();
            if (value) {
                const li = document.createElement('li');
                li.textContent = value;
                li.addEventListener('click', () => {
                    input.value = li.textContent;
                    dropdown.style.display = 'none';
                });
                dropdown.appendChild(li);
                input.value = '';
            }
        });
    };

    // تنظیم منوهای آبشاری
    setupDropdown(defendantInput, addDefendantButton, defendantDropdown);
    setupDropdown(applicantInput, addApplicantButton, applicantDropdown);
    setupDropdown(expertPanelInput, addExpertPanelButton, expertPanelDropdown);
    setupDropdown(cooperatedMembersInput, addCooperatedMembersButton, cooperatedMembersDropdown);
    setupDropdown(nonCooperatedMembersInput, addNonCooperatedMembersButton, nonCooperatedMembersDropdown);

    // باز و بستن منوهای آبشاری
    const setupToggleDropdown = (toggleButton, dropdown) => {
        toggleButton.addEventListener('click', (event) => {
            event.preventDefault();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
    };

    // تنظیم باز و بستن منوها
    setupToggleDropdown(toggleDefendantDropdown, defendantDropdown);
    setupToggleDropdown(toggleApplicantDropdown, applicantDropdown);
    setupToggleDropdown(toggleExpertPanelDropdown, expertPanelDropdown);
    setupToggleDropdown(toggleCooperatedMembersDropdown, cooperatedMembersDropdown);
    setupToggleDropdown(toggleNonCooperatedMembersDropdown, nonCooperatedMembersDropdown);

    // بستن منوهای آبشاری هنگام کلیک خارج از آنها
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.input-wrapper')) {
            defendantDropdown.style.display = 'none';
            applicantDropdown.style.display = 'none';
            expertPanelDropdown.style.display = 'none';
            cooperatedMembersDropdown.style.display = 'none';
            nonCooperatedMembersDropdown.style.display = 'none';
        }
    });

    // جابجایی بین رکوردها
    prevButton.addEventListener('click', () => {
        if (searchResults.length > 0) {
            // جابجایی بین نتایج جستجو
            if (currentRecordIndex > 0) {
                currentRecordIndex--;
                loadRecord(searchResults[currentRecordIndex]);
                resultCount.value = `${currentRecordIndex + 1}/${searchResults.length}`;
                prevButton.disabled = currentRecordIndex === 0;
                nextButton.disabled = currentRecordIndex === searchResults.length - 1;
            }
        } else {
            // جابجایی بین رکوردهای ثبت‌شده
            if (currentRecordIndex > 0) {
                currentRecordIndex--;
                loadRecord(records[currentRecordIndex]);
                prevButton.disabled = currentRecordIndex === 0;
                nextButton.disabled = false;
            }
        }
    });

    nextButton.addEventListener('click', () => {
        if (searchResults.length > 0) {
            // جابجایی بین نتایج جستجو
            if (currentRecordIndex < searchResults.length - 1) {
                currentRecordIndex++;
                loadRecord(searchResults[currentRecordIndex]);
                resultCount.value = `${currentRecordIndex + 1}/${searchResults.length}`;
                prevButton.disabled = currentRecordIndex === 0;
                nextButton.disabled = currentRecordIndex === searchResults.length - 1;
            }
        } else {
            // جابجایی بین رکوردهای ثبت‌شده
            if (currentRecordIndex < records.length - 1) {
                currentRecordIndex++;
                loadRecord(records[currentRecordIndex]);
                nextButton.disabled = currentRecordIndex === records.length - 1;
                prevButton.disabled = false;
            }
        }
    });

    // فعال کردن فرم در ابتدا
    enableForm(); // فیلدها در ابتدا فعال باشند
});