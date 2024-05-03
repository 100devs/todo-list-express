// Variable of trash can icon
const deleteBtn = document.querySelectorAll('.fa-trash')
// Variable of text of the todo
const item = document.querySelectorAll('.item span')
// Variable of the text of the todo when is completed
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{
    // This creates an array of all the trash cans to add an event listener to each of them to run the delete function when clicked
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    // This creates an array of items (class item span) to add an event listener to each of them to run the markComplete function when clicked
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    // This creates an awway of itemCompleted and adds an event listener to each of them to run the function markUnCompleted when clicked
    element.addEventListener('click', markUnComplete)
})

// Async function to delete a todo from the database
async function deleteItem(){
    // This helps select the specific todo using the DOM
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Fetch the database with a delete method
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            // Data we are converting to string and sending to the database
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // Waiting for the data from the database and converting it to json
        const data = await response.json()
        console.log(data)
        // Refresh browser
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// Async function to mark a todo as completed from the database
async function markComplete(){
    // Using the DOM to access the todo with are clicking and assign it to a variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Sending the put request to the server using Fetch
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            // Data we are sending to our API in the server (the todo selected)
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // We wait for the response from our server and converted from stringify to json
        const data = await response.json()
        console.log(data)
        // Refresh browser
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// Async function to mark a completed todo as uncompleted from the database
async function markUnComplete(){
    // Using the DOM to access the todo with are clicking and assign it to a variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Sending the put request to the server using Fetch
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            // Data we are sending to our API in the server (the todo selected)
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // We wait for the response from our server and converted from stringify to json
        const data = await response.json()
        console.log(data)
        // Refresh browser
        location.reload()

    }catch(err){
        console.log(err)
    }
}