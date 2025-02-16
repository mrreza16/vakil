// انتخاب عناصر مورد نیاز
const inputField = document.getElementById('input-field');
const addButton = document.getElementById('add-button');
const toggleButton = document.getElementById('toggle-button');
const dropdownList = document.getElementById('dropdown-list');

// افزودن آیتم به لیست
addButton.addEventListener('click', () => {
    const inputValue = inputField.value.trim();
    if (inputValue) {
        const newItem = document.createElement('li');
        newItem.textContent = inputValue;
        dropdownList.appendChild(newItem);
        inputField.value = ''; // پاک کردن فیلد ورودی
    }
});

// باز و بسته کردن لیست
toggleButton.addEventListener('click', (event) => {
    event.stopPropagation(); // جلوگیری از بسته شدن لیست به دلیل کلیک روی دکمه
    dropdownList.classList.toggle('show');
});

// بستن لیست هنگام کلیک خارج از آن
window.addEventListener('click', () => {
    if (dropdownList.classList.contains('show')) {
        dropdownList.classList.remove('show');
    }
});

// انتخاب آیتم از لیست و قرار دادن آن در فیلد ورودی
dropdownList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        inputField.value = event.target.textContent;
        dropdownList.classList.remove('show');
    }
});