const deleteBtn = document.querySelectorAll('.fa-trash') // grab all trash can icons (returns a NodeList)
const item = document.querySelectorAll('.item span') // grab all todo items (returns a NodeList)
const itemCompleted = document.querySelectorAll('.item span.completed') // grab all completed todo items (returns a NodeList)


// convert NodeLists to arrays and add event listeners
Array.from(deleteBtn).forEach((element)=>{ // convert the NodeList of delete buttons to an array
    element.addEventListener('click', deleteItem) // add a click event listener to each delete button that calls deleteItem
})

Array.from(item).forEach((element)=>{ // convert the NodeList of todo items to an array
    element.addEventListener('click', markComplete) // add a click event listener to each todo item that calls markComplete
})

Array.from(itemCompleted).forEach((element)=>{ // convert the NodeList of completed todo items to an array
    element.addEventListener('click', markUnComplete) // add a click event listener to each completed todo item that calls markUnComplete
})


// async functions for handling the different actions
async function deleteItem(){ // event handler to delete a todo
    const itemText = this.parentNode.childNodes[1].innerText // get the text of the todo item
    try{ // try to delete the todo
        const response = await fetch('deleteItem', { // make a request to the server to the /deleteItem route to delete the todo
            method: 'delete', // use the DELETE method
            headers: {'Content-Type': 'application/json'}, // set the content type to JSON
            body: JSON.stringify({ // stringify the data to be sent
              'itemFromJS': itemText // include the todo item text
            })
        })
        const data = await response.json() // parse the response as JSON (get it & transform it)
        console.log(data) // log the response data
        location.reload() // reload the page (refresh)
    }catch(err){ // if there's an error
        console.log(err) // log the error
    }
}

async function markComplete(){ // event handler to mark a todo as complete
    const itemText = this.parentNode.childNodes[1].innerText // get the text of the todo item
    try{ // try to mark the todo as complete
        const response = await fetch('markComplete', { // make a request to the server to the /markComplete route to mark the todo as complete
            method: 'put', // use the PUT method
            headers: {'Content-Type': 'application/json'}, // set the content type to JSON
            body: JSON.stringify({ // stringify the data to be sent
                'itemFromJS': itemText // include the todo item text
            })
        })
        const data = await response.json() // parse the response as JSON (get it & transform it)
        console.log(data) // log the response data
        location.reload() // reload the page (refresh)
    }catch(err){ // if there's an error
        console.log(err) // log the error
    }
}

async function markUnComplete(){ // event handler to mark a todo as incomplete (same as above, but for uncompleting)
    const itemText = this.parentNode.childNodes[1].innerText // get the text of the todo item
    try{ // try to mark the todo as incomplete
        const response = await fetch('markUnComplete', { // make a request to the server to the /markUnComplete route to mark the todo as incomplete
            method: 'put', // use the PUT method
            headers: {'Content-Type': 'application/json'}, // set the content type to JSON
            body: JSON.stringify({ // stringify the data to be sent
                'itemFromJS': itemText // include the todo item text
            })
        })
        const data = await response.json() // parse the response as JSON
        console.log(data) // log the response data
        location.reload() // reload the page (refresh)
    }catch(err){ // if there's an error
        console.log(err) // log the error
    }
}