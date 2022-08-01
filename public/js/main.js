const deleteBtn = document.querySelectorAll(".fa-trash") // creates a variable and assigning it to a selection of all elements with a class of "fa-trash"
const item = document.querySelectorAll(".item span") // creates a variable and assigns it to a selection of all span tags inside of a parent that has a class of item
const itemCompleted = document.querySelectorAll(".item span.completed") // creates a variable and assigns it to a selection of all span tags with a class of completed that are inside a parent with a class of item

Array.from(deleteBtn).forEach(element => {
    // creates an array from our selection that was a node list and starts a loop with forEach
    element.addEventListener("click", deleteItem) // add an event listener to the current item that waits for a click and then calls a function called deleteItem
}) // close our loop

Array.from(item).forEach(element => {
    // creates an array from our selection that was a node list and starts a loop with forEach
    element.addEventListener("click", markComplete) // add an event listener to the current item that waits for a click and then calls a function called markComplete
}) // close our loop

Array.from(itemCompleted).forEach(element => {
    // creates an array from our selection that was a node list and starts a loop with forEach
    element.addEventListener("click", markUnComplete) // add an event listener to only completed items that waits for a click and then calls a function called markUnComplete
}) // close our loop

async function deleteItem() {
    // declaring an asynchronous function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try {
        // starting a try block to do something
        const response = await fetch("deleteItem", {
            // creates a response variable that waits on a fetch to get data from the result of deleteItem route and also starting an object
            method: "delete", // sets the CRUD method for the route
            headers: { "Content-Type": "application/json" }, // specifying the type of content expected, which is json
            body: JSON.stringify({
                // declare the message body being passed, and stringify that content
                itemFromJS: itemText, // setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }), // closing the body
        }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log the result to the console
        location.reload() // reloads the page to update what is displayed
    } catch (err) {
        // if an error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    } // close the catch block
} // end the function

async function markComplete() {
    // declaring an asynchronous function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try {
        // starting a try block to do something
        const response = await fetch("markComplete", {
            // creates a response variable that waits on a fetch to get data from the result of markComplete route and also starting an object
            method: "put", // setting the CRUD method to UPDATE for the route
            headers: { "Content-Type": "application/json" }, // specifying the type of content expected, which is json
            body: JSON.stringify({
                // declare the message body being passed, and stringify that content
                itemFromJS: itemText, // setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }), // closing the body
        }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log the result to the console
        location.reload() // reloads the page to update what is displayed
    } catch (err) {
        // if an error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    } // close the catch block
} // end the function

async function markUnComplete() {
    // declaring an asynchronous function called markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try {
        /// starting a try block to do something
        const response = await fetch("markUnComplete", {
            // creates a response variable that waits on a fetch to get data from the result of markUnComplete route and also starting an object
            method: "put", // setting the CRUD method to UPDATE for the route
            headers: { "Content-Type": "application/json" }, // specifying the type of content expected, which is json
            body: JSON.stringify({
                // declare the message body being passed, and stringify that content
                itemFromJS: itemText, // setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }), // closing the body
        }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log the result to the console
        location.reload() // reloads the page to update what is displayed
    } catch (err) {
        // if an error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    } // close the catch block
} // end the function
