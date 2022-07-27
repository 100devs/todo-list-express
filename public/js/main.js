// goes to document and grabs all elements with classes with name fa-trash
const deleteBtn = document.querySelectorAll(".fa-trash");
// goes to document and grabs all elements with classes of the name item span
const item = document.querySelectorAll(".item span");
// goes to document grabs all elements with class item span.completed
const itemCompleted = document.querySelectorAll(".item span.completed");

// creating an array from deleteBtn and loops through array and adds event listener to each one, triggering deleteItem on click
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});

// creating an array from item and loops through array and adds event listener to each one, triggering markComplete on click
Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});

// creating an array from itemCompleted and loops through array and adds event listener to each one, triggering markUnComplete on click
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});

// DELETE request triggered by event listener
async function deleteItem() {
    // go to the parent of the item/task we clicked, and go to the child node and give it text
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // fetch for DELETE request to /deleteItem endpoint
    const response = await fetch("deleteItem", {
        // establishing DELETE method
      method: "delete",
      // stating the JSON will be used
      headers: { "Content-Type": "application/json" },
      // convert JSON into string and set 'itemFromJS' to itemText and delete it
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // return data as JSON
    const data = await response.json();
    // logging data to the console
    console.log(data);
    // refreshing the page
    location.reload();
    // error handling
  } catch (err) {
    console.log(err);
  }
}

// PUT request triggered by event listener
async function markComplete() {
  // go to the parent of the item/task we clicked, and go to the child node and give it text
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // fetch for PUT request to /markComplete endpoint
    const response = await fetch("markComplete", {
        // establishing a PUT method
      method: "put",
      // stating that JSON will be used
      headers: { "Content-Type": "application/json" },
      // convert JSON into string and set 'itemFromJS' to itemText and update it
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // return data as JSON
    const data = await response.json();
    // logs data to console
    console.log(data);
    // refresh the main page
    location.reload();
    // error handling
  } catch (err) {
    console.log(err);
  }
}

// PUT request from event listener
async function markUnComplete() {
     // go to the parent of the item/task we clicked, and go to the child node and give it text
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
      // fetch for PUT request to /markUNComplete endpoint
    const response = await fetch("markUnComplete", {
      // establishing a PUT method
        method: "put",
        // stating that JSON will be used
      headers: { "Content-Type": "application/json" },
       // convert JSON into string and set 'itemFromJS' to itemText and update it
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // return data as JSON
    const data = await response.json();
    // logging data to console
    console.log(data);
    // refresh the main page
    location.reload();
    // error handling
  } catch (err) {
    console.log(err);
  }
}
