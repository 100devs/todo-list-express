const deleteBtn = document.querySelectorAll('.fa-trash') // creating a variable and assigning it to a selection of ALL elements with a class of .fa-trash
const item = document.querySelectorAll('.item span') //creating a variable and assigning it to a selection of of ALL span tags with a parent with a class of .item
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assigning it to a selection of ALL spans that have a class of completed AND a parent that has a class of item

Array.from(deleteBtn).forEach((element)=>{ // looping through the deletebutton array
    element.addEventListener('click', deleteItem) // add an event listenter to current item that waits for a click and calls the deleteItem function
}) // closes the loop

Array.from(item).forEach((element)=>{ // looping through the item array
    element.addEventListener('click', markComplete) // add an event listenter to current item that waits for a click and calls the markComplete function
}) // closes the loop

Array.from(itemCompleted).forEach((element)=>{ // looping through the itemCompleted array
    element.addEventListener('click', markUnComplete) // add an event listenter to current item that waits for a click and calls the markUnComplete function
}) // closes the loop

async function deleteItem(){ // declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // starting a try block to do something
        const response = await fetch('deleteItem', { // creates a response variable that waits on a fetch that gets data from a result of a delete item
            method: 'delete', // delcaring what type of method we are using
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected which is json
            body: JSON.stringify({ // delcare the message content, and converting the json into a string
              'itemFromJS': itemText // setting the content of the body to the inner text of the list item and naming it itemFromJS
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // console logs the result
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    } // close the catch block
} // end the function

async function markComplete(){ // declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // starting a try block to do something
        const response = await fetch('markComplete', { // creates a response variable that waits on a fetch that gets data from a result of the markComplete route
            method: 'put', // setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected which is json
            body: JSON.stringify({ // delcare the message content, and converting the json into a string
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item and naming it itemText
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // console logs the result
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    } // close the catch block
} // end the function

async function markUnComplete(){ // delcaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // starting a try block to do something
        const response = await fetch('markUnComplete', { //create a response variable that waits on a fetch that gets data from a result of the markUnComplete route
            method: 'put', // setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected which is json
            body: JSON.stringify({ // delcare the message content, and converting the json into a string
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item and naming it itemText
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // console logs the result
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    } // close the catch block
} // end the function