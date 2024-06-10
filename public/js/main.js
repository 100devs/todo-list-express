const deleteBtn = document.querySelectorAll('.fa-trash') // selects and stores all elements with fa-trash class in deleteBtn variable
const item = document.querySelectorAll('.item span') // selects span tags inside of a parent that has the class 'item' and stores them in item variable
const itemCompleted = document.querySelectorAll('.item span.completed') // selects span tags with both the class 'completed' and inside of a parent with the class of 'item' and stores them in itemCompleted variable

Array.from(deleteBtn).forEach((element)=>{ // creates array from all elements in deleteBtn variable and begins a forEach loop through them
    element.addEventListener('click', deleteItem) // puts an event listener on each element in loop that runs deleteItem function on click
}) // closes forEach loop

Array.from(item).forEach((element)=>{ // creates array from all elements in item variable and begins a forEach loop through them
    element.addEventListener('click', markComplete) // adds event listener on each element in loop that runs markComplete function on click
}) // closes forEach loop

Array.from(itemCompleted).forEach((element)=>{ // creates array from all elements in itemCompleted variable and begins a forEach loop through them
    element.addEventListener('click', markUnComplete) // adds event listener on each element in loop that runs markUncomplete function on click
}) // closes forEach loop

async function deleteItem(){ // creates asynchronous function to delete items
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of list item and grabs inner text within list span
    try{ // starting a try block
        const response = await fetch('deleteItem', { // creates variable that holds response data that waits on a fetch to get data from the result of deleteItem
            method: 'delete', // sets CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // sets expected content type to JSON
            body: JSON.stringify({ // declares message content being passes and turns it into a string
              'itemFromJS': itemText // setting content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) // closes body
          }) // closes the object
        const data = await response.json() // waiting for JSON from the response to be converted
        console.log(data) // logs result of data variable to console
        location.reload() // reloads the page to update 

    }catch(err){ // ends try block and begins catch block so if an error occurs it's passed in
        console.log(err) // logs error to console
    } // closes catch block
} // ends the function

async function markComplete(){ // creates asynchronous function to mark items as completed
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of list item and grabs inner text within list span
    try{ // starting a try block
        const response = await fetch('markComplete', { // creates variable that holds response data that waits on a fetch to get data from the result of markComplete
            method: 'put', // sets CRUD method to update for the route
            headers: {'Content-Type': 'application/json'}, // sets expected content type to JSON
            body: JSON.stringify({ // declares message content being passes and turns it into a string
                'itemFromJS': itemText // setting content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) // closes body
          }) // closes object
        const data = await response.json() // waiting for JSON from the response to be converted
        console.log(data) // logs result of data variable to console
        location.reload() // reloads page to show update

    }catch(err){ // ends try block and begins catch block so if an error occurs it's passed in
        console.log(err) // logs error to console
    } // closes catch block
} // ends function

async function markUnComplete(){ // creates asynchronous function to mark items as not complete
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of list item and grabs inner text within list span
    try{ // starting a try block
        const response = await fetch('markUnComplete', { // creates variable that holds response data that waits on a fetch to get data from the result of markUnComplete
            method: 'put', // sets CRUD method to update for the route
            headers: {'Content-Type': 'application/json'}, // sets expected content type to JSON
            body: JSON.stringify({ // declares message content being passes and turns it into a string
                'itemFromJS': itemText // setting content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) // closes body
          }) // closes object
        const data = await response.json() // waiting for JSON from the response to be converted
        console.log(data) // logs result of data variable to console
        location.reload() // reloads page to show update

    }catch(err){ // ends try block and begins catch block so if an error occurs it's passed in
        console.log(err) // logs error to the console
    } // closes catch block
} // ends function