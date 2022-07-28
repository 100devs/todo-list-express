/////////////// Global Variables ////////////////////////////////
const deleteBtn = document.querySelectorAll(".fa-trash"); // grab ALL trash icon/delete buttons and store them in deleteBtn as a NodeList
const item = document.querySelectorAll(".item span"); // grab ALL todo item spans (the text of the todo) and store them in item as a NodeList
const itemCompleted = document.querySelectorAll(".item span.completed"); // grab ALL todo item spans that have the class of .completed and store them in itemCompleted as a NodeList

console.log(deleteBtn[0].parentNode);
/////////////// Event Listeners ////////////////////////////////
Array.from(deleteBtn).forEach((element) => {
  //Create an Array out of the deletBtn NodeList(which contains every delete button on the page)
  element.addEventListener("click", deleteItem); //Add an event listener to each delete button to fire deleteItem function on click
});

Array.from(item).forEach((element) => {
  //Create an Array out of the item NodeList(which contains every item on the page)
  element.addEventListener("click", markComplete); //Add an event listener to each task's text to fire markComplete function on click
});

Array.from(itemCompleted).forEach((element) => {
  //Create an Array out of the items completed NodeList(which contains every completed item on the page)
  element.addEventListener("click", markUnComplete); //Add an event listener to each completed task's text(identified by having the .completed CSS class) to fire markUnComplete function on click
});

/////////////// Client Side Functions ////////////////////////////////
async function deleteItem() {
  //a function that removes an item when trash can clicked
  const itemText = this.parentNode.childNodes[1].innerText; // some janky ass dom node property accessing the text to grab

  try {
    // error prevention
    const response = await fetch(
      "deleteItem", //fetch the deleteItem from server.js
      {
        //HEADERS for the delete
        method: "delete", //designate the method
        headers: { "Content-Type": "application/json" }, // set content-type as json
        body: JSON.stringify({
          //make json string of the target string
          itemFromJS: itemText, // itemText defiend at start of function, it's that janky thing
        }),
      }
    );
    const data = await response.json(); //if able to fetch it, put the response as json()
    console.log(data); // log the data
    location.reload(); // reload the page
  } catch (err) {
    // Dodge this if no error
    console.log(err);
  }
}

async function markComplete() {
  // A delighful function which will mark a task as complete, by going to markComplete route, which.... sets the complete property of the associated todo document to True, which, when EJS renders the task, applies the .completed task, which crosses the item out.

  const itemText = this.parentNode.childNodes[1].innerText; // some janky ass dom node property accessing the text to grab

  try {
    // error prevention
    const response = await fetch("markComplete", {
      //fetch the markComplete route from server.js
      method: "put", //designate the method
      headers: { "Content-Type": "application/json" }, //make json string of the target string
      body: JSON.stringify({
        //make json string of the target string
        itemFromJS: itemText, // itemText defiend at start of function, it's that janky thing
      }),
    });
    const data = await response.json(); //if able to fetch it, put the response as json()
    console.log(data); // log the data
    location.reload(); // reload the page
  } catch (err) {
    // Dodge this if no error
    console.log(err);
  }
}

//this is pretty much the exact same as markComplete function above, except for the Route
async function markUnComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("markUnComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
        // isComplete: !item.complete
      }),
    });
    const data = await response.json(); // store response JSON in data
    console.log(data); // log the data
    location.reload(); // take a cool, refreshing shower
  } catch (err) {
    console.log(err); // errrrrrrr
  }
}
