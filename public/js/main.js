//selects the id from the document's fa-trash id
const deleteBtn = document.querySelectorAll(".fa-trash");
//selects the id from the document's span attribute .item
const item = document.querySelectorAll(".item span");
//selects the id from the document's .item span.completed id.
const itemCompleted = document.querySelectorAll(".item span.completed");

//loops over all elemts with delete button and adds a click event wihc fires the function deleteItem to each one.
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});
//loops over all elements with item and adds a click event wihc fires the function markComplete to each one.
Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});
//loops over all elements with item and adds a click event wihc fires the function markUnomplete to each one.
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});
//creates an async function that wilil delete an item
async function deleteItem() {
  //finst the text of the item to be deleted from parent node.
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    //sends a delete request to the deleteItem endpoint on the server.
    const response = await fetch("deleteItem", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    //console.logs all of the json and logs it.
    const data = await response.json();
    console.log(data);
    //reloads the page to show our changed document state.
    location.reload();
  } catch (err) {
    //console.logs any errors that might have occured.
    console.log(err);
  }
}

async function markComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    //selects the text of the item that should be altered from the parent node.
    const response = await fetch("markComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    //console.logs all of the json and logs it.
    const data = await response.json();
    console.log(data);
    //reloads the page to show our changed document state.
    location.reload();
  } catch (err) {
    //console.logs any errors that might have occured.
    console.log(err);
  }
}
//makes a function to revers the complete boolean on a todo.
async function markUnComplete() {
  //slescts the text of the item that should be altered from the parent node.
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    //Sends a PUT request to the server via the markUnCOmplete server endpoint.
    const response = await fetch("markUnComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    //console.logs all of the json and logs it.
    const data = await response.json();
    console.log(data);
    //reloads the page to show our changed document state.
    location.reload();
  } catch (err) {
    //console.logs any errors that might have occured.
    console.log(err);
  }
}
