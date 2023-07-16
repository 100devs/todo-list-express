const deleteBtn = document.querySelectorAll('.fa-trash') // The trash can which is selected is assigned to the constant variable deleteBtn
const item = document.querySelectorAll('.item span') // Constant 'item' is assigned to the 'span' element.
const itemCompleted = document.querySelectorAll('.item span.completed') // Constant 'itemCompleted' is assigned to the 'span.completed item.

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
}) 
// The array.from method creates a new array from the current elements ('todos' in the array) and iterates through them until it finds the element which has been clicked. Then the deleteItem function starts.

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// The array.from method creates a new array from the current elements ('todos' in the array) and iterates through them until it finds the element which has been clicked.The the markComplete function starts.

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
// The array.from method creates a new array from the current elements ('todos' in the array) and iterates through them until it finds the element which has been clicked. Then the markUnComplete function starts.

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //parentNode = li, childNode = span. From index.ejs. The innerText is whatever is added into the span. This function runs when the trash can (deleteBtn) is clicked. 
    try{
        const response = await fetch('deleteItem', {
            method: 'delete', //delete method is used to delete the item from the database.
            headers: {'Content-Type': 'application/json'}, //headers are used to tell the server what kind of data we are sending.
            body: JSON.stringify({// JSON.stringify() is used to convert the data into a string.
              'itemFromJS': itemText
            })
          })
        const data = await response.json() //await response.json waits from the response from the server
        console.log(data) //console.log(data) prints the data in the console
        location.reload() //reloads(refreshes) the page, thereby generating another app.get request.

    }catch(err){//if something goes wrong this code gives you an error message
        console.log(err)//the error message is logged to the console.
    }
}
// We are using async..await asynchronous method & try..catch error handling methods in the function above and below this line. https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises

async function markComplete(){
  const itemText = this.parentNode.childNodes[1].innerText; //parentNode = li, childNode = span. From index.ejs. The innerText is whatever is added into the span. This function runs when the item span is clicked.
  try {
    const response = await fetch("markComplete", {
      method: "put", // Update method is used to update the database
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
// The markComplete() function sends an update request to the server when an item span is clicked. The server responds to this request, updates the database to say that this todo has been completed and serves up the updated index.ejs with updated styles (line-through and greyed out).

async function markUnComplete(){
  const itemText = this.parentNode.childNodes[1].innerText; //parentNode = li, childNode = span. From index.ejs. The innerText is whatever is added into the span. This function runs when the line-through, greyed out span is clicked.
  try {
    const response = await fetch("markUnComplete", {
      method: "put", // Update method is used to update the database
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
// The markUnComplete() function sends an update request to the server when a line-through, greyed out span is clicked. The server responds to this request, updates the database to say that this todo has not been completed and serves up the updated index.ejs with updated styles (line-through cancelled and font color returns to black).