const inputField = document.getElementById('input-field');
const addButton = document.getElementById('add-button');
const toggleButton = document.getElementById('toggle-button');
const dropdownList = document.getElementById('dropdown-list');

addButton.addEventListener('click', () => {
  const inputValue = inputField.value.trim();
  if (inputValue !== '') {
    const listItem = document.createElement('li');
    listItem.textContent = inputValue;
    dropdownList.appendChild(listItem);
    inputField.value = '';
  }
});

toggleButton.addEventListener('click', () => {
  dropdownList.style.display = dropdownList.style.display === 'block' ? 'none' : 'block';
});

dropdownList.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    inputField.value = event.target.textContent;
    dropdownList.style.display = 'none';
  }
});