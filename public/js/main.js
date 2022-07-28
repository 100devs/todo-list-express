const deleteBtn = document.querySelectorAll('.fa-trash') // creates a constant with the name of deleteBtn with the assigned value of selecting all elements with the class of .fa-trash in the ejs file.
const item = document.querySelectorAll('.item span') // creates a constant and assigns a selection of classes named item and span tags.
const itemCompleted = document.querySelectorAll('.item span.completed') // creates a variable and assigns it to a selection of spans with the class of "completed" inside of a parent with a class of "item" 

Array.from(deleteBtn).forEach((element) => { //creates an array from deletebtn and looping through each element
    element.addEventListener('click', deleteItem) //adds an event listener to the current item that waits for a click, and then calls deleteItem function
}) // close our loop

Array.from(item).forEach((element) => { // creates an array from our selection and starting a loop
    element.addEventListener('click', markComplete) //adds an event listener to the current item that waits for a click, and then calls markComplete function
}) //close our loop

Array.from(itemCompleted).forEach((element) => { //creates an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) //adds an event listener to only completed items that waits for a click, and then calls markUncomplete function
}) //close our loop


async function deleteItem() { // declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of th list item an grabs th only inner text within the list span.
    try { // starting a try catch block
        const response = await fetch('deleteItem', { // creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', //sets the CRUD method for the route
            headers: { 'Content-Type': 'application/json' }, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed, and turn content into a string
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it 'itemFromJs'
            }) // closing the body
        }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log the data to the console
        location.reload() // reload the page to update what is displayed

    } catch (err) { // if an error occurs, pass the error into the catch block
        console.log(err) // log error to the console
    } //close the catch block
} // close the function

async function markComplete() { // declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of th list item an grabs th only inner text within the list span.
    try { // starting a try catch block
        const response = await fetch('markComplete', { // creates a response variable that waits on a fetch to get data from the result of the 'markComplete' route
            method: 'put', // setting CRUD method to update for the route
            headers: { 'Content-Type': 'application/json' }, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed, and turn content into a string
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it 'itemFromJs'
            }) //closing the body
        }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log the data to the console
        location.reload() // reload the page to update what is displayed

    } catch (err) { // if an error occurs, pass the error into the catch block
        console.log(err) // log error to the console
    } //close the catch block
} // close the function

async function markUnComplete() { // declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of th list item an grabs th only inner text within the list span.
    try { // starting a try catch block
        const response = await fetch('markUnComplete', { // creates a response variable that waits on a fetch to get data from the result of the 'markUncomplete' route
            method: 'put', // setting CRUD method to update for the route
            headers: { 'Content-Type': 'application/json' }, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed, and turn content into a string
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it 'itemFromJs'
            }) //closing the body
        }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log the data to the console
        location.reload() // reload the page to update what is displayed

    } catch (err) { // log error to the console
        console.log(err) // log error to the console
    } //close the catch block
} // close the function