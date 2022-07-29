const deleteBtn = document.querySelectorAll('.fa-trash') // Creating a variable. Anything with the class of .fa-trash will be held in that variable. 
const item = document.querySelectorAll('.item span') // Creating a variable 'item' and assigning it to a selection of a span tags inside of a parent .item
const itemCompleted = document.querySelectorAll('.item span .completed') // creating a variable itemCompleted that is assigned to spans that have a parent with a class of .item, but the span but also have a class of completed

Array.from(deleteBtn).forEach((element)=>{ // creating an array of deleteBtns and starting a loop using forEach
    element.addEventListener('click', deleteItem) // adding an event listener on click, we are going to run the function deleteItem when it's clicked
}) // close our loop

Array.from(item).forEach((element)=>{ // creating an array of items variables and starting a loop using forEach
    element.addEventListener('click', markComplete) // adding an event listener on click, we are going to run the function markComplete when it's clicked
}) // close our loop

Array.from(itemCompleted).forEach((element)=>{ // creating an array of itemCompleted variables and starting a loop using forEach
    element.addEventListener('click', markUnComplete) // adding an event listener on click, we are going to run the function markUnComplete when it's clicked
}) // close our loop

async function deleteItem(){ // declaring an async function deleteItem()
    const itemText = this.parentNode.childNodes[1].innerText // text value only of the specified list item, puts that in a variable
    try{ // starting a try block, tries to run something
        const response = await fetch('deleteItem', { // creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', // setting the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected which is json
            body: JSON.stringify({ // body is the message content we're getting/being passed, and stringify that content (put it into a string)
              'itemFromJS': itemText // setting the content of the body to the innerText of the list item and naming it itemFromJS
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on json from the response
        console.log(data) // logging the data
        location.reload() // reloading the page to update what is displayed

    }catch(err){ // starting a catch block which will handle the error if the try block fails
        console.log(err) // console logging the error 
    } // closing the catch block
} // closing the async function

async function markComplete(){ // declaring an async function markComplete()
    const itemText = this.parentNode.childNodes[1].innerText // text value only of the specified list item, puts that in a variable
    try{ // starts a try block
        const response = await fetch('markComplete', { // creates a response variable that waits on a fetch to get data from the result of markComplete route
            method: 'put', // setting the crud method to UPDATE for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected which is json
            body: JSON.stringify({ // body is the message content we're getting/being passed, and stringify that content (put it into a string)
                'itemFromJS': itemText // setting the content of the body to the innerText of the list item and naming it itemFromJS
            }) // close the body
          }) // close the fetch
        const data = await response.json() // waiting on json from the response
        console.log(data) // console logging the error 
        location.reload() // reloads the page

    }catch(err){ // starts a catch block to catch the error if try block fails
        console.log(err) // console.log error
    } // closing the catch block
} // closing the async function

async function markUnComplete(){ // declaring an async function markUnComplete()
    const itemText = this.parentNode.childNodes[1].innerText // text value only of the specified list item, puts that in a variable
    try{ // starts a try block
        const response = await fetch('markUnComplete', { // creates a response variable that waits on a fetch to get data from the result of markUnComplete route
            method: 'put', // setting the crud method to UPDATE for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected which is json
            body: JSON.stringify({ // body is the message content we're getting/being passed, and stringify that content (put it into a string)
                'itemFromJS': itemText // setting the content of the body to the innerText of the list item and naming it itemFromJS
            }) // close the body
          }) // close the fetch 
        const data = await response.json() // waiting on json from the response
        console.log(data) // console logging the error 
        location.reload() // reloads the page

    }catch(err){ // starts a catch block to catch the error if try block fails
        console.log(err) // console.log error 
    } // closing the catch block
} // closing the async function