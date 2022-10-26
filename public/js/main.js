const deleteBtn = document.querySelectorAll('.fa-trash') // Create deleteBtn variable and assigning it to a selection of all elements with a class of fa-trash 
const item = document.querySelectorAll('.item span') // Create item variable and assigning it to a selection of span tags inside of a parent that has a class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed') // Creating itemCompleted variable and assigning to a selection of spans with a class of 'completed' inside of a parent with a class of 'item'

Array.from(deleteBtn).forEach((element)=>{ // Creating an array from our selection of deleteBtn variable and starting a loop
    element.addEventListener('click', deleteItem) // Adding an event listener to the current looped item, listening for a click. When clicked, calls a function called deleteItem
}) // Close our forEach loop

Array.from(item).forEach((element)=>{ // Creating an array from our selection of item variable and starting a loop
    element.addEventListener('click', markComplete) // Adding an event listener to the current looped item, listening for a click. When clicked, calls a function called markComplete
}) // Closes our forEach loop

Array.from(itemCompleted).forEach((element)=>{ // Creating an array from our selection of itemCompleted variable and starting a loop
    element.addEventListener('click', markUnComplete) // Adding an event listener to ONLY completed items, listening for a click. When clicked, calls a function called markUncomplete
}) // Closes our forEach loop

async function deleteItem(){ // Declare an asynchronous function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside the list item and grabs only the innerText within the list span
    try{ // Declaring a try block to do something
        const response = await fetch('deleteItem', { // Creates a response variable that awaits for a fetch to get data from the result of the deleteItem route
            method: 'delete', // Sets the CRUD method for the route to be delete
            headers: {'Content-Type': 'application/json'}, // Specifying the type of content expected, which is JSON
            body: JSON.stringify({ // Declare the message content being passed, and stringify that content 
              'itemFromJS': itemText // Setting the content of the body to the innerText of the list item ('itemText' variable) and naming it 'itemFromJS'
            }) // Closing the body
          }) // Closing the object
        const data = await response.json() // Waiting to get JSON data back from server/response to be converted and assigned it to variable 'data'
        console.log(data) // Log the data to the console
        location.reload() // Reloads the page to update what is displayed (GET request)

    }catch(err){ // If an error occurs, pass the error into the declared catch block
        console.log(err) // Log the error to the console
    } // Close catch block
} // End the asynchronous function

async function markComplete(){ // Declare an aynchrnous function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside the list item and grabs only the innerText within the list span
    try{ // Declaring a try block to do something
        const response = await fetch('markComplete', { //Creates a response variable that awaits for a fetch to get data from the result of the markComplete route
            method: 'put', //// Sets the CRUD method for the route to be PUT (update)
            headers: {'Content-Type': 'application/json'}, // Specifying the type of content expected, which is JSON
            body: JSON.stringify({ // Declare the message content being passed, and stringify that content 
                'itemFromJS': itemText // Setting the content of the body to the innerText of the list item ('itemText' variable) and naming it 'itemFromJS'
            }) // Closing the body
          }) // Closing the object
        const data = await response.json() // Waiting to get JSON data back from server/response to be converted and assigned it to variable 'data'
        console.log(data) // Log the data to the console
        location.reload() // Reloads the page to update what is displayed (GET request)

    }catch(err){ // If an error occurs, pass the error into the declared catch block
        console.log(err) // Log the error to the console
    } // Close catch block
} // End the asynchronous function

async function markUnComplete(){ // Declare an aynchrnous function called markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside the list item and grabs only the innerText within the list span
    try{ // Declaring a try block to do something
        const response = await fetch('markUnComplete', { //Creates a response variable that awaits for a fetch to get data from the result of the markUnComplete route
            method: 'put', // Sets the CRUD method for the route to be PUT (update)
            headers: {'Content-Type': 'application/json'}, // Specifying the type of content expected, which is JSON
            body: JSON.stringify({ // Declare the message content being passed, and stringify that content 
                'itemFromJS': itemText // Setting the content of the body to the innerText of the list item ('itemText' variable) and naming it 'itemFromJS'
            }) // Closing the body
          }) // Closing the object
        const data = await response.json() // Waiting to get JSON data back from server/response to be converted and assigned it to variable 'data'
        console.log(data) // Log the data to the console
        location.reload() // Reloads the page to update what is displayed (GET request)

    }catch(err){ // If an error occurs, pass the error into the declared catch block
        console.log(err) // Log the error to the console
    } // Close catch block
} // End the asynchronous function