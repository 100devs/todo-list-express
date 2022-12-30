// Stores all of the trash cans under the variable
const deleteBtn = document.querySelectorAll('.fa-trash')
// Stores all of the spans within the item class under the variable
const item = document.querySelectorAll('.item span')
// Stores all completed spans under the item class within the variable.
const itemCompleted = document.querySelectorAll('.item span.completed')

// Loops through the trash can elements assigned above and adds an event listener.
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Loops through the uncompleted spans assigned above and adds an event listener.
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// Loops through the completed spans assigned above and adds an event listener.
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Takes the text from the corresponding todo.
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Makes a fetch request to the server with the route of delete item.
        const response = await fetch('deleteItem', {
            // Makes a delete request
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            // Sends request body telling our API which item to delete.
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          // Wait for a response in JSON, console log the data and refresh the page which triggers a get request.
        const data = await response.json()
        console.log(data)
        location.reload()
// Error notification
    }catch(err){
        console.log(err)
    }
}

// Takes the text from the corresponding todo
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Makes a fetch request to the server.
        const response = await fetch('markComplete', {
            // Put / update request
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            // Sends item text within the request body. This tells our API which item to update.
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          // Wait for the response in JSON. Console log the response and refresh the page.
        const data = await response.json()
        console.log(data)
        location.reload()

// error notification
    }catch(err){
        console.log(err)
    }
}

// Takes the text from the corresponding todo
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
         // Makes a fetch request to the server.
        const response = await fetch('markUnComplete', {
             // Put / update request
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            // Sends item text within the request body. This tells our API which item to update.
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          // Wait for the response in JSON. Console log the response and refresh the page.
        const data = await response.json()
        console.log(data)
        location.reload()

        // Error notification
    }catch(err){
        console.log(err)
    }
}