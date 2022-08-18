const deleteBtn = document.querySelectorAll(".fa-trash"); // selects all trash can icons
const item = document.querySelectorAll(".item span"); // selects all children span elements under a parent with class of item
const itemCompleted = document.querySelectorAll(".item span.completed"); // selects all span children with a class of completed under a parent with a class of item

Array.from(deleteBtn).forEach((element) => {
  // converts to array and then loops thru each trash can icons
  element.addEventListener("click", deleteItem); // attachs a eventlistner which calls the deleteitem function when clicked
}); // end of loop

Array.from(item).forEach((element) => {
  // converts to array and then loops thru each todo text
  element.addEventListener("click", markComplete); // attachs a eventlistner which calls the markComplete function when clciked
}); // end of loop

Array.from(itemCompleted).forEach((element) => {
  // converts to array and then loops thru each todo text with a class of complete
  element.addEventListener("click", markUnComplete); // attachs a eventlistner wich calls the markUnComplete function when clicked
}); // end of loop

async function deleteItem() {
  // asynchronous function to delete a todo item
  const itemText = this.parentNode.childNodes[1].innerText; // selects the text of thetodo item that was clicked
  try {
    const response = await fetch("deleteItem", {
      // asynchronous fetch call to the api to delete a todo item
      method: "delete", // delete method
      headers: { "Content-Type": "application/json" }, // tells api to expect json data
      body: JSON.stringify({
        //sets the req.body in json format. contains text of to do item to delete
        itemFromJS: itemText,
      }),
    });
    const data = await response.json(); // variable stores the json that was returned from api
    console.log(data); // console logs the data
    location.reload(); // tells page that made this call to refresh
  } catch (err) {
    console.log(err); // console logs any errors
  }
}

async function markComplete() {
  // asynchronous function to set a to do item as complete
  const itemText = this.parentNode.childNodes[1].innerText; // selects the text of thetodo item that was clicked
  try {
    const response = await fetch("markComplete", {
      // asynchronous fetch call to the api to set a todo item as complete
      method: "put", // put method
      headers: { "Content-Type": "application/json" }, // tells api to expect json data
      body: JSON.stringify({
        //sets the req.body in json format. contains text of to do item to delete
        itemFromJS: itemText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload(); // tells page that made this call to refresh
  } catch (err) {
    console.log(err); // console logs any errors
  }
}

async function markUnComplete() {
  // asynchronous function to set a to do item as uncomplete
  const itemText = this.parentNode.childNodes[1].innerText; // selects the text of thetodo item that was clicked
  try {
    const response = await fetch("markUnComplete", {
      // asynchronous fetch call to the api to set a todo item as uncomplete
      method: "put", // put method
      headers: { "Content-Type": "application/json" }, // tells api to expect json data
      body: JSON.stringify({
        //sets the req.body in json format. contains text of to do item to delete
        itemFromJS: itemText,
      }),
    });
    const data = await response.json(); // variable stores the json that was returned from api
    console.log(data); // console logs the data
    location.reload(); // tells page that made this call to refresh
  } catch (err) {
    console.log(err); // console logs any errors
  }
}
