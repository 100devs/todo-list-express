// hold elements with a class of fa-trash with deleteBtn variable
const deleteBtn = document.querySelectorAll(".fa-trash");
// hold span elements that found inside a parent has class of 'item' with item variable
const item = document.querySelectorAll(".item span");
// hold span elements that has class 'completed' and that found inside a parent has class of 'item' with itemCompleted variable
const itemCompleted = document.querySelectorAll(".item span.completed");

// create array from the iterable variable deleteBtn
// loop through them
// add event listener for each element listen for 'click' when it catched fire a deleteItem function
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});

// create array from the iterable variable item
// loop through them
// add event listener for each element listen for 'click' when it catched fire a markComplete function
Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});

// create array from the iterable variable itemCompleted
// loop through them
// add event listener for each element listen for 'click' when it catched fire a markUnComplete function
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});

// definition of deleteItem function that will used for deletion and make it async as it will deals with the server that will take time to fulfilled
async function deleteItem() {
  // store 'this' which hold the clicked item's parent's first child's text in itemText variable
  // 'this': span.fa.fa-trash
  // 'parentNode' : li.item
  // 'childNodes[1]': [text, *span*, text, text,span.fa.fa-trash, text]
  // 'innerText': the text of the above selected span
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

// definition of markComplete function that will used for make a clicked item complete if it is incomplete and make it async as it will deals with the server that will take time to fulfilled
async function markComplete() {
  console.log(this.parentNode.childNodes[1]);
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

// definition of markUnComplete function that will used for make a clicked item incomplete if it is complete and make it async as it will deals with the server that will take time to fulfilled
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
