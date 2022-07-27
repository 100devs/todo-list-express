// declaring a constant to store a reference to all the elements on the page with the
// class 'fa-trash'
const deleteBtn = document.querySelectorAll('.fa-trash')
// declaring a constant to store a reference to all the span elements on the page
// that are the children of elements with the class 'item'
const item = document.querySelectorAll('.item span')
// declaring a constant to store a reference to all the span elements on the page
// with the class 'completed' and that have a parent element with the class 'item'
const itemCompleted = document.querySelectorAll('.item span.completed')

// Adding an event listener for all the elements in the deleteBtn variable.
Array.from(deleteBtn).forEach((element)=>{
    // each event listener for these elements will call the deleteItem function
    // if it receives a click event.
    element.addEventListener('click', deleteItem)
})

// Adding an event listener for all the elements in the item variable.
Array.from(item).forEach((element)=>{
    // each event listener for these elements will call the markComplete() function
    // if it receives a click event.
    element.addEventListener('click', markComplete)
})

// Adding an event listener to all the elements in the itemCompleted variable.
Array.from(itemCompleted).forEach((element)=>{
    // each event listener for these elements will call the markUnComplete()
    // function if it receives a click event.
    element.addEventListener('click', markUnComplete)
})

// This is whats called when a todo list item is deleted.
// If one of the elements in the variable deleteBtn receives a click event, this
// function is called.
async function deleteItem(){
    // setting up a variable to store the inner html text that is currently in the
    // second <span> element in the todo task - the actual todo task text
    const itemText = this.parentNode.childNodes[1].innerText
    // attempting the async function
    try{
        // setting up a variable to hold the return value from fetching at the
        // route /deleteItem, and passing in itemText variable wrapped in a
        // formatted request.
        const response = await fetch('deleteItem', {
            // setting the request method to DELETE
            method: 'delete',
            // setting the content-type as json
            headers: {'Content-Type': 'application/json'},
            // setting the body to be a JSON object with the field itemFromJS
            // and using the previously stored itemText variable as the value.
            body: JSON.stringify({
              // itemFromJS is what will be used by server to reference,
              // itemText is the innerText from the todo item element.
              'itemFromJS': itemText
            })
          })
        // If the server responds, it will provide a success message in JSON format
        const data = await response.json()
        // Console log that message in the browser console
        console.log(data)
        // Reload the current URL to reflect any changes rendered to the public folder
        location.reload()
    // if the async function fails, catch will receive the error
    }catch(err){
      // console logging the error
        console.log(err)
    }
}

// This is what's called when an item is marked complete. It receives the event
// target, finds the innertext of the todo item element, searches the database
// for the document that matches, and updates the document to show it's completed.
async function markComplete(){
    // setting up a variable to store the inner html text that is currently in the
    // second <span> element in the todo task - the actual todo task text
    const itemText = this.parentNode.childNodes[1].innerText
    // attempting the async function
    try{
        // setting up a variable to hold the return value from fetching at the
        // route /markComplete, and passing in itemText variable wrapped in a
        // formatted request for the route to search for documents with.
        const response = await fetch('markComplete', {
            // setting the request method to 'PUT'
            method: 'put',
            // setting the content type as JSON
            headers: {'Content-Type': 'application/json'},
            // setting the body to be a JSON object with the field itemFromJS
            // and using the previously stored itemText variable as the value.
            body: JSON.stringify({
                // itemFromJS is what will be used by server to reference,
                // itemText is the innerText from the todo item element.
                'itemFromJS': itemText
            })
          })
        // this receives the server response that confirms the request was
        // successful
        const data = await response.json()
        // console logging the servers response message in the browser console
        console.log(data)
        // Reload the current URL to reflect any changes rendered to the public
        // folder
        location.reload()
    // if the async function fails, catch will receive the error
    }catch(err){
        // console logging the error
        console.log(err)
    }
}

// this is whats called when an item is marked uncomplete. It receives the same
// info as the above function, the innertext of the second span of the todo item.
// It takes the inner text string and passes it to the server to search for a
// matching document, and changes the completed field to false.
async function markUnComplete(){
    // setting up a variable to store inner text of the second span of the todo
    // list element that was clicked.
    const itemText = this.parentNode.childNodes[1].innerText
    // attempting the async function
    try{
        // setting up a variable to hold the return value from fetching at the
        // route /markUnComplete, and passing in itemText variable wrapped in a
        // formatted request for the route to search for documents with.
        const response = await fetch('markUnComplete', {
            // setting the request method to PUT
            method: 'put',
            // setting the request content type to JSON
            headers: {'Content-Type': 'application/json'},
            // setting the body to a JSON formatted object, passing in JS object
            body: JSON.stringify({
                // todo items text string as the value for 'itemFromJS'
                'itemFromJS': itemText
            })
          })
        // setting a variable data to what the server returns as a response,
        // formatted back to JSON. This should be a confirm message that it's
        // successful
        const data = await response.json()
        // console logging the response
        console.log(data)
        // reloading the current URL to reflect changes rendered to the public
        // folder.
        location.reload()
    // if the async function fails, catch will receive the error
    }catch(err){
      // console logging the error.
        console.log(err)
    }
}
