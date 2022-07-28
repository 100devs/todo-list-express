const deleteBtn = document.querySelectorAll('.fa-trash') // Selecting all the .fa-trash items and creating a constant variable and storing them in the deleteBtn //
const item = document.querySelectorAll('.item span') // Creating a const variable and assigning it to a selection of span tags inside of a parent that has the class of "items" 
const itemCompleted = document.querySelectorAll('.item span.completed') // Creating a const variable and assigning it to a selection of spans with a class of "completed" inside of a parent with class of "item" 

Array.from(deleteBtn).forEach((element)=>{ // Creating an array from our selection and starting a loop 
    element.addEventListener('click', deleteItem) // Adding an event listener to the current item that waits for a click and then calls a function called "deleteItem"
}) // Close out loop

Array.from(item).forEach((element)=>{ // Creating an array from our selection and starting loop
    element.addEventListener('click', markComplete) //Add an eventlistener to the current item that waits for a click and then calls a function called markComplete
}) // Close our loop

Array.from(itemCompleted).forEach((element)=>{ // Creating an array from our selection and starting loop
    element.addEventListener('click', markUnComplete) // Adds an event listener to only completed items
}) // Close our loop

async function deleteItem(){  // Declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside of the list item and grabs only the inner text within the list span 
    try{ // Declaring a try block (opposite of catch block) and if an error is thown, the catch block can try something else
        const response = await fetch('deleteItem', { // Create a const variable called "response" that waits on a fetch to get data from the result of the deleteItem route 
            method: 'delete', // Sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //Specifying the type of content expected, which is JSON
            body: JSON.stringify({ // Declare the message content and turn it into a string
              'itemFromJS': itemText // Setting the content of the body to the innerText of the list item and naming it itemFromJS
            }) // Closing the body
          }) // Closing the object
        const data = await response.json() //Waiting on Json from the response to be converted
        console.log(data) // Log the result to the console
        location.reload() //reloads the page to update what is displayed 

    }catch(err){ // If an error occurs, pass the error into the catch block
        console.log(err) // Log the error to the console
    } // Close the catch block
} // End the function

async function markComplete(){ // Declare an Asyncronous function
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside the list item and grab only the inner text within the list span.
    try{ // Starting a try block to do something
        const response = await fetch('markComplete', { // Creates a response variable that waits on a fetch to get data from the result of the markUncomplete route
            method: 'put', // Setting the CRUD method to "update" for the route 
            headers: {'Content-Type': 'application/json'}, // Specifying the type of content expected, which is JSON
            body: JSON.stringify({ // Declare the message content being passed, and stringify that content 
                'itemFromJS': itemText // Setting the content of the body to the inner text of the list item, and naming them
            }) //Closing the Body
          }) //Closing the object
        const data = await response.json() //Waiting on Json from the response to be converted
        console.log(data) // Log the result to the console
        location.reload() //reloads the page to update what is displayed 

    }catch(err){ // If an error occurs, pass the error into the catch block
        console.log(err) // Log the error to the console
    } // Close the catch block
} // End the function

async function markUnComplete(){ // Declare an Asyncronous function
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside the list item and grab only the inner text within the list span.
    try{ // Starting a try block to do something
        const response = await fetch('markUnComplete', { // Creates a response variable that waits on a fetch to get data from the result of the markUncomplete route
            method: 'put',  // Setting the CRUD method to "update" for the route 
            headers: {'Content-Type': 'application/json'}, // Specifying the type of content expected, which is JSON
            body: JSON.stringify({  // Declare the message content being passed, and stringify that content 
                'itemFromJS': itemText // Setting the content of the body to the inner text of the list item, and naming them
            })//Closing the Body
        }) //Closing the object
        const data = await response.json() //Waiting on Json from the response to be converted
        console.log(data) // Log the result to the console
        location.reload() //reloads the page to update what is displayed 

    }catch(err){ // If an error occurs, pass the error into the catch block
        console.log(err) // Log the error to the console
    } // Close the catch block
} // End the function