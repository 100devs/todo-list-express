const deleteBtn = document.querySelectorAll('.fa-trash') //Define the trashcan icon as our delete button
const item = document.querySelectorAll('.item span') //Define the child span of the item class as the item for purposes of listeners
const itemCompleted = document.querySelectorAll('.item span.completed') //Define a variable associated with the span that has a class of completed within a item class.

Array.from(deleteBtn).forEach((element)=>{ //For each trash can (which is considered a delete button), 
    element.addEventListener('click', deleteItem) //Add a listener that fires deleteItem when clicked.
})

Array.from(item).forEach((element)=>{ //For each task description text,
    element.addEventListener('click', markComplete) //Add a listener that fires markComplete when clicked.
})

Array.from(itemCompleted).forEach((element)=>{ //For each item completed indicator,
    element.addEventListener('click', markUnComplete) //Add a listener that fires markUnComplete when clicked.
})

async function deleteItem(){ //Define a function that deletes an item
    const itemText = this.parentNode.childNodes[1].innerText //select the item that is the next sibling of the current item
    try{
        const response = await fetch('deleteItem', { //Wait for the asynchronous operation to delete an object to complete. A DELETE request is made to URL/deleteItem
            method: 'delete', //The type of request (PUT, POST, DELETE, READ)
            headers: {'Content-Type': 'application/json'}, //The type of request the server should expect
            body: JSON.stringify({ //Format the request in JSON
              'itemFromJS': itemText //Send the inner text of the item to the server under the property "itemFromJS"
            })
          })
        const data = await response.json() //Format the response as JSON and put that into a variable named data.
        console.log(data) //Log the server response in the client's console
        location.reload() //Reload the page, so the updated list of tasks is returned

    }catch(err){ //If there is an error
        console.log(err) //Log the error to the console.
    }
}

async function markComplete(){ //Define a function that marks an item as complete
    const itemText = this.parentNode.childNodes[1].innerText //select the item that is the next sibling of the current item
    try{
        const response = await fetch('markComplete', { //Wait for the asynchronous operation to mark an object as complete to return. A PUT request is made to URL/markComplete.
            method: 'put', //Make a PUT request
            headers: {'Content-Type': 'application/json'}, //Tell the server the request is in JSON format
            body: JSON.stringify({ //Format our request to JSON
                'itemFromJS': itemText //Send the item text in the body of the request
            })
          })
        const data = await response.json() //Format the response as JSON and put that into a variable named data.
        console.log(data) //Log the response to the client's console.
        location.reload() //Reload the page so that the updated item will be displayed.

    }catch(err){ //If there is an error, handle it
        console.log(err) //Output that error to the console.
    }
}

async function markUnComplete(){ //Define a function that removes the complete marking from an item
    const itemText = this.parentNode.childNodes[1].innerText //Find the next sibling of the item, and put that object into the itemText variable
    try{
        const response = await fetch('markUnComplete', { //Wait for the markUnComplete request to complete. The fetch will be sent to URL/markUnComplete.
            method: 'put', //Make the request using a PUT request
            headers: {'Content-Type': 'application/json'}, //Tell the server the request is in JSON format
            body: JSON.stringify({ //Format the request according to JSON syntax
                'itemFromJS': itemText //Send the item text in the body of the request
            })
          })
        const data = await response.json() //Format the response as JSON and put that into a variable named data.
        console.log(data) //Log the response to the client's console.
        location.reload()//Reload the page so that the updated item will be displayed.

    }catch(err){ //If there is an error, handle it
        console.log(err) //Output that error to the console.
    }
}