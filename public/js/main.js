const deleteBtn = document.querySelectorAll('.fa-trash') // creating a variable called deleteBtn and assigning it to all elements with the class of 'fa-trash' (the trash can icon)
const item = document.querySelectorAll('.item span') // creating a variable called item and assigning it to all span elements with a parent element that has the class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed') // creating a variable called itemCompleted and assigning it to all spans with the class of 'completed' located inside a parent with a class of 'item'

Array.from(deleteBtn).forEach((element)=>{ // creating an array from our selection and iterating through it
    element.addEventListener ('click', deleteItem) // add an event listener to the current item that waits for a click event; once clicked it runs the function called deleteItem
}) // close the loop

Array.from(item).forEach((element)=>{ // creating an array from our selection and iterating through it
    element.addEventListener('click', markComplete) // add an event listener to the current item that waits for a click event; once clicked it runs the function called markComplete
}) // close the loop

Array.from(itemCompleted).forEach((element)=>{ // creating an array from our selection and iterating through it
    element.addEventListener('click', markUnComplete) // add an event listener to ONLY completed items that waits for a click event; once clicked it runs the function called markUnComplete
}) // close the loop

async function deleteItem(){ // declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // start a try block to do something
        const response = await fetch('deleteItem', { // creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', // sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specifies that the content type we are expecting is JSON
            body: JSON.stringify({ // declare the message content being passed, and stringify that content
              'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log the result to the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    } // close the catch block
} // end the function

async function markComplete(){ // declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // starts a try block to do something
        const response = await fetch('markComplete', { // creates a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', // setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, // specifying that the expected content type is JSON
            body: JSON.stringify({ // declare the message content being passed, and stringify that content
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) // close the body
          }) // close the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log the results to the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) // logs the error to the console
    } // close the catch block
} // end the function

async function markUnComplete(){ // declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // starts a try block to do something
        const response = await fetch('markUnComplete', { // creates a response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put', // setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, // specifying that the expected content type is JSON
            body: JSON.stringify({ // declare the message content being passed, and stringify that content
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) // close the body
          }) // close the object
        const data = await response.json() // waiting on JSON from the response to be converted 
        console.log(data) // log the result to the console
        location.reload() // reload the page to upload what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) // logs the error to the console
    } // close the catch block
} // end the function