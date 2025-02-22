const deleteBtn = document.querySelectorAll('.fa-trash') /* selecting all our elements with fa-trash class and putting it in a variable */
const item = document.querySelectorAll('.item span') /* selecting  all our elements with a class of item that has a child elem of span  */
const itemCompleted = document.querySelectorAll('.item span.completed') /* selecting  all our elements with a class of item that has a child elem of span and a class of completed  */

Array.from(deleteBtn).forEach((element)=>{ /* selecting the deleteBtn class and putting it in an array and then using a forEach method to loop through */
    element.addEventListener('click', deleteItem) /* giving all the element that has a class of deleteBtn a click event or event listener and then calls a function called deleteItem*/
}) /* closing tag */

Array.from(item).forEach((element)=>{ /* creating an array and starting a loop */
    element.addEventListener('click', markComplete) /* creating a click event for the elements and then calls for a function */
}) /* closing our loop */

Array.from(itemCompleted).forEach((element)=>{ /* creating an array from values on the variable selected and starting a loop */
    element.addEventListener('click', markUnComplete) /* adds event listener for ONLY completed items */
}) /* close our loop */

async function deleteItem(){ /* creating an async function named deleteItem */
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // starting a try block for our response or to do something
        const response = await fetch('deleteItem', { // creating a response variable and awaits a fetch to get data from deleteItem route
            method: 'delete', // setting the CRUD method to delete for the route
            headers: {'Content-Type': 'application/json'}, // setting the expected content type to json
            body: JSON.stringify({ // stringify the content
              'itemFromJS': itemText // setting the content of the body as itemText and itemFromJS as the property
            }) // closing the body
          }) // closing the fetch
        const data = await response.json() // we are waiting for the converted response json object and assigning it to the variable
        console.log(data) // displaying the data on the console
        location.reload() // reloading the page to update what is displayed

    }catch(err){ // starting a catch block for our errors if there is any
        console.log(err) // displaying the error on the console if there's any
    } // close the catch block
} // end of function

async function markComplete(){ /* creating an async function named markComplete */
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // starting a try block for our response or to do something
        const response = await fetch('markComplete', { // creating a response variable and awaits a fetch to get data from markComplete route
            method: 'put', // setting the CRUD method to update for the route
            headers: {'Content-Type': 'application/json'}, // setting the expected content type to json
            body: JSON.stringify({ // stringify the content
                'itemFromJS': itemText // setting the content of the body as itemText and itemFromJS as the property
            }) // closing the body
          }) // closing the fetch
        const data = await response.json() // we are waiting for the converted response json object and assigning it to the variable
        console.log(data) // displaying the data on the console
        location.reload() // reloading the page to update what is displayed

    }catch(err){ // starting a catch block for our errors if there is any
        console.log(err) // displaying the error on the console if there's any
    } // close the catch block
} // end of function

async function markUnComplete(){/* creating an async function named markUnComplete */
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ // starting a try block for our response or to do something
        const response = await fetch('markUnComplete', { // creating a response variable and awaits a fetch to get data from markUnComplete route
            method: 'put', // setting the CRUD method to update for the route
            headers: {'Content-Type': 'application/json'}, // setting the expected content type to json
            body: JSON.stringify({ // stringify the content
                'itemFromJS': itemText // setting the content of the body as itemText and itemFromJS as the property
            }) // closing the body
          }) // closing the fetch
        const data = await response.json() // we are waiting for the converted response json object and assigning it to the variable
        console.log(data) // displaying the data on the console
        location.reload() // reloading the page to update what is displayed

    }catch(err){ // starting a catch block for our errors if there is any
        console.log(err) // displaying the error on the console if there's any
    } // close the catch block
} // end of function