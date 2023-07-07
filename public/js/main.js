const deleteBtn = document.querySelectorAll('.fa-trash') // create a variable that hold all elements in index.ejs with fa-trash class
const item = document.querySelectorAll('.item span') // create a variable that hold all span elements inside an element with a class of item in index.ejs
const itemCompleted = document.querySelectorAll('.item span.completed') // create a variable that hold all spans with completed class inside an element with a class of item

Array.from(deleteBtn).forEach((element)=>{ // create an array from deleteBtn variable and iterate though each element and add an event listener to each element
    element.addEventListener('click', deleteItem) // that when clicked it will call the deleteItem function
})

Array.from(item).forEach((element)=>{ // create an array from item variable and iterate though each element and add an event listener to each element
    element.addEventListener('click', markComplete) // that when clicked it will call the markComplete function
})

Array.from(itemCompleted).forEach((element)=>{ // create an array from itemCompleted variable and iterate though each element and add an event listener to each element
    element.addEventListener('click', markUnComplete) // that when clicked it will call the markUnComplete function
})

async function deleteItem(){ // create an asynchronous function for deleting items
    const itemText = this.parentNode.childNodes[1].innerText // create a variable that selects the text of the first child element in the parent element of what was clicked 
    try{ // start a try block
        const response = await fetch('deleteItem', { // create a variable that waits for a fetch via the /deleteItem route to get data from server.js response
            method: 'delete', // set delete method for route
            headers: {'Content-Type': 'application/json'}, // set type of content expected to json
            body: JSON.stringify({ // convert body of message to JSON string
              'itemFromJS': itemText // set itemFromJS property to the itemText variable that hold the text of the first child in the parent element
            })
          })
        const data = await response.json() // create a variable that waits for server.js response and converts it JSON
        console.log(data) // print response to the console
        location.reload() // reload the page 

    }catch(err){ // if there is an error, pass the error message to catch block
        console.log(err) // print error message to the console
    }
}

async function markComplete(){ // create an asynchronous function for marking items complete
    const itemText = this.parentNode.childNodes[1].innerText  // create a variable that selects the text of the first child element in the parent element of what was clicked 
    try{
        const response = await fetch('markComplete', { // create a variable that waits for a fetch via the /markComplete route to get data from server.js response
            method: 'put', // set put method for route
            headers: {'Content-Type': 'application/json'}, // set type of content expected to JSON
            body: JSON.stringify({ // convert body of message to JSON string
                'itemFromJS': itemText // set itemFromJS property to the itemText variable that hold the text of the first child in the parent element
            })
          })
        const data = await response.json() // create a variable that waits for server.js response and converts it JSON
        console.log(data) // print response to the console
        location.reload() // reload the page 

    }catch(err){ // if there is an error, pass the error message to catch block
        console.log(err) // print error message to the console
    }
}

async function markUnComplete(){ // create an asynchronous function for marking items uncomplete
    const itemText = this.parentNode.childNodes[1].innerText // create a variable that selects the text of the first child element in the parent element of what was clicked 
    try{
        const response = await fetch('markUnComplete', { // create a variable that waits for a fetch via the /markUnComplete route to get data from server.js response
            method: 'put', // set put method for route
            headers: {'Content-Type': 'application/json'}, // set type of content expected to JSON
            body: JSON.stringify({  // convert body of message to JSON string
                'itemFromJS': itemText // set itemFromJS property to the itemText variable that hold the text of the first child in the parent element
            })
          })
        const data = await response.json() // create a variable that waits for server.js response and converts it JSON
        console.log(data) // print response to the console
        location.reload() // reload the page 

    }catch(err){ // if there is an error, pass the error message to catch block
        console.log(err) // print error message to the console
    }
}