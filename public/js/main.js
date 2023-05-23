const deleteBtn = document.querySelectorAll('.fa-trash')                    // Variable assigned to items of the class fa-trash
const item = document.querySelectorAll('.item span')                        // Variable assigned to all spans inside of a parent with the item class
const itemCompleted = document.querySelectorAll('.item span.completed')     // Variable assigned to all spans with the class completed inside of a parent with the item class

Array.from(deleteBtn).forEach((element)=>{                                  // Creates an array and begins a loop
    element.addEventListener('click', deleteItem)                           // Adds an event listener to the current item that waits for a click and runs the function deleteItem
})

Array.from(item).forEach((element)=>{                                       // Creates an array and begins a loop
    element.addEventListener('click', markComplete)                         // Adds an event listener to the current item that waits for a click and runs the function markComplete
})

Array.from(itemCompleted).forEach((element)=>{                              // Creates an array and begins a loop
    element.addEventListener('click', markUnComplete)                       // Adds an event listener to the current item that waits for a click and runs the function markUnComplete
})

async function deleteItem(){                                                // Declares an asyncronous function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText                // Variable that looks inside of the list item and takes the text
    try{                                                                    // Try block
        const response = await fetch('deleteItem', {                        // Variable that waits on a fetch to get data from the result of deleteItem
            method: 'delete',                                               // Specifies CRUD method to be delete
            headers: {'Content-Type': 'application/json'},                  // Specifies document type header
            body: JSON.stringify({                                          // Sets the value of the body property to stringify the message content being passed
              'itemFromJS': itemText                                        // Sets the content type of the body to the inner text of the list item
            })
          })
        const data = await response.json()                                  // Variable that is the response
        console.log(data)                                                   // Logs the response to the console
        location.reload()                                                   // Reloads the page (to show the changes)

    }catch(err){                                                            // Catch block for errors
        console.log(err)                                                    // Logs error to the console
    }
}

async function markComplete(){                                              // Declares an asyncronous function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText                // Variable that looks inside of the list item and takes the text
    try{                                                                    // Try block
        const response = await fetch('markComplete', {                      // Variable that waits on a fetch to get data from the result of markComplete
            method: 'put',                                                  // Specifies CRUD method to be put
            headers: {'Content-Type': 'application/json'},                  // Specifies document type header
            body: JSON.stringify({                                          // Sets the value of the body property to stringify the message content being passed
                'itemFromJS': itemText                                      // Sets the content type of the body to the inner text of the list item
            })
          })
        const data = await response.json()                                  // Variable that is the response
        console.log(data)                                                   // Logs the response to the console
        location.reload()                                                   // Reloads the page (to show the changes)

    }catch(err){                                                            // Catch block for errors
        console.log(err)                                                    // Logs error to the console
    }
}

async function markUnComplete(){                                            // Declares an asyncronous function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText                // Variable that looks inside of the list item and takes the text
    try{                                                                    // Try block
        const response = await fetch('markUnComplete', {                    // Variable that waits on a fetch to get data from the result of markUnComplete
            method: 'put',                                                  // Specifies CRUD method to be put
            headers: {'Content-Type': 'application/json'},                  // Specifies document type header
            body: JSON.stringify({                                          // Sets the value of the body property to stringify the message content being passed
                'itemFromJS': itemText                                      // Sets the content type of the body to the inner text of the list item
            })
          })
        const data = await response.json()                                  // Variable that is the response
        console.log(data)                                                   // Logs the response to the console
        location.reload()                                                   // Reloads the page (to show the changes)

    }catch(err){                                                            // Catch block for errors
        console.log(err)                                                    // Logs error to the console
    }
}