/* Selecting all of the elements with the class of `fa-trash` and assigning them to the variable */

const deleteBtn = document.querySelectorAll(".fa-trash");
/* Selecting all the spans in the class item. `deleteBtn`. */
const item = document.querySelectorAll(".item span");
/* Selecting all the spans in the class item that have the class completed. */
const itemCompleted = document.querySelectorAll(".item span.completed");

/* Adding an event listener to each of the elements in the array and calling te delete function when the item is clicked */
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});
// adding event listener to each of the elements in the array and calling the markComplete function when the element is clicked
Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});
// adding event listener to each of the elements in the array and calling the markUnComplete function
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});

/**
 * It takes the text of the item that the user wants to delete, sends it to the server, and then
 * reloads the page.
 */
// Path: public\js\main.js (continued)
// Path: routes\index.js (continued)
//
async function deleteItem() {
  /* Getting the text of the item that the user wants to delete. */
  // The read-only parentNode property of the Node interface returns the parent of the specified node in the DOM tree.
  // const itemText = this.parentNode.childNodes[1].innerText;
  // console.log(itemText); // This is the text of the item that the user wants to delete from the database.
  try {
    /* Sending the text of the item that the user wants to delete to the server. */
    const response = await fetch("deleteItem", {
      /* Telling the server that the method that is being used is delete. */
      method: "delete",
      headers: { "Content-Type": "application/json" },
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

/**
 * When the user clicks the checkbox, the function sends a request to the server to update the
 * database.
 */
async function markComplete() {
  /* Getting the text of the item that the user wants to delete. */
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    /* Sending a request to the server to update the database. */
    const response = await fetch("markComplete", {
      /* Telling the server that the method that is being used is put. */
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    /* Converting the response to JSON. */
    const data = await response.json();
    console.log(data);
    /* Reloading the page. */
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
// the function sends a request to the server to update the database. The function is called when the user clicks the checkbox.
async function markUnComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  /* Sending a request to the server to update the database. The function is called when the user clicks
the checkbox. */
  try {
    const response = await fetch("markUnComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
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
