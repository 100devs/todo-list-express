//Variable that's used to delete an item
const deleteBtn = document.querySelectorAll(".fa-trash");
//Item Selector
const item = document.querySelectorAll(".item span");
//Item completion button
const itemCompleted = document.querySelectorAll(".item span.completed");

//Event listener for every item with a deleteBtn
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});

//Creates an array from the node list 'deleteBtn', then assigns each item with an event listener that calls the deleteItem function
Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});
//Allows you to undo the completed status of an item
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});

//Function for deleting an item
async function deleteItem() {
  const itemText = this.parentNode.children[0].innerText.trim();
  try {
    const response = await fetch("deleteItem", {
      //specifying that this is a delete request
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    //waiting for a response frm the server
    const data = await response.json();
    console.log(data);
    //reloads the page
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

//Function for marking an item as completed

async function markComplete() {
  //Getting the text of the todo item and storing t in itemText
  const itemText = this.parentNode.children[0].innerText.trim();
  try {
    const response = await fetch("markComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      //Defining the key 'itemFRomJS' as the text from the todo item
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

//Function for unmarking an item as completed

async function markUnComplete() {
  const itemText = this.parentNode.children[0].innerText.trim();
  try {
    //Sending a delete request to the server with the following parameters
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
