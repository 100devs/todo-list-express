const deleteBtn = document.querySelectorAll('.fa-trash')
// Select trashcan & declaring a variable to it. 
const item = document.querySelectorAll('.item span')
// Select the span elements that are children of item. 
const itemCompleted = document.querySelectorAll('.item span.completed')
// Selecting the span.completed elements and declaring a variable. 

Array.from(deleteBtn).forEach((element)=>{
    // Adding an event listener to each item from the trashcans. 
    element.addEventListener('click', deleteItem)
    // adding a click event to each trashcan. 
})

Array.from(item).forEach((element)=>{
    // Adding an event listener to each item. 
    element.addEventListener('click', markComplete)
    // adding a click event to each mark complete funciton. 
})

Array.from(itemCompleted).forEach((element)=>{
    // Adding an event listener to each item. 
    element.addEventListener('click', markUnComplete)
    // adding a click event to each mark complete funciton. 
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', {
            // fetch changes the path to deleteitem.
            method: 'delete',
            // method is delete
            headers: {'Content-Type': 'application/json'},
            // tell the server what language to expect. 
            body: JSON.stringify({
              'itemFromJS': itemText
            })
            // this puts it into json. 
          })
        const data = await response.json()
        // wait for the json response that says item deleted from the server. 
        console.log(data)
        // show the data in the terminal. 
        location.reload()
        // reloads the current URL & takes us back to the root. 

    }catch(err){
        console.log(err)
        // shows the error. 
    }
}

async function markComplete(){
    // this is the update function
    const itemText = this.parentNode.childNodes[1].innerText
    // This is a task in our todo list. 
    try{
        const response = await fetch('markComplete', {
            // fetching from the server the markcomplete path. 
            method: 'put',
            // Making a put request, which defines the method we are using. 
            headers: {'Content-Type': 'application/json'},
            // This tells the server we are sending a json application. 
            body: JSON.stringify({
                'itemFromJS': itemText
                // This is the item text. 
            })
          })
        const data = await response.json()
        // wait for the json response to be sent back, store it as a variable. 
        console.log(data)
        // console.log data. 
        location.reload()
        // refreshing the page. 

    }catch(err){
        console.log(err)
        // This is catching the errors
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            // changes the path to mark uncomplete. 
            method: 'put',
            // defines the method that 
            headers: {'Content-Type': 'application/json'},
            // content-type determines what language the server should expect. 
            body: JSON.stringify({
            // this puts it into json. 
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        // awating the json response from the server, put it in a variable. 
        console.log(data)
        // console log the data
        location.reload()
        // refresh

    }catch(err){
        console.log(err)
        // show errors. 
    }
}