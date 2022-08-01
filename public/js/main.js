const deleteBtn = document.querySelectorAll('.fa-trash') // Creating a variable and selecting all elements with a class of the trash can
const item = document.querySelectorAll('.item span') // Creating a variable and assigning it to a selection of a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') // // Creating a variable and assigning it to a selection of spans with a class of "completed" inside of a parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{ // Creating an array from our selection and starting a loop 
    element.addEventListener('click', deleteItem) // Add an even lsitener to the current item that waits for a click and then calls a function called deleteItem
}) // Closing the loop 

Array.from(item).forEach((element)=>{ // Creating an array from our selection and starting a loop 
    element.addEventListener('click', markComplete) // Add an even lsitener to the current item that waits for a click and then calls a function called markComplete
}) // Closing the loop

Array.from(itemCompleted).forEach((element)=>{ // Creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) // Add an event listener to only completed items
})

async function deleteItem(){ // Declaring an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText // looks inside fo the list item and grabs only the inner text within the span 
    try{ // Starting a try block to do somthing  
        const response = await fetch('deleteItem', { // Creates a response variable that wait on a fetch to get data from the result of the deleteitem route
            method: 'delete', // Set the CRUD method for the route 
            headers: {'Content-Type': 'application/json'}, // Specify the type of content expected, which is Json 
            body: JSON.stringify({ // Declare the message content being passed, and stringify that content 
              'itemFromJS': itemText // setting the content of the body to the inner text of the list item and naming it itemFromJS
            }) // closing the body 
          })// closing the object 
        const data = await response.json() // Waiting on json response from the server to be converted
        console.log(data) // Print the result to the console
        location.reload() // Reloads the page to update what is displayed 

    }catch(err){ // If an error occurs, pass the error into the catch block
        console.log(err) // Print the error to the console
    } // close the catch block
} // end the function 

async function markComplete(){ // Declaring an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText // looks inside fo the list item and grabs only the inner text within the span
    try{ // Starting a try block to do somthing
        const response = await fetch('markComplete', {  // Creates a response variable that wait on a fetch to get data from the result of the markComplete route
            method: 'put', // setting the CRUD method to update for the route 
            headers: {'Content-Type': 'application/json'},  // Specify the type of content expected, which is Json 
            body: JSON.stringify({ // Declare the message content being passed, and stringify that content
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item and naming it itemFromJS
            })// closing the body 
          }) // closing the object 
        const data = await response.json() // Waiting on json response from the server to be converted
        console.log(data) // Print the result to the console
        location.reload() // Reloads the page to update what is displayed 

    }catch(err){ // If an error occurs, pass the error into the catch block
        console.log(err)  // Print the error to the console
    } // close the catch block
} // end the function 

async function markUnComplete(){ // Declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside fo the list item and grabs only the inner text within the span
    try{ // Starting a try block to do somthing
        const response = await fetch('markUnComplete', { // Creates a response variable that wait on a fetch to get data from the result of the markUnComplete route
            method: 'put', // setting the CRUD method to update for the route 
            headers: {'Content-Type': 'application/json'}, // Specify the type of content expected, which is Json 
            body: JSON.stringify({ // Declare the message content being passed, and stringify that content
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item and naming it itemFromJS
            }) // closing the body
          }) // closing the object 
        const data = await response.json()
        console.log(data) // Print the result to the console
        location.reload() // Reloads the page to update what is displayed 

    }catch(err){ // If an error occurs, pass the error into the catch block
        console.log(err) // Print the error to the console
    } // close the catch block
} // end the function 