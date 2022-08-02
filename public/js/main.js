//Storing  all elements in the dom with class '.fa-trash' in a node list
const deleteBtn = document.querySelectorAll(".fa-trash");
//storing all para elements inside the .'item' class insie a node list
const item = document.querySelectorAll(".item p");
//sotoring all para elements insi the .'iems class that also have a 'completed class insisde a node list
const itemCompleted = document.querySelectorAll(".item p.completed");

//creating an array from the node list 'deleteBtn'. then assigning each with an event listener that goes to function 'deleteitem'
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});

Array.from(item).forEach((element) => {
  element.addEventListener("click", markComplete);
});
//creating an array rom the nodelist 'itemComplete', then assigning eahc event listnere that goes to function 'marUnComplete
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener("click", markUnComplete);
});
//an asynce function to deltethetodo item asiciated with the delte icon we clicked
async function deleteItem() {
  //we're getting thetext of the todo-itme and saving it in variable 'itemText'
  const itemText = this.parentNode.children[0].innerText;
  console.log(this.parentNode.childNodes);
  try {
    //Sending a  dlelte request to the server with the following paramenters
    const response = await fetch("deleteItem", {
      //sspecifiying that this is a delte request
      method: "delete",
      headers: { "Content-Type": "application/json" },
      //defining the key 'itemFromJS' as the text from the to-do item
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    //Waiting for aa response from the server
    const data = await response.json();
    //console logging the server's response
    console.log(data);
    //reloading the page
    location.reload();
    //Basic error catch
  } catch (err) {
    console.log(err);
  }
}
//Async function to makr a tod item as complete
async function markComplete() {
  //Getting the text of the todo item and storing it in itemText
  const itemText = this.parentNode.children[0].innerText;
  //sending a put request to the server, to makr the itme as complete
  console.log(itemText);
  try {
    //Sending a put request to the server to mark a complet item as uncomplete
    const response = await fetch("markComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      //defining the key  'itemFromJS' as the text from the to-do item
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    //waiting for a response from the server
    const data = await response.json();
    //Console logging the servers respponse

    console.log(data);
    //reloafing the plage
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
//Async function to make a complete todo item as incomplete
async function markUnComplete() {
  //getting the text of the todo item and storing it in item text
  const itemText = this.parentNode.children[0].innerText;
  //sending a put request to the server, to makr a complete item as uncomplet
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
