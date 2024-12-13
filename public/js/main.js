// Select all trash icons (delete buttons)
const deleteBtn = document.querySelectorAll('.fa-trash');
// Select all todo item spans (uncompleted items)
const item = document.querySelectorAll('.item span');
// Select all completed todo item spans
const itemCompleted = document.querySelectorAll('.item span.completed');

// Convert delete buttons to array and add click event listeners to each
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener('click', deleteItem);
});

// Convert todo items to array and add click event listeners for marking complete
Array.from(item).forEach((element) => {
  element.addEventListener('click', markComplete);
});

// Convert completed items to array and add click listeners for marking incomplete
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener('click', markUnComplete);
});

// Function to delete a todo item
async function deleteItem() {
  // Get the text of the todo item
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // Send delete request to server with the todo text
    const response = await fetch('deleteItem', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // Get response from server
    const data = await response.json();
    console.log(data);
    // Refresh the page to show updated list
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

// Function to mark a todo as complete
async function markComplete() {
  // Get the text of the todo item
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // Send PUT request to server to mark item as complete
    const response = await fetch('markComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // Get response from server
    const data = await response.json();
    console.log(data);
    // Refresh the page to show updated list
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

// Function to mark a completed todo as incomplete
async function markUnComplete() {
  // Get the text of the todo item
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // Send PUT request to server to mark item as incomplete
    const response = await fetch('markUnComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // Get response from server
    const data = await response.json();
    console.log(data);
    // Refresh the page to show updated list
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
