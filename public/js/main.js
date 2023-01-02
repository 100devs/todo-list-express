// grab all elements with class fa-trash
const deleteBtn = document.querySelectorAll(".fa-trash");
// grab all elements of any element with class item that are span descendents
const item = document.querySelectorAll(".item span");
// grab all spans with class completed that are descendents of any element with
// class item
const itemCompleted = document.querySelectorAll(".item span.completed");

// turn node list into array and for each array element add an event listener
// for a click with deleteItem as the callback function
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});

// turn node list into array and for each array element add an event listener
// for a click with markComplete as the callback function
Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});

// turn node list into array and for each array element add an event listener
// for a click with markUnComplete as the callback function
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});

// asynchronous function
async function deleteItem() {
  // assign constant variable itemText the parent node's child nodes list second
  // node's inner text of the node it was called on
  const itemText = this.parentNode.childNodes[1].innerText;
  // try, catch block
  try {
    // assign constant variable response the awaited fetch response
    const response = await fetch("deleteItem", {
      // delete of CRUD, expect json, turn object to json string
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // assign constant data the awaited response after turning from json to object
    const data = await response.json();
    // log the data to the console
    console.log(data);
    // reload the current URL
    location.reload();
  } catch (err) {
    // log the error to the console
    console.log(err);
  }
}

// asynchronous function
async function markComplete() {
  // assign constant variable itemText the parent node's child nodes list second
  // node's inner text of the node it was called on
  const itemText = this.parentNode.childNodes[1].innerText;
  // try, catch block
  try {
    // assign constant variable response the awaited fetch response
    const response = await fetch("markComplete", {
      // put or update of CRUD, expect json, turn object to json
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // assign constant data the awaited response after turning from json to object
    const data = await response.json();
    // log the data to the console
    console.log(data);
    // reload the current URL
    location.reload();
  } catch (err) {
    // log the error to the console
    console.log(err);
  }
}

// asynchronous function
async function markUnComplete() {
  // assign constant variable itemText the parent node's child nodes list second
  // node's inner text of the node it was called on
  const itemText = this.parentNode.childNodes[1].innerText;
  // try, catch block
  try {
    // assign constant variable response the awaited fetch response
    const response = await fetch("markUnComplete", {
      // put or update of CRUD, expect json, turn object to json
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // assign constant data the awaited response after turning from json to object
    const data = await response.json();
    // log the data to the console
    console.log(data);
    // reload the current URL
    location.reload();
  } catch (err) {
    // log the error to the console
    console.log(err);
  }
}
