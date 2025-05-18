// Select all elements with the class 'fa-trash' (trash can icons used for deleting items)
const deleteBtn = document.querySelectorAll('.fa-trash')
// Select all <span> elements inside items (to-do tasks)
const item = document.querySelectorAll('.item span')
// Select all <span> elements that are marked as completed
const itemCompleted = document.querySelectorAll('.item span.completed')

// Loop through each delete button and add a click event listener that calls the deleteItem function
Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem) // Add click event to trigger deletion
})

// Loop through each to-do item and add a click event listener that calls the markComplete function
Array.from(item).forEach((element) => {
    element.addEventListener('click', markComplete) // Add click event to mark item as complete
})

// Loop through each completed to-do item and add a click event listener that calls the markUnComplete function
Array.from(itemCompleted).forEach((element) => {
    element.addEventListener('click', markUnComplete) // Add click event to mark item as uncompleted
})

// Define an async function to delete a to-do item
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText // Get the text of the to-do item to delete
    try{
        const response = await fetch('deleteItem', { // Send a DELETE request to the server
            method: 'delete', // Specify HTTP method as DELETE
            headers: {'Content-Type': 'application/json'}, // Set request headers
            body: JSON.stringify({ // Send the item text as JSON
              'itemFromJS': itemText // Key-value pair for item text
            })
        })
        const data = await response.json() // Wait for the server's JSON response
        console.log(data) // Log the response to the console
        location.reload() // Reload the page to update the list

    } catch(err){
        console.log(err) // Log any errors if they occur
    }
}

// Define an async function to mark a to-do item as complete
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // Get the text of the to-do item to update
    try{
        const response = await fetch('markComplete', { // Send a PUT request to the server
            method: 'put', // Specify HTTP method as PUT
            headers: {'Content-Type': 'application/json'}, // Set request headers
            body: JSON.stringify({ // Send the item text as JSON
                'itemFromJS': itemText // Key-value pair for item text
            })
        })
        const data = await response.json() // Wait for the server's JSON response
        console.log(data) // Log the response to the console
        location.reload() // Reload the page to show the updated status

    } catch(err){
        console.log(err) // Log any errors if they occur
    }
}

// Define an async function to mark a completed to-do item as uncompleted
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // Get the text of the to-do item to update
    try{
        const response = await fetch('markUnComplete', { // Send a PUT request to the server
            method: 'put', // Specify HTTP method as PUT
            headers: {'Content-Type': 'application/json'}, // Set request headers
            body: JSON.stringify({ // Send the item text as JSON
                'itemFromJS': itemText // Key-value pair for item text
            })
        })
        const data = await response.json() // Wait for the server's JSON response
        console.log(data) // Log the response to the console
        location.reload() // Reload the page to show the updated status

    } catch(err){
        console.log(err) // Log any errors if they occur
    }
}
