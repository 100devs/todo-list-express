const deleteBtn = document.querySelectorAll('.fa-trash') // Creates and assigns a variable of deleteBtn to any elements that have a class of .fa-trash
const item = document.querySelectorAll('.item span') // Creates and assigns a variable of item to a selection of span tags inside of a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') // Create and assigns a varibale of itemCompleted to a selection of spans with a class of "completed" inside a parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{ //Creates a copy of the objects stored in deleteBtn as an array and uses the array method forEach to loop through them 
    element.addEventListener('click', deleteItem) // As the forEach loops through the array it adds an event listener with a property of click to the current element and calls the function deleteItem
}) //Ends the loop

Array.from(item).forEach((element)=>{ // Creates a copy of the objects stored in item variable as an array and uses the array method forEach to loop through them
    element.addEventListener('click', markComplete) // As the forEach loops through the array it adds an event listener with a property of click to the current element and calls the function markComplete
}) //Ends the loop

Array.from(itemCompleted).forEach((element)=>{ // Creates a copy of the objects stored in the itemCompleted variable as an array and uses the array method forEach to loop through them
    element.addEventListener('click', markUnComplete) // As the forEach loops through the array it adds an event listener with a property of click to the current element and calls the function markUnComplete
}) // Ends the loop

async function deleteItem(){ // Declares an asynchronous function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText // Creates and assigns a variable of itemText to the "this" context to select the text of the list span
    try{ // Declares a try block
        const response = await fetch('deleteItem', {// Creates and assigns a variable of response to an await promise that fetches data from the result of the deleteItem route
            method: 'delete', // Sends a delete request to the server
            headers: {'Content-Type': 'application/json'}, // sets the type of content expected as JSON
            body: JSON.stringify({ // sets the body/content of the message and stringifies the JSOn
              'itemFromJS': itemText // property of the body content is set to a variable itemFromJS which has a value of itemText which is the inner text of the list item
            }) // Ends the fetch
          })//Ends the try
        const data = await response.json() // Creates and assigns a variable of data to an await response promise with a json body to be converted
        console.log(data) // console logging the value of data
        location.reload() // reloads the current page to update what is displayed

    }catch(err){ // a catch for errors as part of the try block if an error occurs
        console.log(err) // console logging the error
    } // Ends the catch
} // Ends the async function

async function markComplete(){ // Declares an asynchronous function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText // Creates and assigns a variable of itemText to the "this" context to select the text of the list span
    try{ // Declares a try block
        const response = await fetch('markComplete', { // Creates and assigns a variable of response to an await promise that fetches data from the result of the markComplete route
            method: 'put', // Sends an update request to the server
            headers: {'Content-Type': 'application/json'}, // sets the type of content expected as JSON
            body: JSON.stringify({ // sets the body/content of the message and stringifies the JSON
                'itemFromJS': itemText // property of the body content is set to a variable itemFromJS which has a value of itemText which is the inner text of the list item
            }) // Ends the fetch
          }) // Ends the try
        const data = await response.json() // Creates and assigns a variable of data to an await response promise with a json body to be converted
        console.log(data) // console logging the value of data
        location.reload() // reloads the current page to update what is displayed

    }catch(err){ // a catch for errors as part of the try block if an error occurs
        console.log(err) // console logging the error
    } // Ends the catch
} // closes the async function

async function markUnComplete(){ // Declares an asynchronous function called markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText // Creates and assigns a variable of itemText to the "this" context to select the text of the list span
    try{ // Declares a try block
        const response = await fetch('markUnComplete', { // Creates and assigns a variable of response to an await promise that fetches data from the result of the markUnComplete route
            method: 'put', // Sends an update request to the server
            headers: {'Content-Type': 'application/json'}, // sets the type of content expected as JSON
            body: JSON.stringify({ // sets the body/content of the message and stringifies the JSON
                'itemFromJS': itemText // property of the body content is set to a variable itemFromJS which has a value of itemText which is the inner text of the list item
            }) // closes the fetch
          }) // closes the try
        const data = await response.json() // Creates and assigns a variable of data to an await response promise with a json body to be converted
        console.log(data) // console logging the value of data
        location.reload() // reloads the current page to update what is displayed

    }catch(err){ // a catch for errors as part of the try block if an error occurs
        console.log(err) // console logging the error
    } // Ends the catch
} // Ends the async function