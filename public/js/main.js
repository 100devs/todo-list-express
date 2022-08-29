// Storing all elements in the dom with class '.fa-trash in a node list
const deleteBtn = document.querySelectorAll(".fa-trash");

const checkBtn = document.querySelectorAll(".fa-check");
// Storing all paragraph elements inside '.item' class inside node list
// const item = document.querySelectorAll(".item span");
const item = document.querySelectorAll(".item p");
// Storing all paragraph elements inside '.item' class that also have a 'completed' class inside node list
const itemCompleted = document.querySelectorAll(".item p.completed");

// Creating an array from the list 'deletion', then assigning each with an event listener that goes to function 'deleteItem'
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});

// Creating an array from the node list 'item', then assigning each an event listener that goes to function 'markComplete'
Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});

// Creating an array from the node list 'itemCompleted', then assigning each an event listener that goes to function 'markUnComplete'
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});

// An async function to delete the todo item assicuated with the delete icon we clicked
async function deleteItem() {
  // We're getting the text of the todo-item and saving it in variable 'itemText'
  // instead of [1] its [5]
  const itemText = this.parentNode.children[0].innerText;
  //   const itemText = this.parentNode.childNodes[5].innerText;
  //different method. Video 2 @34:35
  // const itemText = this.parentNode.children[0].trim()

  //   Useful L:24
  //   console.log(this.parentNode.childNodes[5].innerText);
  //   const itemText = this.parentNode.childNodes[1].innerText;
  console.log(itemText);
  //   L:26 can useful too in browser console
  //   console.log(this.parentNode)
  //   console.log(this.parentNode.childNodes[1])

  // @2nd video @24:57
  //   console.log(this.parentNode.childNodes);
  // Sending a delete request to the server with the following parameters
  try {
    const response = await fetch("deleteItem", {
      //Specifyinng that is a delete request
      method: "delete",
      // Defining the key 'itemFromJS' as the text from the to-do item
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // Waiting for a
    const data = await response.json();
    console.log(data);
    // Location refresh
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

// list items Text crossed as "marked Completed" in the Browser/console
// Async function to mark a todo item as complete
async function markComplete() {
  // getting the text of the todo item and storing it in itemText
  // const itemText = this.parentNode.childNodes[1].innerText;
  // const itemText = this.parentNode.children;
  const itemText = this.parentNode.children[0].innerText;
  // Sending a put request to the server to mark the item as complete
  // console.log('something')
  console.log(itemText);
  try {
    const response = await fetch("markComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      // Defining the key 'itemFromJS' as the text from the to-do item
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });

    // Waiting for aa response from the server
    const data = await response.json();
    // console logging the server's response
    console.log(data);
    // location refresh, reloading the page
    location.reload();
    // Basic error catch
  } catch (err) {
    console.log(err);
  }
}

// Async function to mark a complete todo item as incomplete
async function markUnComplete() {
  // orginal text L:82
  // const itemText = this.parentNode.childNodes[1].innerText;
  // Getting the text of the todo item and storing it in itemText
  const itemText = this.parentNode.children[0].innerText;
  console.log(itemText);
  try {
    // Sending a put request to the server to mark a complete item  as
    const response = await fetch("markUnComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // Waiting for a response fro mthe server
    const data = await response.json();
    //console logging the server's response
    console.log(data);
    // refresh site
    // location.reload();

    // Basic error catch
  } catch (err) {
    console.log(err);
  }
}
