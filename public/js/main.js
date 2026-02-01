const deleteBtn = document.querySelectorAll('.fa-trash') // creates a constant variable and assigns it to a selection of all elements with the class of "fa-trash"
const item = document.querySelectorAll('.item span') // creating a constant variable and assigning it to the selection of all span tags inside a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') // creating a constant variable and assigning it to the selection of spans with a class of "completed" inside of a parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{ // create an array from all delete elements and loop over the array
    element.addEventListener('click', deleteItem) // on current item add an event listener to listen for a click, once clicked it calls a deleteItem function
}) // closes the loop

Array.from(item).forEach((element)=>{ // creates an array from every span element
    element.addEventListener('click', markComplete) // adds an event listener that listens for a click and calls markComplete function
}) // closes the loop

Array.from(itemCompleted).forEach((element)=>{ // creates an array from every completed item and starts a loop
    element.addEventListener('click', markUnComplete) // adds an event listener that listens for a click and calls a markUncomplete function
}) // closes the loop

async function deleteItem(){ // declares an asynchronous function, to wait for responses to arrive while allowing other code to run
    const itemText = this.parentNode.childNodes[1].innerText // declares and looks inside the list item to extract the text value only within the list span
    try{ // declares a try block to do something
        const response = await fetch('deleteItem', { // creates a response variable that waits on fetch to receive data from the result of the deleteItem route
            method: 'delete', // declares a CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specifies the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed and stringify that content
              'itemFromJS': itemText // setting the content of the body to the inner text of the list item and naming it "itemFromJS"
            }) // closing the body 
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log the data to the console
        location.reload() // reloads the page to update what's displayed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) // log the error into the console
    } // close the catch block 
} // end the function
 
async function markComplete(){ // declares an async function 
    const itemText = this.parentNode.childNodes[1].innerText // declares and looks inside the list item to extract the text value only within the list span
    try { // declares a try block to do something
        const response = await fetch('markComplete', { // creates a response variable that waits on fetch to receive data from the result of the markComplete route
            method: 'put', // setting the CRUD method to update for the route
            headers: { 'Content-Type': 'application/json' }, // specifies the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed and stringify that content
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item and naming it "itemFromJS"
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log the data to the console
        location.reload() // reloads the page to update what's displayed

    } catch (err) { // if an error occurs, pass the error into the catch block
        console.log(err) // log the error into the console
    } // close the catch block 
} // end the function

async function markUnComplete() { // declares an async function 
    const itemText = this.parentNode.childNodes[1].innerText // declares and looks inside the list item to extract the text value only within the list span
    try { // declares a try block to do something
        const response = await fetch('markUnComplete', { // creates a response variable that waits on fetch to receive data from the result of the markUnComplete route
            method: 'put', // setting the CRUD method to "update" for the route
            headers: { 'Content-Type': 'application/json' }, // specifies the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed and stringify that content
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item and naming it "itemFromJS"
            }) // closing the body
        }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log the data to the console
        location.reload() // reloads the page to update what's displayed

    } catch (err) { // if an error occurs, pass the error into the catch block
        console.log(err) // log the error into the console
    } // close the catch block 
} // end the function
