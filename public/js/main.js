// Create shorthand to refer to all of the trashcan icons (elements with the class 'fa-trash')
const deleteBtn = document.querySelectorAll('.fa-trash')
// Create shorthand to refer to all of the blocks of texts that represent todo items (spans with the class 'item')
const item = document.querySelectorAll('.item span')
// Create shorthand to refer to all of the blocks of text that represent completed items (spans with the classes 'item' and 'completed')
const itemCompleted = document.querySelectorAll('.item span.completed')

// Iterate through the list of delete buttons
Array.from(deleteBtn).forEach((element)=>{
    // Add an event listener to all of them that listens for the user's click
    // If the user clicks, run the 'deleteItem' function
    element.addEventListener('click', deleteItem)
})

// Iterate through the list of items (todos)
Array.from(item).forEach((element)=>{
    // Add an event listener to all of them that listens for the user's click
    // If the user clicks, run the markComplete function
    element.addEventListener('click', markComplete)
})

// Iterate through the list of items with the 'completed' class
Array.from(itemCompleted).forEach((element)=>{
    // Add an event listener to all of them that listens for the user's click
    // If the user clicks, run the markUncomplete function
    element.addEventListener('click', markUnComplete)
})

// Create a function to delete an item
async function deleteItem(){
    // Get the text content of the todo item that the user clicked on
        // To get to that text, we find:
            // 'this' (the trashcan icon that was clicked), then
            // the parent node (the <li>), then
            // the second child node (the span), then
            // the innerText (the text inside the span)
    const itemText = this.parentNode.childNodes[1].innerText
    // Attempt to do the following:
    try{
        // Send a fetch request to the /deleteItem endpoint in server.js
        const response = await fetch('deleteItem', {
            // Specify that this is a DELETE request
            method: 'delete',
            // Specify that the type of data we're sending is in the JSON format
            headers: {'Content-Type': 'application/json'},
            // Set the body of the request to include a JSON object with a key 'itemFromJS' and a value of 'itemtext'
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Wait for the server's response and parse it as JSON
        const data = await response.json()
        // Print the response to the console
        console.log(data)
        // Refresh the page, triggering a new GET request to the root directory and displaying the updated content
        location.reload()
    // If the attempt is not successul,
    }catch(err){
        // Throw an error
        console.log(err)
    }
}

// Create a function to mark an item as complete
async function markComplete(){
    // Create shorthand for the text of the target item
    // The text is the text of the first child node (span) of the parent node (li) of the thing that was clicked (span)
    const itemText = this.parentNode.childNodes[1].innerText
    // Attempt to do the following,
    try{
        // Send a fetch request to the server.js route with the endpoint '/markComplete'
        const response = await fetch('markComplete', {
            // Specify that this is a PUT request
            method: 'put',
            // Specify that we are sending JSON data
            headers: {'Content-Type': 'application/json'},
            // Set the body of the request to include a JSON object with a key 'itemFromJS' and a value of 'itemtext'
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Wait for the server to respond, then parse the rresponse as JSON
        const data = await response.json()
        // Print the response to the console
        console.log(data)
         // Refresh the page, triggering a GET request to the root directory and displaying the updated content
        location.reload()
    // If the attempt is not successul,
    }catch(err){
        // Print an error message to the console
        console.log(err)
    }
}

// Create a function that marks an item as uncomplete
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    // Attempt to do the following:
    try{
        //  Send a fetch request to the server.js route with the endpont '/markUncomplete'
        const response = await fetch('markUnComplete', {
            // Specify that this is a PUT request
            method: 'put',
            // Specify that we are sending JSON data
            headers: {'Content-Type': 'application/json'},
            // Set the body of the request to include a JSON object with a key 'itemFromJS' and a value of 'itemtext'
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Wait for the server to respond, then parse the response as JSON
        const data = await response.json()
        // Print the response to the console
        console.log(data)
        // Refresh the page, triggering a GET request to the root directory and displaying the updated content
        location.reload()
    // If that attempt is not successful,
    }catch(err){
        console.log(err)
        // Print an error message to the console
    }
}