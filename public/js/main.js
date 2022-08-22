// The main client side javascript that provides the client side behaviour of our application

const deleteBtn = document.querySelectorAll('.fa-trash')
// Assigns the variable deleteBtn to reference all elements in the document with class .fa-trash
const item = document.querySelectorAll('.item span')
// Assigns the variable item to all spans in the document that are descendants of elements with class .item
const itemCompleted = document.querySelectorAll('.item span.completed')
// Assigns the variable itemCompleted to all spans with class completed in the document that are descendants of elements with class .item

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
// These lines each create an array from the node list variables we just created.
// The arrays are iterated through and the appropriate event listener is added to each element.


async function deleteItem(){ // This function deletes an item from our database.
    const itemText = this.parentNode.childNodes[1].innerText // Sets the variable itemText to refer to the text of item we clicked on
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}
// The function is an async function i.e through the use of the async keyword we can make an asynchronous task run synchronously.
// This function is the clients side logic that starts off the deletion of entries in our db. Previously we see the eventlistener 
// being added to spans with a .fa-trash class, when one of these is clicked it triggers off this function which using the fetch method
// sends a request back to the server with the delete method, it parses as json the inner text of the span containing the todo 
// item and sends this back to the server which then instructs the db to find an entry that matches the todo item text and delete this. 
// Once this has been done the server responds with a message saying the  message has been deleted. After the message is received 
// the function logs this to the console and then reloads the page which triggers a get request which will render the html, now without the 
// todo item that was clicked to delete to set off this function.


async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}
// The markComplete and markUnComplete functions are both asynchronous as indicated by the async keyword. They make up the client side logic
// for our PUT requests. These functions let our server know when a task has been marked complete or incomplete. When spans that are 
// descendants of elements with a class of todoItem are clicked the mark complete function is triggered the inner text of the span is stored
// as todoText and then parsed into json which is then sent to the server using the fetch method. the use of the await keyword tells our fetch function 
// to wait for the promise to resolve. If the  promise reolves successfully, a message of task marked complete is received from the 
// server and the browser is the refreshed which will then trigger another fetch response and generate an updated html file to reflect 
// the information stored in the database. When this happens the element clicked on to kick off the fetch will be rendered with a 
// class of completed and a css rule is applied giving it an effect of being greyed out and crossed through

// The markUnComplete function does the same thing, but rather than instruct the server to edit the db entry to reflect that the task 
// has been completed, it requests the db entry be updated to reflect that the task is to be marked as incomplete. This will then 
// also cause a reload of the page and the ejs to rerender. In this instance the span will not have a completed class attached and 
// as such will render as anormal span with no css rule applied.