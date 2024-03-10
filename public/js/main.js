// Selecting all delete buttons
const deleteBtn = document.querySelectorAll('.fa-trash')
// Selecting all todo items
const item = document.querySelectorAll('.item span')
// Selecting all completed todo items
const itemCompleted = document.querySelectorAll('.item span.completed')

// Adding event listener to each delete button
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Adding event listener to each todo item
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// Adding event listener to each completed todo item
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Function to delete a todo item
async function deleteItem(){
    // Extracting the text of the todo item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Sending a DELETE request to the server
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // Parsing the response
        const data = await response.json()
        console.log(data)
        // Reloading the page after deleting the item
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// Function to mark a todo item as complete
async function markComplete(){
    // Extracting the text of the todo item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Sending a PUT request to the server to mark the item as complete
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Parsing the response
        const data = await response.json()
        console.log(data)
        // Reloading the page after updating the item status
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// Function to mark a todo item as incomplete
async function markUnComplete(){
    // Extracting the text of the todo item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Sending a PUT request to the server to mark the item as incomplete
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Parsing the response
        const data = await response.json()
        console.log(data)
        // Reloading the page after updating the item status
        location.reload()

    }catch(err){
        console.log(err)
    }
}
