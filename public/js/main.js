const deleteBtn = document.querySelectorAll(".fa-trash"); //grab all objects with class from trashcan icon
const item = document.querySelectorAll(".item span"); //grab all todo spans not marked completed
const itemCompleted = document.querySelectorAll(".item span.completed"); //grab all todo spans marked completed

Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem); //add event listener to all trashcan icons to use deleteItem function
});

Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete); //add event listener to all todos that run the markComplete function
});

Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete); //add event listen to all completed todos to run the markUnComplete function
});

async function deleteItem() {
  const itemText = this.parentNode.childNodes[1].innerText; // grab the todo text
  try {
    const response = await fetch("deleteItem", {
      // call the deleteItem Operation on the server
      method: "delete", //declare the method that will be used
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText, //add todo text to a json object called body
      }),
    });
    const data = await response.json(); // wait for response from the server and store it in data variable
    console.log(data); // display the data object in the client console
    location.reload(); // reload the current webpage
  } catch (err) {
    console.log(err); //if there is an error, display the error object in client console
  }
}

async function markComplete() {
  const itemText = this.parentNode.childNodes[1].innerText; //grab the text from todo
  try {
    const response = await fetch("markComplete", {
      // call the markComplete Update Operation on the server
      method: "put", //declare the type of operation that will be used
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText, //add todo text to a json object called body
      }),
    });
    const data = await response.json(); // wait for response from the server and store it in data variable
    console.log(data); // display the data object in the client console
    location.reload(); // reload the current webpage
  } catch (err) {
    console.log(err); //if there is an error, display the error object in client console
  }
}

async function markUnComplete() {
  const itemText = this.parentNode.childNodes[1].innerText; //grab the text from todo
  try {
    const response = await fetch("markUnComplete", {
      // call the markUnComplete Update Operation on the server
      method: "put", //declare the type of operation that will be used
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText, //add todo text to a json object called body
      }),
    });
    const data = await response.json(); // wait for response from the server and store it in data variable
    console.log(data); // display the data object in the client console
    location.reload(); // reload the current webpage
  } catch (err) {
    console.log(err); // if there is an error, display the error object in client console
  }
}
