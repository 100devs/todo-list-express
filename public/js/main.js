// bind variable deleteBTN to all elements containg class .fa-trash
const deleteBtn = document.querySelectorAll(".fa-trash");
// bind variable item to all elements containing class .item and element span
const item = document.querySelectorAll(".item span");

// bind variable itemCompleted to all elements containing class .item and element span with class completed
const itemCompleted = document.querySelectorAll(".item span.completed");

//Create array from nodelist saved in deletebtn. and loop through the array
Array.from(deleteBtn).forEach((element) => {
  //for each element in the array, add an event listener to the element and bind the deleteItem function to the event
  element.addEventListener("click", deleteItem);
});

//Create array from nodelist saved in item. and loop through the array
Array.from(item).forEach((element) => {
  //for each element in the array, add an event listener to the element and bind the markComplete function to the event
  element.addEventListener("click", markComplete);
});

//Create array from nodelist saved in itemCompleted. and loop through the array
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});

async function deleteItem() {
  //bind variable itemText to the innerText of the second childNode of the parentNode of the element that was clicked
  const itemText = this.parentNode.childNodes[1].innerText;

  try {
    // sends the itemText to the server as a json object for the delete operation asynchronously
    const response = await fetch("deleteItem", {
      // resource options
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });

    // await the response from the server
    const data = await response.json();
    // console.log the data
    console.log(data);
    // reload the page
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

//  create async function to markComplete
async function markComplete() {
  //bind variable itemText to the innerText of the second childNode of the parentNode of the element that was clicked
  const itemText = this.parentNode.childNodes[1].innerText;
  //try to send the itemText to the server as a json object for update request
  try {
    // await the response from the server for the update request
    const response = await fetch("markComplete", {
      //resource options
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // await the response from the server and save it to the variable data as json
    const data = await response.json();
    //console log the data
    console.log(data);
    // reload the page
    location.reload();

    //output error if there is one
  } catch (err) {
    console.log(err);
  }
}

//  create async function to markUnComplete
async function markUnComplete() {
  //bind variable itemText to the innerText of the second childNode of the parentNode of the element that was clicked
  const itemText = this.parentNode.childNodes[1].innerText;
  //try to send the itemText to the server as a json object for update request
  try {
    // await the response from the server for the update request
    const response = await fetch("markUnComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // await the response from the server and save it to the variable data as json
    const data = await response.json();
    //console log the data
    console.log(data);
    // reload the page
    location.reload();

    //output error if there is one
  } catch (err) {
    console.log(err);
  }
}
