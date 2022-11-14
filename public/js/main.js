// Initiate elements with trash can (delete) icon
const deleteBtn = document.querySelectorAll('.fa-trash')
// Initiate all tasks
const item = document.querySelectorAll('.item span')
// Initiate completed tasks
const itemCompleted = document.querySelectorAll('.item span.completed')

// Loop through all elements with "Delete" icon
Array.from(deleteBtn).forEach((element)=>{
    // Add click event listener to each
    element.addEventListener('click', deleteItem)
})

// Loop through all completed tasks
Array.from(item).forEach((element)=>{
    // Add click event listener to each
    element.addEventListener('click', markComplete)
})

// Loop through all uncompleted tasks
Array.from(itemCompleted).forEach((element)=>{
    // Add click event listener to each
    element.addEventListener('click', markUnComplete)
})

// Asynchronous function sending the DELETE request to the server and returning a promise of a deleted item on the server
async function deleteItem(){
    // Initiate variable to store text data from <li> (childNode) inside <ul> (parentNode)
    const itemText = this.parentNode.childNodes[1].innerText
    // If resolved,
    try{
        // Send DELETE request to the server with task's name (itemText) in JSON format
        const response = await fetch('deleteItem', {
            method: 'delete',
            // Set headers' content type to JSON format
            headers: {'Content-Type': 'application/json'},
            // Turn JSON document into string type
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // Store the server response in JSON format
        const data = await response.json()
        // Log the response in console
        console.log(data)
        // Reload the browser page
        location.reload()
    // If not resolved,
    }catch(err){
        // Log the error body in the console
        console.log(err)
    }
}

// Asynchronous function sending the PUT request to the server and returning a promise of updated item on the server (marks 'complete')
async function markComplete(){
    // Initiate variable to store text data from <li> (childNode) inside <ul> (parentNode)
    const itemText = this.parentNode.childNodes[1].innerText
    // If resolved,
    try{
        // Send PUT (update) request to the server with task's name (itemText) in JSON format
        const response = await fetch('markComplete', {
            method: 'put',
            // Set headers' content type to JSON format
            headers: {'Content-Type': 'application/json'},
            // Turn JSON document into string type
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Store the response in JSON format
        const data = await response.json()
        // Log the response in console
        console.log(data)
         // Reload the browser page
        location.reload()
    // If not resolved,
    }catch(err){
        // Log the error body in the console
        console.log(err)
    }
}

// Asynchronous function sending the PUT request to the server and returning a promise of updated item on the server (marks 'uncomplete')
async function markUnComplete(){
    // Initiate variable to store text data from <li> (childNode) inside <ul> (parentNode)
    const itemText = this.parentNode.childNodes[1].innerText
    // If resolved,
    try{
        // Send PUT (update) request to the server with task's name (itemText) in JSON format
        const response = await fetch('markUnComplete', {
            method: 'put',
            // Set headers' content type to JSON format
            headers: {'Content-Type': 'application/json'},
            // Turn JSON document into string type
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Store the response in JSON format
        const data = await response.json()
        // Log the response in console
        console.log(data)
        // Reload the browser page
        location.reload()
    // If not resolved,
    }catch(err){
        // Log the error body in the console
        console.log(err)
    }
}