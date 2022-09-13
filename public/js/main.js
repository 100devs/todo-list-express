const deleteBtn = document.querySelectorAll('.fa-trash') // defines deletBtn varible that selects all elements in html with "fa-trash" class
const item = document.querySelectorAll('.item span') // defines item variable that selects all html elements that are spans with "item" class
const itemCompleted = document.querySelectorAll('.item span.completed') // defines itemCompleted varible to select spans with "completed" class with parent class of "item"

// creates an array from selection and adds eventListener to run deleteItem function for deleting items on click
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// creates an array from selection and adds eventListener to run markComplete function to update items on click
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// creates an array from selection and adds eventListener to run markUnComplete function to update items on click
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){ // declares an asynchronous function named deleteItem
    const itemText = this.parentNode.childNodes[1].innerText // defines itemText variable to store the text value in specified list item
    try{ // start of try block
        const response = await fetch('deleteItem', { // defines a variable to await a response from a fetch request to the server on the deleteItem route
            method: 'delete', // sets the CRUD method for the route to delete
            headers: {'Content-Type': 'application/json'}, // specifies type of content expected to be returned as JSON
            body: JSON.stringify({ // turns body of response to a string
              'itemFromJS': itemText // sets content of the body to innertext of list item and names it "itemFromJS"
            }) // closing for body
          }) // closing for fetch request
        const data = await response.json() // defines data variable to store converted response body
        console.log(data) // console logs data object
        location.reload() // refreshes the page

    }catch(err){ // start of catch block for handling errors
        console.log(err) // logs the error message to the console
    } // closing brace for catch block
} // closing brace for deleteItem function

async function markComplete(){ // declares an asynchronous function named markComplete
    const itemText = this.parentNode.childNodes[1].innerText // defines itemText variable to store the text value in specified list item
    try{ // start of try block
        const response = await fetch('markComplete', { // defines a variable to await a response from a fetch request to the server on the markComplete route
            method: 'put', // sets the CRUD method for the route to update
            headers: {'Content-Type': 'application/json'}, // specifies type of content expected to be returned as JSON
            body: JSON.stringify({ // turns body of response to a string
                'itemFromJS': itemText // sets content of the body to innertext of list item and names it "itemFromJS"
            }) // closing for body
          }) // closing for fetch request
        const data = await response.json() // defines data variable to store converted response body
        console.log(data) // console logs data object
        location.reload() // refreshes the page

    }catch(err){ // start of catch block for handling errors
        console.log(err) // logs the error message to the console
    } // closing brace for catch block
} // closing brace for deleteItem function

async function markUnComplete(){ // declares an asynchronous function named markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText // defines itemText variable to store the text value in specified list item
    try{ // start of try block
        const response = await fetch('markUnComplete', { // defines a variable to await a response from a fetch request to the server on the markUnComplete route
            method: 'put', // sets the CRUD method for the route to update
            headers: {'Content-Type': 'application/json'}, // specifies type of content expected to be returned as JSON
            body: JSON.stringify({ // turns body of response to a string
                'itemFromJS': itemText // sets content of the body to innertext of list item and names it "itemFromJS"
            }) // closing for body
          }) // closing for fetch request
        const data = await response.json() // defines data variable to store converted response body
        console.log(data) // console logs data object
        location.reload() // refreshes the page

    }catch(err){ // start of catch block for handling errors
        console.log(err) // logs the error message to the console
    } // closing brace for catch block
} // closing brace for deleteItem function
