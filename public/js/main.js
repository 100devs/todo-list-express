const deleteBtn = document.querySelectorAll('.fa-trash') // Create a variable and assign it to a selection of all elements with a class of "fa-trash"
const item = document.querySelectorAll('.item span')  // Create a variable and assign it to a selection of all spans within a parent element with a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed')  // Create a variable and assign it to a selection of all spans with a class of "completed" within a parent element with a class of "item"

Array.from(deleteBtn).forEach((element)=>{  // Create an array from our "deleteBtn" selection and starts a loop
    element.addEventListener('click', deleteItem)  // Add an onclick event listener to the current item and calls the function "deleteItem"
}) // Closes the loop

Array.from(item).forEach((element)=>{ // Create an array from our "item" selection and starts a loop
    element.addEventListener('click', markComplete) // Add an onclick event listener to the current item and calls the function "markComplete"
}) // Closes the loop

Array.from(itemCompleted).forEach((element)=>{ // Create an array from our "itemCompleted" selection and starts a loop
    element.addEventListener('click', markUnComplete)  // Add an onclick event listener to the current item and calls the function "markUnComplete"
}) // Closes the loop

async function deleteItem(){ // Declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside the list item and grabs only the inner text within the list span.
    try{ // Start a try block to do something
        const response = await fetch('deleteItem', { // Create a response variable that waits on a fetch to get data from the result of "deleteItem"
            method: 'delete', // Set the CRUD method to delete for the route
            headers: {'Content-Type': 'application/json'}, // Specifying the type of content expected, which is JSON
            body: JSON.stringify({ // Declare the message content being passed, and stringify that content
              'itemFromJS': itemText // Set the content of the body to the inner text of the list item, and naming it "itemFromJS"
            }) // Close stringify method
          }) // Close the object
        const data = await response.json() // Wait for JSON from the response to be converted
        console.log(data) // Log the result to the console
        location.reload() // Refresh the page to update what is displayed

    }catch(err){ // Close the try block and start a catch block to handle any errors
        console.log(err) // Log the error to the console
    } // Close the catch block
} // Close deleteItem function

async function markComplete(){ // Declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside the list item and grabs only the inner text within the list span.
    try{ // Start a try block to do something
        const response = await fetch('markComplete', { // Create a response variable that waits on a fetch to get data from the result of "markComplete"
            method: 'put', // Set the CRUD method to update for the route
            headers: {'Content-Type': 'application/json'}, // Specifying the type of content expected, which is JSON
            body: JSON.stringify({ // Declare the message content being passed, and stringify the content
                'itemFromJS': itemText // Set the content of the body to the inner text of the list item, and naming it "itemFromJS"
            }) //  Close stringify method
          }) // Close the object
        const data = await response.json() // Wait for JSON from the response to be converted
        console.log(data) // Log the result to the console
        location.reload() // Refresh the page to update what is displayed

    }catch(err){ // Close the try block and start a catch block to handle any errors
        console.log(err) // Log the error to the console
    } // Close the catch block
} // Close markComplete function

async function markUnComplete(){ // Declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside the list item and grabs only the inner text within the list span.
    try{ // Start a try block to do something
        const response = await fetch('markUnComplete', { // Create a response variable that waits on a fetch to get data from the result of "markUnComplete"
            method: 'put', // Set the CRUD method to update for the route
            headers: {'Content-Type': 'application/json'}, // Specifying the type of content expected, which is JSON
            body: JSON.stringify({ // Declare the message content being passed, and stringify the content
                'itemFromJS': itemText // Set the content of the body to the inner text of the list item, and namign it "itemFromJS"
            }) // Close stringify method
          }) // Close the object
        const data = await response.json() // Wait for JSON from the response to be converted
        console.log(data) // Log the result to the console
        location.reload() // Refresh the page to update what is displayed

    }catch(err){ // Close the try block and start a catch block to handle any errors
        console.log(err) // Log the error to the console
    } // Close the catch block
} // Close markUnComplete function
