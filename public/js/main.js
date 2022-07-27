//Get all the trash icons using their class name "fa-trash", save them in deleteBtn variable
const deleteBtn = document.querySelectorAll(".fa-trash");
//Get all the spans inside "item" class, save them in item variable
const item = document.querySelectorAll(".item span");
//Get the spans inside "item" class that have a "completed" class
const itemCompleted = document.querySelectorAll(".item span.completed");

//Creating an array from the nodelist "deleteBtn", Loop through each of them and assign an event listener with "deleteItem" function
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});

//Creating an array from the nodelist "item", Loop through each of them and assign an event listener with "markComplete" function
Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});

//Creating an array from the nodelist "itemCompleted", Loop through each of them and assign an event listener with "markUnComplete" function
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});

//An async function to delete an item
async function deleteItem() {
  //Saving the text of the selected todo item in "itemText" variable
  const itemText = this.parentNode.childNodes[5].innerText;
  try {
    //Await the response from the request to delete an item and save it in "response" variable
    const response = await fetch("deleteItem", {
      //specifying that this is a "delete" request
      method: "delete",
      //Telling the server that the resource or content been sent is Json type
      headers: { "Content-Type": "application/json" },
      //Parsing the itemText to Json format and sending it as the body of the http request
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    //Await response and save it in variable "data"
    const data = await response.json();
    //Display the response received in the console
    console.log(data);
    //Reload/refresh the page
    location.reload();
    //if error, catch and display it in the console.
  } catch (err) {
    console.log(err);
  }
}

//An async function to update an item
async function markComplete() {
  //Saving the text of the selected todo item in "itemText" variable
  const itemText = this.parentNode.childNodes[5].innerText;
  try {
    //Await the response from the request to update an item and save it in "response" variable
    const response = await fetch("markComplete", {
      //specifying that this is a "put" request
      method: "put",
      //Telling the server that the resource or content been sent is Json type
      headers: { "Content-Type": "application/json" },
      //Parsing the itemText to Json format and sending it as the body of the http request
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    //Await response and save it in variable "data"
    const data = await response.json();
    //Display the response received in the console
    console.log(data);
    //Reload/refresh the page
    location.reload();
    //if error, catch and display it in the console.
  } catch (err) {
    console.log(err);
  }
}

//An async function to update an item
async function markUnComplete() {
  //Saving the text of the selected todo item in "itemText" variable
  const itemText = this.parentNode.childNodes[5].innerText;
  //Await the response from the request to update an item and save it in "response" variable
  try {
    const response = await fetch("markUnComplete", {
      //specifying that this is a "put" request
      method: "put",
      //Telling the server that the resource or content been sent is Json type
      headers: { "Content-Type": "application/json" },
      //Parsing the itemText to Json format and sending it as the body of the http request
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    //Await response and save it in variable "data"
    const data = await response.json();
    //Display the response received in the console
    console.log(data);
    //Reload/refresh the page
    location.reload();
    //if error, catch and display it in the console.
  } catch (err) {
    console.log(err);
  }
}
