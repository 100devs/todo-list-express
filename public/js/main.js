const deleteBtn = document.querySelectorAll('.fa-trash') // selects all elements with 'fa-trash' class, ie. the trash icon, and stores into 'delteBtn'
const item = document.querySelectorAll('.item span') // selects all <span> elements within a parent the class of 'item' and stores them into the 'item'
const itemCompleted = document.querySelectorAll('.item span.completed') // selects all <span> elements with a class of 'completed' that are inside a parent item with class of 'item' and stores into the 'itemCompleted'

Array.from(deleteBtn).forEach((element)=>{ // creates an array from 'deleteBtn' and loops through each element in the array
    element.addEventListener('click', deleteItem) // adds an event listener to each element for 'click' that runs deleteItem()
}) // closes the forEach loop

Array.from(item).forEach((element)=>{ // creates an array from 'item' and loops through each element in the array
    element.addEventListener('click', markComplete) // adds an event listener to each element for 'click' that runs markComplete()
}) // closes the forEach loop

Array.from(itemCompleted).forEach((element)=>{ // creates an array from 'itemCompleted' and loops through each element in the array
    element.addEventListener('click', markUnComplete) // adds an event listener to each element for 'click' that runs markUnComplete()
}) // closes the forEach loop

async function deleteItem(){ // asynchronous function declaration for deleteItem()
    const itemText = this.parentNode.childNodes[1].innerText // selects text that is the 2nd(?) child of the parent element of the trash icon and stores it into the 'itemText' variable
    try{ // starts a try block
        const response = await fetch('deleteItem', { // waits on a fetch to get data from the result of deleteItem and stores it into a 'response' variable; opens an object
            method: 'delete', // sets the method for the route to 'delete'
            headers: {'Content-Type': 'application/json'}, // sets the headers to expect json
            body: JSON.stringify({ // turns into a string the results of the request and sets it to the body property
              'itemFromJS': itemText // sets the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) // close the body code
          }) // close the object and fetch
        const data = await response.json() // waits for a json conversion to the response fetch and stores it into 'data'
        console.log(data) // logs the response to the console
        location.reload() // refreshes the page to show changes

    }catch(err){ // starts the error block, pass error to catch block if error exists
        console.log(err) // log the error to the console
    } // close the catch block
} // close the function

async function markComplete(){ // asynchronous function declaration for markComplete()
    const itemText = this.parentNode.childNodes[1].innerText // selects text that is the 2nd(?) child of the parent element of the trash icon and stores it into the 'itemText' variable
    try{ // starts a try block
        const response = await fetch('markComplete', { // waits on a fetch to get data from the result of markComplete and stores it into a 'response' 
            method: 'put', // sets the method for the route to 'put'
            headers: {'Content-Type': 'application/json'}, // sets the headers to expect json
            body: JSON.stringify({ // turns into a string the results of the request and sets it to the body property
                'itemFromJS': itemText // sets the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) // close the body code
          }) // close the object and fetch
        const data = await response.json() // waits for a json conversion to the response fetch and stores it into 'data'
        console.log(data) // logs the response to the console
        location.reload() // refreshes the page to show changes

    }catch(err){ // starts the error block, pass error to catch block if error exists
        console.log(err) // log the error to the console
    } // close the catch block
}// close the function

async function markUnComplete(){ // asynchronous function declaration for markComplete()
    const itemText = this.parentNode.childNodes[1].innerText// selects text that is the 2nd(?) child of the parent element of the trash icon and stores it into the 'itemText' variable
    try{ // starts a try block
        const response = await fetch('markUnComplete', { // waits on a fetch to get data from the result of markComplete and stores it into a 'response'
            method: 'put', // sets the method for the route to 'put'
            headers: {'Content-Type': 'application/json'}, // sets the headers to expect json
            body: JSON.stringify({ // turns into a string the results of the request and sets it to the body property
                'itemFromJS': itemText  // sets the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) // close the body code
          }) // close the object and fetch
        const data = await response.json() // waits for a json conversion to the response fetch and stores it into 'data'
        console.log(data) // logs the response to the console
        location.reload() // refreshes the page to show changes

    }catch(err){ // starts the error block, pass error to catch block if error exists
        console.log(err) // log the error to the console
    } // close the catch block
}// close the function