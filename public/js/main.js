// select items from the DOM
const deleteBtns = document.querySelectorAll('.fa-trash');
const items = document.querySelectorAll('.item span');
const completedItems = document.querySelectorAll(
  '.item span.completed'
);

// querySelectorAll returns a NodeList since it is pulling things from the DOM
// a NodeList is an 'array-like' and can be turned into an array for manipulation
// next 3 lines creates arrays from the NodeLists selected at the top of the file and adds click event listeners to them, each running a different callback function
Array.from(deleteBtns).forEach((element) => {
  element.addEventListener('click', deleteItem);
});

Array.from(items).forEach((element) => {
  element.addEventListener('click', markComplete);
});

Array.from(completedItems).forEach((element) => {
  element.addEventListener('click', markUnComplete);
});

// deletes an item from the todo list
// must be async because fetching data from the server
async function deleteItem() {
  // select the text of the current item
  const itemText = this.parentNode.childNodes[1].innerText;
  // try to ask the server to delete an item with the `itemText` as the identifier
  try {
    // since async, must await the fetch from the server
    // there must be a route on the server that matches 'deleteItem'
    const response = await fetch('deleteItem', {
      // 'delete' is the action to remove the item from the database
      method: 'delete',
      // lets the API know to expect JSON data
      headers: { 'Content-Type': 'application/json' },
      // converts the javascript to JSON
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // wait for API response and save into `data` variable
    const data = await response.json();
    // print the response to the console
    console.log(data);
    // refresh the page to cause client to sent new GET req to show that the item has been deleted
    location.reload();

    // if something goes wrong, print the error to the console
  } catch (err) {
    console.log(err);
  }
}

// marks a todo item as complete
// must be async because fetching data from the server
async function markComplete() {
  // select the text of the current item
  const itemText = this.parentNode.childNodes[1].innerText;
  // try to ask the server to update an item with the `itemText` as the identifier
  try {
    // since async, must await the fetch from the server
    // there must be a route on the server that matches 'markComplete'
    const response = await fetch('markComplete', {
      // 'put' is the action to update the item in the database
      method: 'put',
      // lets the API know to expect JSON data
      headers: { 'Content-Type': 'application/json' },
      // converts the javascript to JSON
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // wait for API response and save into `data` variable
    const data = await response.json();
    // print the response to the console
    console.log(data);
    // refresh the page to cause client to sent new GET req to show that the item has been marked as completed
    location.reload();

    // if something goes wrong, print the error to the console
  } catch (err) {
    console.log(err);
  }
}

// marks a todo item as uncompleted
// must be async because fetching data from the server
async function markUnComplete() {
  // select the text of the current item
  const itemText = this.parentNode.childNodes[1].innerText;
  // since async, must await the fetch from the server
  // there must be a route on the server that matches 'markUnComplete'
  try {
    const response = await fetch('markUnComplete', {
      // 'put' is the action to update the item in the database
      method: 'put',
      // lets the API know to expect JSON data
      headers: { 'Content-Type': 'application/json' },
      // converts the javascript to JSON
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // wait for API response and save into `data` variable
    const data = await response.json();
    // print the response to the console
    console.log(data);
    // refresh the page to cause client to sent new GET req to show that the item has been marked as uncompleted
    location.reload();

    // if something goes wrong, print the error to the console
  } catch (err) {
    console.log(err);
  }
}

// Check for saved theme preference in localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.body.classList.add(savedTheme);
}

// Toggle dark mode
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
  const currentTheme = document.body.classList.contains('dark')
    ? 'dark'
    : 'light';

  // Toggle theme
  if (currentTheme === 'dark') {
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    darkModeToggle.textContent = '🌙'; // Change button text for light mode
    localStorage.setItem('theme', 'light');
  } else {
    document.body.classList.remove('light');
    document.body.classList.add('dark');
    darkModeToggle.textContent = '🌞'; // Change button text for dark mode
    localStorage.setItem('theme', 'dark');
  }
});
