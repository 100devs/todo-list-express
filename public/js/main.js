// Creates Node List of all delete buttons
const deleteBtn = document.querySelectorAll('.fa-trash')
// Creates Node List of all to-do items
const item = document.querySelectorAll('.item span')
// Creates Node List of all to-do items that are completed
const itemCompleted = document.querySelectorAll('.item span.completed')

// Adds an event listener to each element in deleteBtn, to run deleteItem when clicked
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Adds an event listener to each element in item, to run markComplete when clicked
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// Adds an event listener to each element in itemCompleted, to run markUnComplete when clicked
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Async function that deletes a to-do list item
async function deleteItem(){
    // Grabs the identifying text for the list item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // A fetch request is sent to the server with the deleteItem route and delete method, passing in the needed identifying info
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // Server response is converted to JSON
        const data = await response.json()
        // Console logging the data that was responded
        console.log(data)
        // Reloads the webpage, presumably no longer containing the deleted item
        location.reload()

    }catch(err){
        // Any errors that arose during try block are console logged
        console.log(err)
    }
}

async function markComplete(){
    // Grabs the identifying text for the list item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // A fetch request is sent to the server with the markComplete route and put method, passing in the needed identifying info
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Server response is converted to JSON
        const data = await response.json()
        // Console logging the data that was responded
        console.log(data)
        // Reloads the webpage, presumably with the relevant item being marked as complete
        location.reload()

    }catch(err){
        // Any errors that arose during try block are console logged
        console.log(err)
    }
}

async function markUnComplete(){
    // Grabs the identifying text for the list item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // A fetch request is sent to the server with the markUnComplete route and put method, passing in the needed identifying info
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Server response is converted to JSON
        const data = await response.json()
        // Console logging the data that was responded
        console.log(data)
        // Reloads the webpage, presumably with the relevant item being marked as uncomplete
        location.reload()

    }catch(err){
        // Any errors that arose during try block are console logged
        console.log(err)
    }
}