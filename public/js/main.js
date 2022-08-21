const deleteBtn = document.querySelectorAll('.fa-trash'); // finds all the delete buttons
const item = document.querySelectorAll('.item span'); // finds all the items that have a status of UnComplete
const itemCompleted = document.querySelectorAll('.item span.completed'); // finds all the items that have a status of Complete

// adds an event listener that listens for clicks made to all the delete btns
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener('click', deleteItem);
});

// adds an event listener that listens for clicks made to all the items that have a status of UnComplete
Array.from(item).forEach((element) => {
  element.addEventListener('click', markComplete);
});

// adds an event listener that listens for clicks made to all the items that have a status of Complete
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener('click', markUnComplete);
});

// function that deletes an item when user clicks the item's deleteBtn
async function deleteItem() {
  const itemText = this.parentNode.childNodes[1].innerText; // the name of the item to be deleted
  try {
    // sends a delete request to deleteItem that waits on the response from the fetch
    const response = await fetch('deleteItem', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' }, // sets the content type that is expected which is json
      body: JSON.stringify({
        itemFromJS: itemText, // adds the name of the item to be deleted to the body of the request
      }),
    });
    const data = await response.json(); // gets the reponse as json saying the item has been deleted
    console.log(data);
    location.reload(); // reloads the page which in turn sends a get request to the homepage
  } catch (err) {
    console.log(err); // catches errors
  }
}

// function that marks an item as complete when the item is clicked on
async function markComplete() {
  const itemText = this.parentNode.childNodes[1].innerText; // the name of the item to be marked as complete
  try {
    // sends a put request to markComplete that waits on the response from the fetch
    const response = await fetch('markComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' }, // sets the content type that is expected which is json
      body: JSON.stringify({
        itemFromJS: itemText, // adds the name of the item to be marked as complete to the body of the request
      }),
    });
    const data = await response.json(); // gets the reponse as json saying the item has been marked as complete
    console.log(data);
    location.reload(); // reloads the page which in turn sends a get request to the homepage
  } catch (err) {
    console.log(err); // catches errors
  }
}

// function that marks an item as uncomplete when the item is clicked on
async function markUnComplete() {
  const itemText = this.parentNode.childNodes[1].innerText; // the name of the item to be marked as uncomplete
  try {
    // sends a put request to markUnComplete that waits on the response from the fetch
    const response = await fetch('markUnComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' }, // sets the content type that is expected which is json
      body: JSON.stringify({
        itemFromJS: itemText, // adds the name of the item to be marked as uncomplete to the body of the request
      }),
    });
    const data = await response.json(); // gets the reponse as json saying the item has been marked as uncomplete
    console.log(data);
    location.reload(); // reloads the page which in turn sends a get request to the homepage
  } catch (err) {
    console.log(err); // catches errors
  }
}
