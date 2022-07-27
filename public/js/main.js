// create nodelist of all elements with the "fa-trash" class
const deleteBtn = document.querySelectorAll('.fa-trash');
// create nodelist of all spans in elements with the "item" class
const item = document.querySelectorAll('.item span');
// create nodelist for all elements matching '.item span.completed'
const itemCompleted = document.querySelectorAll('.item span.completed');

// convert nodelist to array to use forEach
Array.from(deleteBtn).forEach((element) => {
  // add event listener to all elements in array for the deleteItem function
  element.addEventListener('click', deleteItem);
});

// convert nodelist to array to use forEach
Array.from(item).forEach((element) => {
  // add event listener to all elements in array for the markComplete function
  element.addEventListener('click', markComplete);
});

// convert nodelist to array to use forEach
Array.from(itemCompleted).forEach((element) => {
  // add event listener to all elements in array for the markUnComplete function
  element.addEventListener('click', markUnComplete);
});

// will remove the clicked item from the database when the delete icon in the span is clicked
// async function because this a callback for the server
async function deleteItem() {
  // sets itemText to the innerText of the span above the delete span
  // example: <span class="completed">need to wash the car</span> => "need to wash the car"
  // array index 1 is used because childNodes returns a list of all nodes in the parent
  // including any text nodes created from new lines "\n"
  const itemText = this.parentNode.childNodes[1].innerText;
  // try...catch block is used because async...await is being used, if these were normal promises then a .catch() would do the same
  try {
    // sending a delete request to the server on the "/deleteItem" endpoint
    const response = await fetch('deleteItem', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // awaiting the response back, on the serve a JSON response was sent with 'Todo Deleted'
    const data = await response.json();
    console.log(data);
    // reload the page on the / endpoint
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

// marks a todo item as completed: true in the database
// false ==> true
// async function because this a callback for the server
async function markComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // sending a put request to the server on the "/markComplete" endpoint
    const response = await fetch('markComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    const data = await response.json();
    console.log(data);
    // reload the page on the / endpoint
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

// unmarks a todo item as completed: false in the database
// true ==> false
// async function because this a callback for the server
async function markUnComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // sending a put request to the server on the "/markUnComplete" endpoint
    const response = await fetch('markUnComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    const data = await response.json();
    console.log(data);
    // reload the page on the / endpoint
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
