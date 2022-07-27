// grab all elements with class ".fa-trash" and store them in a variable
const deleteBtn = document.querySelectorAll('.fa-trash');
// grab all spans within class ".item" and store them in a variable
const item = document.querySelectorAll('.item span');
// grab all completed items that have the ".completed" class and store them in a variable
const itemCompleted = document.querySelectorAll('.item span.completed');
// add click event listeners to each delete icon
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener('click', deleteItem);
});
// add click event listener to each item
Array.from(item).forEach((element) => {
  element.addEventListener('click', markComplete);
});
// add click event listener to each item that has the "completed" class
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener('click', markUnComplete);
});
// Sends a Delete request to the server
async function deleteItem() {
  // grab the item's text
  const itemText = this.parentNode.childNodes[1].innerText;
  // attempt to delete the item using the fetch API
  try {
    // make a request to the '/deleteItem' path on the server and set the headers accordingly, then store the returned Promise as a variable.
    const response = await fetch('deleteItem', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // returns a second promise that resolves with the result of parsing the response body text as JSON
    const data = await response.json();
    console.log(data);
    // reload the page after deleting the item (this helps keep our local state in sync with the server's state).
    location.reload();
  } catch (err) {
    // log the error if the attempted delete operation fails
    console.log(err);
  }
}
// Send a PUT (update) request to the server.
async function markComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch('markComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
// Send a PUT (update) request to the server.
async function markUnComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch('markUnComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
