document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const saveButton = document.getElementById('saveButton');
    const editButton = document.getElementById('editButton');
    const deleteButton = document.getElementById('deleteButton');
    const newButton = document.getElementById('newButton');
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

    // عناصر پنجره نمایش نام و شماره تماس
    const contactModal = document.getElementById('contactModal');
    const contactName = document.getElementById('contactName');
    const contactPhone = document.getElementById('contactPhone');
    const callButton = document.getElementById('callButton');
    const messageButton = document.getElementById('messageButton');
    const cancelButton = document.getElementById('cancelButton');
    const closeModal = document.getElementById('closeModal');

    let records = [];
    let currentRecordIndex = -1;
    let searchResults = [];

    // بارگذاری داده‌ها از LocalStorage در شروع برنامه
    function loadFromLocalStorage() {
        const storedRecords = localStorage.getItem('formRecords');
        if (storedRecords) {
            records = JSON.parse(storedRecords);
            if (records.length > 0) {
                currentRecordIndex = 0;
                loadRecord(records[currentRecordIndex]);
                updateNavigationButtons();
            }
        }
    }

    // ذخیره داده‌ها در LocalStorage
    function saveToLocalStorage() {
        localStorage.setItem('formRecords', JSON.stringify(records));
    }

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

        defendantDropdown.innerHTML = '';
        applicantDropdown.innerHTML = '';
        expertPanelDropdown.innerHTML = '';
        cooperatedMembersDropdown.innerHTML = '';
        nonCooperatedMembersDropdown.innerHTML = '';

        currentRecordIndex = -1;
    };

    // تبدیل تاریخ به فرمت yyyy/mm/dd
    const formatDate = (dateString) => {
        if (dateString.length === 8) {
            return `${dateString.slice(0, 4)}/${dateString.slice(4, 6)}/${dateString.slice(6, 8)}`;
        }
        return dateString;
    };

    // اعمال فرمت تاریخ هنگام خروج از فیلد
    const dateFields = document.querySelectorAll('.field-date, .field-report-date');
    dateFields.forEach(field => {
        field.addEventListener('blur', () => {
            field.value = formatDate(field.value.replace(/\D/g, ''));
        });
    });

    // ثبت رکورد (جدید یا ویرایش)
    saveButton.addEventListener('click', () => {
        const formData = new FormData(form);
        const record = {};
        formData.forEach((value, key) => {
            record[key] = value;
        });

        record.defendants = Array.from(defendantDropdown.children).map(li => li.textContent);
        record.applicants = Array.from(applicantDropdown.children).map(li => li.textContent);
        record.expertPanel = Array.from(expertPanelDropdown.children).map(li => li.textContent);
        record.cooperatedMembers = Array.from(cooperatedMembersDropdown.children).map(li => li.textContent);
        record.nonCooperatedMembers = Array.from(nonCooperatedMembersDropdown.children).map(li => li.textContent);

        if (currentRecordIndex === -1) {
            records.push(record);
            saveToLocalStorage();
            clearForm();
            enableForm();
        } else {
            if (searchResults.length > 0) {
                searchResults[currentRecordIndex] = record;
                const originalIndex = records.findIndex(r => r === searchResults[currentRecordIndex]);
                if (originalIndex !== -1) records[originalIndex] = record;
            } else {
                records[currentRecordIndex] = record;
            }
            saveToLocalStorage();
            disableForm();
        }
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
            updateNavigationButtons();
            disableForm();
        } else {
            alert('رکوردی یافت نشد.');
        }

        searchTerm.value = '';
    });

    // بارگذاری رکورد در فرم
    const loadRecord = (record) => {
        Object.keys(record).forEach(key => {
            const element = form.elements[key];
            if (element) element.value = record[key] || '';
        });

        defendantDropdown.innerHTML = record.defendants?.map(defendant => `<li>${defendant}</li>`).join('') || '';
        applicantDropdown.innerHTML = record.applicants?.map(applicant => `<li>${applicant}</li>`).join('') || '';
        expertPanelDropdown.innerHTML = record.expertPanel?.map(expert => `<li>${expert}</li>`).join('') || '';
        cooperatedMembersDropdown.innerHTML = record.cooperatedMembers?.map(member => `<li>${member}</li>`).join('') || '';
        nonCooperatedMembersDropdown.innerHTML = record.nonCooperatedMembers?.map(member => `<li>${member}</li>`).join('') || '';
        disableForm();
    };

    // ویرایش رکورد
    editButton.addEventListener('click', () => {
        if (currentRecordIndex !== -1) {
            enableForm();
        } else {
            alert('لطفاً ابتدا یک رکورد را جستجو کنید یا انتخاب کنید.');
        }
    });

    // حذف رکورد
    deleteButton.addEventListener('click', () => {
        if (currentRecordIndex !== -1) {
            if (searchResults.length > 0) {
                const recordToDelete = searchResults[currentRecordIndex];
                searchResults.splice(currentRecordIndex, 1);
                const originalIndex = records.findIndex(r => r === recordToDelete);
                if (originalIndex !== -1) records.splice(originalIndex, 1);
            } else {
                records.splice(currentRecordIndex, 1);
            }
            saveToLocalStorage();
            clearForm();
            enableForm();
            if (searchResults.length > 0 && currentRecordIndex < searchResults.length) {
                loadRecord(searchResults[currentRecordIndex]);
                resultCount.value = `${currentRecordIndex + 1}/${searchResults.length}`;
            } else if (records.length > 0) {
                currentRecordIndex = Math.min(currentRecordIndex, records.length - 1);
                loadRecord(records[currentRecordIndex]);
            } else {
                currentRecordIndex = -1;
            }
            updateNavigationButtons();
        } else {
            alert('لطفاً ابتدا یک رکورد را جستجو کنید.');
        }
    });

    // دکمه "جدید" برای ایجاد رکورد جدید
    newButton.addEventListener('click', () => {
        clearForm();
        enableForm();
        searchResults = [];
        resultCount.value = '';
        prevButton.disabled = true;
        nextButton.disabled = true;
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

    // به‌روزرسانی وضعیت دکمه‌های ناوبری
    function updateNavigationButtons() {
        if (searchResults.length > 0) {
            prevButton.disabled = currentRecordIndex === searchResults.length - 1;
            nextButton.disabled = currentRecordIndex === 0;
        } else {
            prevButton.disabled = currentRecordIndex === records.length - 1;
            nextButton.disabled = currentRecordIndex === 0 || currentRecordIndex === -1;
        }
    }

    // جابجایی بین رکوردها - "قبلی" به رکورد بعدی می‌ره
    prevButton.addEventListener('click', () => {
        if (searchResults.length > 0) {
            if (currentRecordIndex < searchResults.length - 1) {
                currentRecordIndex++;
                loadRecord(searchResults[currentRecordIndex]);
                resultCount.value = `${currentRecordIndex + 1}/${searchResults.length}`;
                updateNavigationButtons();
            }
        } else {
            if (currentRecordIndex < records.length - 1) {
                currentRecordIndex++;
                loadRecord(records[currentRecordIndex]);
                updateNavigationButtons();
            }
        }
    });

    // جابجایی بین رکوردها - "بعدی" به رکورد قبلی می‌ره
    nextButton.addEventListener('click', () => {
        if (searchResults.length > 0) {
            if (currentRecordIndex > 0) {
                currentRecordIndex--;
                loadRecord(searchResults[currentRecordIndex]);
                resultCount.value = `${currentRecordIndex + 1}/${searchResults.length}`;
                updateNavigationButtons();
            }
        } else {
            if (currentRecordIndex > 0) {
                currentRecordIndex--;
                loadRecord(records[currentRecordIndex]);
                updateNavigationButtons();
            }
        }
    });

    // مدیریت پنجره نمایش نام و شماره تماس
    const showContactModal = (name, phone) => {
        contactName.textContent = name;
        contactPhone.textContent = phone;
        contactModal.style.display = 'flex';
    };

    const hideContactModal = () => {
        contactModal.style.display = 'none';
    };

    // کلیک روی آیتم‌های منوهای آبشاری
    const setupContactModal = (dropdown) => {
        dropdown.addEventListener('click', (event) => {
            if (event.target.tagName === 'LI') {
                const text = event.target.textContent;
                const lastSpaceIndex = text.lastIndexOf(' ');
                if (lastSpaceIndex !== -1) {
                    const name = text.slice(0, lastSpaceIndex).trim();
                    const phone = text.slice(lastSpaceIndex + 1).trim();
                    if (name && phone) {
                        showContactModal(name, phone);
                    }
                }
            }
        });
    };

    // تنظیم پنجره نمایش برای منوهای آبشاری
    setupContactModal(defendantDropdown);
    setupContactModal(applicantDropdown);
    setupContactModal(expertPanelDropdown);
    setupContactModal(cooperatedMembersDropdown);
    setupContactModal(nonCooperatedMembersDropdown);

    // مدیریت تماس و ارسال پیام
    callButton.addEventListener('click', () => {
        const phone = contactPhone.textContent;
        if (phone) {
            window.open(`tel:${phone}`);
        }
    });

    messageButton.addEventListener('click', () => {
        const phone = contactPhone.textContent;
        if (phone) {
            window.open(`sms:${phone}`);
        }
    });

    // بستن پنجره
    cancelButton.addEventListener('click', hideContactModal);
    closeModal.addEventListener('click', hideContactModal);
    contactModal.addEventListener('click', (event) => {
        if (event.target === contactModal) {
            hideContactModal();
        }
    });

    // مدیریت دکمه برگشت در موبایل
    document.addEventListener('backbutton', (event) => {
        event.preventDefault(); // جلوگیری از رفتار پیش‌فرض دکمه برگشت

        // اگه مودال بازه، فقط مودال رو ببند
        if (contactModal.style.display === 'flex') {
            hideContactModal();
        }
        // اگه در حالت جستجو هستیم و رکوردی انتخاب شده، به حالت اصلی برگرد
        else if (searchResults.length > 0) {
            searchResults = [];
            resultCount.value = '';
            if (records.length > 0) {
                currentRecordIndex = 0;
                loadRecord(records[currentRecordIndex]);
            } else {
                clearForm();
                currentRecordIndex = -1;
            }
            updateNavigationButtons();
        }
        // اگه در حالت مرور رکوردها هستیم و رکوردی انتخاب شده، به عقب برو
        else if (currentRecordIndex > 0) {
            currentRecordIndex--;
            loadRecord(records[currentRecordIndex]);
            updateNavigationButtons();
        }
        // اگه به صفحه اصلی رسیدیم (هیچ رکوردی انتخاب نشده)، از برنامه خارج شو
        else if (currentRecordIndex === -1) {
            navigator.app.exitApp(); // خروج از اپلیکیشن
        }
    }, false);

    // فعال کردن فرم در ابتدا و بارگذاری داده‌ها
    enableForm();
    loadFromLocalStorage();
});