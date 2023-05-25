const deleteBtn = document.querySelectorAll('.fa-trash') // create variable selecting all elements in index.ejs with fa-trash class
const item = document.querySelectorAll('.item span') // create variable selecting all spans inside an element with item class
const itemCompleted = document.querySelectorAll('.item span.completed') // create variable selecting all spans with completed class inside an element with item class

Array.from(deleteBtn).forEach((element)=>{ // create array from deleteBtn variable (all fa-trash class elements) and iterate through each element in the array
    element.addEventListener('click', deleteItem) // add event listener to each element: when clicked, call deleteItem function
}) // close forEach loop

Array.from(item).forEach((element)=>{ // create array from item class elements and iterate through each element in the array
    element.addEventListener('click', markComplete) // add event listener to each element: when clicked, call markComplete function
}) // close forEach loop

Array.from(itemCompleted).forEach((element)=>{ // create array from itemCompleted elements and iterate through each element in the array
    element.addEventListener('click', markUnComplete) // add event listener to each element: when clicked, call markUnComplete function
}) // close forEach loop

async function deleteItem(){ // create an asynchronous function for deleting items
    const itemText = this.parentNode.childNodes[1].innerText // create variable selecting the text of the first child element in the parent element of what was clicked to call this function
    try{ // start a try block
        const response = await fetch('deleteItem', { // create variable that waits for a fetch via the /deleteItem route to get data from server.js response
            method: 'delete', // set delete method for route
            headers: {'Content-Type': 'application/json'}, // set type of content expected to JSON
            body: JSON.stringify({ // convert body of message to JSON string
              'itemFromJS': itemText // set itemFromJs property to inner text of first child in parent element 
            }) // close body
          }) // close fetch
        const data = await response.json() // create variable that waits for server.js response and converts it to JSON
        console.log(data) // print response to console
        location.reload() // reload page

    }catch(err){ // if there is an error, pass error message to catch block
        console.log(err) // print error message to console
    } // close catch block
} // close deleteItem function

async function markComplete(){ // create asynchronous function for marking items complete
    const itemText = this.parentNode.childNodes[1].innerText // create variable selecting the text of the first child element in the parent element of what was clicked to call this function
    try{ // start a try block
        const response = await fetch('markComplete', { // create variable that waits for a fetch via the /markComplete route to get data from server.js response
            method: 'put', // set put (update) method for route
            headers: {'Content-Type': 'application/json'}, // set type of content expected to JSON
            body: JSON.stringify({ // convert body of message to JSON string
                'itemFromJS': itemText // set itemFromJs property to inner text of first child in parent element 
            }) // close body
          }) // close fetch
        const data = await response.json() // create variable that waits for server.js response and converts it to JSON
        console.log(data) // print response to console
        location.reload() // reload page

    }catch(err){ // if there is an error, pass error message to catch block
        console.log(err) // print error message to console
    } // close catch block
} // close deleteItem function

async function markUnComplete(){ // create asynchronous function for marking items complete
    const itemText = this.parentNode.childNodes[1].innerText // create variable selecting the text of the first child element in the parent element of what was clicked to call this function
    try{ // start a try block
        const response = await fetch('markUnComplete', { // create variable that waits for a fetch via the /markUnComplete route to get data from server.js response
            method: 'put', // set put (update) method for route
            headers: {'Content-Type': 'application/json'}, // set type of content expected to JSON
            body: JSON.stringify({ // convert body of message to JSON string
                'itemFromJS': itemText // set itemFromJs property to inner text of first child in parent element 
            }) // close body
          }) // close fetch
        const data = await response.json() // create variable that waits for server.js response and converts it to JSON
        console.log(data) // print response to console
        location.reload() // reload page

    }catch(err){ // if there is an error, pass error message to catch block
        console.log(err) // print error message to console
    } // close catch block
} // close deleteItem function