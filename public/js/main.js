const deleteBtn = document.querySelectorAll('.fa-trash') // creating a variable and assigning it to a selection of all elements with a class of the trash can.
const item = document.querySelectorAll('.item span') // creating a variable and assigning it to a selection of span tags inside of a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') // creating a variable and assigning it to a selection of spans with a class of "completed" inside of a parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) // add an event listener to the current item that waits for a click and then calls a function called deleteItem
}) // close our loop

Array.from(item).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete) // add an event.listener that waits for a click and then calls a function called deletItem
})// closes the loop

Array.from(itemCompleted).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) // adding an event listener to an element that waits for a click, and then runs a callback function named "markUnComplete"
})

async function deleteItem(){ //  declaring an asyncronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item to extract the text value ONLY of the specified list item.
    try{ // starting a try block to do something
        const response = await fetch('deleteItem', { // creates a variable that waits on a fetch to get data from a the result of the deleteItem routs.
            method: 'delete', // sets the CRUD method for the routte
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({ // Declare the message content being passed, and stringify that content
              'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on the server to respond with some JSON
        console.log(data) // log the result to the console
        location.reload() // reloads the page to update what is deployed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    }  //close the catch block
} // end the function

async function markComplete(){ // declare an asynchronous function


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    const itemText = this.parentNode.childNodes[1].innerText // reads the inner text, of the 2nd value of childNodes(), that is inside the parentNode, of the _____ object.

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    try{// starting a try block to do something
        const response = await fetch('markComplete', { // creates a response variable that waits for a fetch.
            method: 'put', // setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({// Declare the message content being passed, and stringify that content
                'itemFromJS': itemText// setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })// closing the body
          })// closing the object
        const data = await response.json() // waiting on the server to respond with some JSON
        console.log(data) // log the result to the console
        location.reload() // reloads the page to update what is deployed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    } //close the catch block
} // end the function

async function markUnComplete(){// declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // reads the inner text, of the 2nd value of childNodes(), that is inside the parentNode, of the ______ object.
    try{ // starting a try block to do something
        const response = await fetch('markUnComplete', { // creates a response variable that waits for a fetch.
            method: 'put', // setting the VRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({ // Declare the message content being passed, and stringify that content
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on the server to respond with some JSON
        console.log(data) // log the result to the console
        location.reload() // reloads the page to update what is deployed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    } //close the catch block
} // end the function