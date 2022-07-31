const deleteBtn = document.querySelectorAll(".fa-trash");
// Captures all to-do items
const item = document.querySelectorAll(".item span");
// Captures all completed items only
const itemCompleted = document.querySelectorAll(".item span.completed");

//Setup listeners
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});

Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});

Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});

// Function to delete item when event handler is clicked
async function deleteItem() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("deleteItem", {
      method: "delete",
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

// Function that checks box as complete when event handler is clicked
async function markComplete() {
  //takes the text that is in the second chile and places it as a vairable in itemText
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("markComplete", {
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

// Function that checks an item unclomplete once event handler checked
async function markUnComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
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
