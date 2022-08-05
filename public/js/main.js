const deleteBtn = document.querySelectorAll('.fa-trash') // creating a variable and assigning it to a selction of all elements with a class of fa-trash (trash can icon) 
const item = document.querySelectorAll('.item span') // creating a variable and assigning it to a selection of all spans within a parent with a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') // creating a variable and assigning it to a selction of spans with a class of "completed" inside of a parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) // add an event listener to the current item that waits for a click, then runs the deleteItem function
}) // close the loop

Array.from(item).forEach((element)=>{ // creating an array from our selection and starting a loop 
    element.addEventListener('click', markComplete) // add an event listener to the current item that waits for a click, then runs the markComplete function
}) // close the loop

Array.from(itemCompleted).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) // adds an event listener to only completed items that waits for a click, then runs the markUnComplete funcion
}) // close the loop

async function deleteItem(){ // declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside the list item and grabs only the inner text within the list span
    try{ // starting a try block to do something
        const response = await fetch('deleteItem', { // creates a response variable that waits on a fetch to get data from the result of the deleteItem route, starting an object
            method: 'delete', // sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed, and put that content into a string, making a new object
              'itemFromJS': itemText // setting the content of the body as to the inner text of the list item and naming it "itemFromJS"
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log the data to the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) // log the error into the console
    } // close the catch block
} // end the function

async function markComplete(){ // declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside the list item and grabs only the inner text within the list span
    try{ // starting a try block to do something
        const response = await fetch('markComplete', { // creates a response variable that waits on a fetch to get data from the result of the markComplete route, starting an object
            method: 'put', // sets the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed, and put that content into a string, making a new object
                'itemFromJS': itemText // setting the content of the body as to the inner text of the list item and naming it "itemFromJS"
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log the data to the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) // log the error into the console
    } // close the catch block
} // end the function

async function markUnComplete(){ // declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside the list item and grabs only the inner text within the list span
    try{ // starting a try block to do something
        const response = await fetch('markUnComplete', { // creates a response variable that waits on a fetch to get data from the result of the markUnComplete route, starting an object
            method: 'put', // sets the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed, and put that content into a string, making a new object
                'itemFromJS': itemText // setting the content of the body as to the inner text of the list item and naming it "itemFromJS"
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log the data to the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) // log the error into the console
    } // close the catch block
} // end the function