const deleteBtn = document.querySelectorAll('.fa-trash') // creates a variable, deleteBtn, assigns it to the selection of all the items with the class fa-trash
const item = document.querySelectorAll('.item span') // creates a variable, item, assigns it to the selection of all span tags inside elements with class item
const itemCompleted = document.querySelectorAll('.item span.completed') // creates variable itemCompleted and assigns it to all span elements that have the class completed and are inside an element with the class item 

Array.from(deleteBtn).forEach((element)=>{ // creates an array from the deleteBtn variable -that contains multiple trash cans- and loops through each element using a forEach loop
    element.addEventListener('click', deleteItem) // adds an event listener to the current element on the array. It listens to a click event, and when the click occurs the function deleteItem is called
}) // loop close

Array.from(item).forEach((element)=>{ // creates an array from the item variable and loops through each element using a forEach loop
    element.addEventListener('click', markComplete) // adds an event listener to the current element. It waits for a click, and when that click occurs the function markComplete is called
}) // closing of forEach loop

Array.from(itemCompleted).forEach((element)=>{ // creates an array from the itemCompleted variable and sets a forEach loop
    element.addEventListener('click', markUnComplete) // adds an event listener to the current element, waits for the click, when the click occurs the markUnComplete function is called
}) // closing of forEach loop

async function deleteItem(){ // declares asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // declares variable itemText and assigns it to the value of the text contained in the inner span
    try{ // start of a try block
        const response = await fetch('deleteItem', { // creates a response variable that waits on a fetch to get data from the deleteItem route
            method: 'delete', // sets method of delete for the route
            headers: {'Content-Type': 'application/json'}, // specifies the type of content expected
            body: JSON.stringify({ // the body will be stringified into JSON format
              'itemFromJS': itemText // this will be the content of the body, the key itemFromJS will have as a value what was stored in the itemText variable
            }) // body close
          }) // object close
        const data = await response.json() // the variable data waits on the response variable to be converted to JSON
        console.log(data) // logs data into the console
        location.reload() // reload the current page to do get an update on the content of the page

    }catch(err){ // in case an error occurs, catch block is created
        console.log(err) // logs the error to the console
    } // close of catch block
// closes the async deleteItem function
} 

async function markComplete() { // declares asynchronous markComplete function
    const itemText = this.parentNode.childNodes[1].innerText // declares itemText variable and assigns it to a value of the text contained inside the span tag inside the list item 
    try{ // start of a try block
        const response = await fetch('markComplete', { // creates a response variable that waits on a fetch to get data from the markComplete route
            method: 'put', // sets method of update for the route
            headers: {'Content-Type': 'application/json'}, // specifies the type of content expected
            body: JSON.stringify({ // declare the message content being passed, and stringify that content
                'itemFromJS': itemText // sets the key itemFromJS in the body to have the value of the itemText variable
            }) // body close
          }) // object close
        const data = await response.json() // the variable data waits on the response variable to be converted to JSON
        console.log(data) // logs data into the console
        location.reload() // reload the current page

    }catch(err){ // in case an error occurs, catch block is created
        console.log(err) // logs the error to the console
    } // close of the catch block
// closes the async deleteItem function
} 

async function markUnComplete(){ // declares the asynchronous markUnComplete function
    const itemText = this.parentNode.childNodes[1].innerText // declares itemText variable and assigns it to a value of the text contained inside the span tag inside the list item 
    try{ // start of a try block
        const response = await fetch('markUnComplete', { // creates a response variable that waits on a fetch to get data from the markUnComplete route
            method: 'put', // sets method of update for the route
            headers: {'Content-Type': 'application/json'}, // specifies the type of content expected
            body: JSON.stringify({ // declare the message content being passed, and stringify that content
                'itemFromJS': itemText // sets the key itemFrom JS to have the value of the itemText variable
            }) // body close
          }) // object close
        const data = await response.json() // the variable data waits on the response variable to be converted to JSON
        console.log(data) // logs data into the console
        location.reload() // reload the current page

    }catch(err){ // in case an error occurs, catch block is created
        console.log(err) // logs the error to the console
    } // close of the catch block
} // closes the async markUnComplete function