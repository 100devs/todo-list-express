// Targetting (selecting) all elements in DOM with class '.fa-trash', ; '.item span', '.item span.completed'
const deleteBtn = document.querySelectorAll('.fa-trash');
const item = document.querySelectorAll('.fa-check');
const itemCompleted = document.querySelectorAll('.fa-times');

// Creating an array from the node list 'deleteBtn'
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener('click', deleteItem);
});

// Creating an array from node list 'item'
Array.from(item).forEach((element) => {
  element.addEventListener('click', markComplete);
});

// Creating an array from node list 'itemCompleted'
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener('click', markUnComplete);
});

// Async function to delete the item it finds in the parentNode that matches the item we are deleting
async function deleteItem() {
  const itemText = this.parentNode.children[0].innerText;
  try {
    const response = await fetch('deleteItem', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // waiting for a response from the server
    const data = await response.json();
    // Logging the server respose
    console.log(data);
    location.reload();
    // Basic Error catch
  } catch (err) {
    console.log(err);
  }
}

// Function to mark todo item complete
async function markComplete() {
  const itemText = this.parentNode.children[0].innerText;
  console.log(itemText);
  try {
    const response = await fetch('markComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // waiting for a response from the server
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

// Async function to mark a completed todo item as incomplete (unstrike it)
async function markUnComplete() {
  const itemText = this.parentNode.children[0].innerText;
  try {
    const response = await fetch('markUnComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // waiting for response.json() and assigning it to data
    const data = await response.json();
    console.log(data);
    // reloading the page
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
