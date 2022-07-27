const deleteBtn = document.querySelectorAll('.fa-trash')    // Sets up a DELETE request when something with the class 'fa-trash' is clicked (a little trash can icon)
const item = document.querySelectorAll('.item span')    // Triggers a request when a span element with the class 'item' is clicked
const itemCompleted = document.querySelectorAll('.item span.completed')     // Triggers a PUT request when item is marked as completed

Array.from(deleteBtn).forEach((element)=>{  // Creating an array from the item on the delete line
    element.addEventListener('click', deleteItem)   // When anyone clicks on an element with the class 'fa-trash', will run deleteItem
})

Array.from(item).forEach((element)=>{   // Cycles through each todo list item and...
    element.addEventListener('click', markComplete) // Adds an event listener that, upon click, will run the function to mark the task as completed
})

Array.from(itemCompleted).forEach((element)=>{  // Cycles through each completed todo list item and...
    element.addEventListener('click', markUnComplete)   // Adds an event listener that, upon click, will run the function to mark the task as UNcompleted
})

async function deleteItem(){    // Establishes an asyncronous function, deleteItem
    const itemText = this.parentNode.childNodes[1].innerText    // If we put in a todo item on the front end, it gives a little delete button. Grabs the text of the to do item next to the trash can that's being clicked
    try{    // A try catch, attempt to do this thing, and if you cannot do this thing you're trying, run catch()
        const response = await fetch('deleteItem', {    // Setting up a constant, and since this is an async function, await the fetch response
            method: 'delete',   // By calling fetch 'deleteItem,' deleteItem is a method in which you delete the following
            headers: {'Content-Type': 'application/json'},  // Basically says delete the item text
            body: JSON.stringify({  // Converts js object to a json string
              'itemFromJS': itemText    // denotes the specific todo list item?
            })
          })
        const data = await response.json()  // Await a response
        console.log(data)   // Logs the data in the console
        location.reload()   // Reloads the page

    }catch(err){    // If the try method doesn't succeed, catch all errors
        console.log(err)    // Console log errors
    }
}

async function markComplete(){      // Creates an async function to mark a todo list item as completed
    const itemText = this.parentNode.childNodes[1].innerText    // Takes the text of a todo list item
    try{    // Attempt...
        const response = await fetch('markComplete', {  // to mark it as completed and store the response in variable 'response'
            method: 'put',  // Denotes an update route?
            headers: {'Content-Type': 'application/json'},  // 
            body: JSON.stringify({      // Converts js object to a JSON string
                'itemFromJS': itemText  // Denotes the specific todo list item text taken from the larger list
            })
          })
        const data = await response.json()  // Await a response
        console.log(data)   // Console log the data in the console
        location.reload()   // Reload the page

    }catch(err){    // If method doesn't succeed, catch all errors
        console.log(err)    // Console log those errors
    }
}

async function markUnComplete(){    // Creates an async function for marking a todo list item as 'uncompleted'
    const itemText = this.parentNode.childNodes[1].innerText    // Goes into the todo list db and takes the todo list item in question, stores it in 'itemText'
    try{       // Attempt...
        const response = await fetch('markUnComplete', {    // to mark it as uncompleted and store the response in variable 'response'
            method: 'put',
            headers: {'Content-Type': 'application/json'},  // Applies header format?
            body: JSON.stringify({  // Converts body of js object to JSON string
                'itemFromJS': itemText  // Denotes the specific todo list item
            })
          })
        const data = await response.json()  // Await a response
        console.log(data)   // Console log the data in the console
        location.reload()   // Reload the page

    }catch(err){    // If method unsuccessful, catch all errors...
        console.log(err)    // and console log them
    }
}