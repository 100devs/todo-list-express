const deleteBtn = document.querySelectorAll('.fa-trash') // Creates a variable and assigns it to all items of  the fa-trash class
const item = document.querySelectorAll('.item span') // creates a variable and assigns it to all spans inside of a parent with the item class
const itemCompleted = document.querySelectorAll('.item span.completed') // creates a variable and assigns it to all spans with a class 'completed inside of a parent with the class 'item'

Array.from(deleteBtn).forEach((element)=>{ // Creating an array and starting a loop
    element.addEventListener('click', deleteItem) // adding an event listener to the current item that waits for a click and runs the function 'deleteItem'
}) // closes loop

Array.from(item).forEach((element)=>{ // Creating an array and starting a loop and selecting a span with the class of 'item'
    element.addEventListener('click', markComplete) // adds an event listener to the current item that waits for a click and runs the function 'markComplete'
}) // closes loop

Array.from(itemCompleted).forEach((element)=>{ // Creating an array and starting a loop 
    element.addEventListener('click', markUnComplete) // adds an event listener only to completed items
}) // closes loop

async function deleteItem(){ // declares an asynchronous function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only
    // the inner text within the span. 
    try{ // startng a try block which pais with a catch block to catch any errors
        const response = await fetch('deleteItem', { // creates a response variable that waits on a fetch
            // to grab data from the result of the 'deleteItem' route
            method: 'delete', // sets the CRUD method for the route (delete in this case)
            headers: {'Content-Type': 'application/json'}, // specifies the document type (JSON in this case)
            body: JSON.stringify({ // stringify the message content being passed
              'itemFromJS': itemText // setting the content of the body to the inner text of the list item
              // and naming it 'itemFromJS'
            }) // closes the body
          }) // closes the object
        const data = await response.json() // Waiting on JSON from the response to be converted
        console.log(data) // console logs the response
        location.reload() // Tells the client to reload the page to update what is displayed after changes

    }catch(err){ // catch block to catch any potential errors
        console.log(err) // console logs error
    } // closes catch block
}// closes async function

async function markComplete(){ // declares an asynchronous function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside of the list item and grabs only the inner text
    // inside of the span
    try{ // starts a try block
        const response = await fetch('markComplete', { // creates a response variable that waits on a fetch
            // to grab data from the result of the 'markComplete' route
            method: 'put', // sets the CRUD method for the route (put in this case)
            headers: {'Content-Type': 'application/json'}, // specifies the document type (JSON)
            body: JSON.stringify({ // stringify the content being passed
                'itemFromJS': itemText // sets the content of the body to the inner text of the list item and names it 'itemFromJS'
            }) // closes body
          }) // closes object
        const data = await response.json() // waiting on JSON from the response to be displayed
        console.log(data) // console logs the response
        location.reload() // tells the client to reload the page to update what is displayed after changes

    }catch(err){ // catch block to catch any potential errors
        console.log(err) // console logs error
    } // closes catch block
} // closes async function

async function markUnComplete(){ // declares an asynchronous function called markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text of the span
    try{ // starts a try block
        const response = await fetch('markUnComplete', { // creates a response variable that waits on a fetch
            // to grab data from the result of the 'markUnComplete' route
            method: 'put', // sets the CRUD method for the route (put in this case)
            headers: {'Content-Type': 'application/json'}, // specifies the document type (JSON)
            body: JSON.stringify({ // stringify the content being displayed
                'itemFromJS': itemText // sets the content of the body to the inner text of the list item and names it 'itemFromJS'
            }) // closes body
          }) // closes object
        const data = await response.json() // waiting on JSON from the response to be displayed
        console.log(data) // console logs response
        location.reload() // tells the client to reload the page to update what is displayed after changes

    }catch(err){ // catch block to catch any potential errors
        console.log(err) // console logs error
    } // closes catch block
} // closes async function