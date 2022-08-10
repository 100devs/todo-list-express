const deleteBtn = document.querySelectorAll('.fa-trash') // get all the delete buttons
const item = document.querySelectorAll('.item span')    // get all the items, the span element is the text
const itemCompleted = document.querySelectorAll('.item span.completed') // get all the completed items, which have the class completed

Array.from(deleteBtn).forEach((element)=>{  // loop through the delete buttons and add a click event listener to each one
    element.addEventListener('click', deleteItem) // add a click event listener to each one
}) // end of loop through the delete buttons and add a click event listener to each one

Array.from(item).forEach((element)=>{ // loop through the items and add a click event listener to each one
    element.addEventListener('click', markComplete) // add a click event listener to each one
}) // end of loop through the items and add a click event listener to each one

Array.from(itemCompleted).forEach((element)=>{  // loop through the completed items and add a click event listener to each one
    element.addEventListener('click', markUnComplete)   // add a click event listener to each one
}) // end of loop through the completed items and add a click event listener to each one

async function deleteItem(){ // delete item function   
    const itemText = this.parentNode.childNodes[1].innerText // get the text of the item
    try{ // try to delete the item
        const response = await fetch('deleteItem', { // send a delete request to the server
            method: 'delete', // set the method to delete
            headers: {'Content-Type': 'application/json'}, // set the content type to json
            body: JSON.stringify({ // set the body to the item text
              'itemFromJS': itemText // set the body to the item text
            }) // end of setting the body to the item text
          }) // end of sending a delete request to the server
        const data = await response.json()  // get the response from the server and convert it to json
        console.log(data) // log the response from the server
        location.reload() // reload the page

    }catch(err){ // if there is an error
        console.log(err) // log the error
    } // end of try to delete the item
} // end of delete item function

async function markComplete(){ // async function to mark things complete    
    const itemText = this.parentNode.childNodes[1].innerText // get the text of the item
    try{                                                // try to mark the item complete
        const response = await fetch('markComplete', { // send a put request to the server
            method: 'put', // set the method to put
            headers: {'Content-Type': 'application/json'}, // set the content type to json
            body: JSON.stringify({ // set the body to the item text
                'itemFromJS': itemText // set the body to the item text
            }) // end of setting the body to the item text
          }) // end of sending a put request to the server
        const data = await response.json() // get the response from the server and convert it to json
        console.log(data) // log the response from the server
        location.reload() // reload the page

    }catch(err){ // if there is an error
        console.log(err) // log the error
    } // end of try to mark the item complete
} // end of mark complete function

async function markUnComplete(){ // async function to mark things uncomplete
    const itemText = this.parentNode.childNodes[1].innerText // get the text of the item
    try{ // try to mark the item uncomplete
        const response = await fetch('markUnComplete', {    // send a put request to the server
            method: 'put', // set the method to put
            headers: {'Content-Type': 'application/json'}, // set the content type to json
            body: JSON.stringify({ // set the body to the item text
                'itemFromJS': itemText            // set the body to the item text
            }) // end of setting the body to the item text
          })                                        // end of sending a put request to the server
        const data = await response.json() // get the response from the server and convert it to json
        console.log(data) // log the response from the server
        location.reload()   // reload the page

    }catch(err){                                        // if there is an error
        console.log(err) // log the error
    } // end of try to mark the item uncomplete
} // end of mark uncomplete function