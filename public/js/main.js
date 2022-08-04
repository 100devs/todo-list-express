// Creating a variable that selects all elements with class "fa-trash" from the DOM
const deleteBtn = document.querySelectorAll('.fa-trash')
// Creating a variable that selects the span elements with a class of item from the DOM
const item = document.querySelectorAll('.item span')
// Store all span elements w/ item class marked complete and assign to variable
const itemCompleted = document.querySelectorAll('.item span.completed')

// Generate an array from variables deleteBtn and add smurf that listens to each for a click event
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) // On click run method deleteItem
})

// Generate an array from variable item and add a smurf that listens to each for a click event
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) // On click run method markComplete
})

// Generate an array from variable itemCompleted and add a smurf that listens to each for a click event
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) // On click run method markUnComplete
})

// On function call, runs an async function to delete an item
async function deleteItem(){
    // Parses through the nodes to assign innertext to a variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Sends a DELETE request to server.js '/deleteItem'
        const response = await fetch('deleteItem', {
            // Send the following properties with the request
            method: 'delete',
            headers: {'Content-Type': 'application/json'},            
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // Wait for the response
        const data = await response.json()
        // Log the response data
        console.log(data)
        // Refresh the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// On function call, runs an async function to mark an item complete
async function markComplete(){
  // Store inner text of the item in variable itemText  
  const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Sends a PUT request to server.js '/markComplete'
        const response = await fetch('markComplete', {
            // Send the following properties with the request
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Wait for the response
        const data = await response.json()
        // Log response data
        console.log(data)
        // Refresh the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// On function call, runs an async function to mark an item uncomplete
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Sends a PUT request to server.js '/markUncomplete'
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Wait for the response
        const data = await response.json()
        // Log request data
        console.log(data)
        // Refresh the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}