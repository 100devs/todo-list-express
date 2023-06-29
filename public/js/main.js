const deleteBtn = document.querySelectorAll(".fa-trash");
// select all elements with class fa-trash
const item = document.querySelectorAll(".item span");
// select all spans that are in a parent element with the item class
const itemCompleted = document.querySelectorAll(".item span.completed");
// select all spans that have the completed class that are in a parent element with the item class

Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});
// put an eventlistener for clicks that calls deleteItem on the deleteBtn

Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});
// put an eventlistener for clicks that calls markComplete on the span

Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});
// put an eventlistener for clicks that calls markComplete on the span that is marked completed

async function deleteItem() {
  const itemText = this.parentNode.childNodes[1].innerText;
  // puts the name of the item clicked (which is its inner text) in a var
  try {
    // promise where we send a fetch request with method DELETE to the server at the deleteItem route, with an object where itemText is in the itemFromJS property.
    const response = await fetch("deleteItem", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // awaiting the response from the server (response.json("Todo Deleted")) then reload the page if resolved
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    // if failed log the error
    console.log(err);
  }
}

async function markComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  // puts the name of the item clicked (which is its inner text) in a var
  try {
    // promise where we send a fetch request with method PUT to the server at the markComplete route, with an object where itemText is in the itemFromJS property.
    const response = await fetch("markComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // awaiting the response from the server (response.json("Marked Complete")) then reload the page if resolved
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    // if failed log the error
    console.log(err);
  }
}

async function markUnComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  // puts the name of the item clicked (which is its inner text) in a var
  try {
    // promise where we send a fetch request with method PUT to the server at the markUnComplete route, with an object where itemText is in the itemFromJS property.
    const response = await fetch("markUnComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // awaiting the response from the server (response.json("Marked Complete")) then reload the page if resolved
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    // if failed log the error
    console.log(err);
  }
}
