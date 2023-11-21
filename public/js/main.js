const deleteBtn = document.querySelectorAll('.fa-trash') // creating a variable and assigning it to a selection of all elements with a class of trash can
const item = document.querySelectorAll('.item span') // creating a variable and assigning it to a selection of span tags inside of a parent that has a class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed') // creating a variable and assigning it to a selection of spans with a class of 'completed' inside of a parent with a class of 'item'

Array.from(deleteBtn).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) //add an event listener to the current item that waits for a click, then calls a function called deleteItem
}) //closes loop

Array.from(item).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete) // add an event listener to current item that waits for a click, then calls a function called markComplete
}) //closes loop

Array.from(itemCompleted).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) //add an event listener to ONLY completed items
}) //closes loop

async function deleteItem(){ // declaring asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try{ // starting a try block do something
        const response = await fetch('deleteItem', { // creates a variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare message content being passed and stringify that content
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) // closing the body
          }) // closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //refreshes the page to update what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) //logs the error to the console
    } //close the catch block
} //end the function

async function markComplete(){ // declaring asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try{ // starting a try block do something
        const response = await fetch('markComplete', { // creates a variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', //sets the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, //specifying the tyoe of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed and stringify that content
                'itemFromJS': itemText //setting the content of the body to the the inner text of the list item and naming 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //refreshes the page to update what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) //logs the error to the console
    } //close the catch block
}

async function markUnComplete(){ // declaring asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try{ // starting a try block do something
        const response = await fetch('markUnComplete', { // creates a variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put', //sets the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, //specifying the tyoe of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed and stringify that content
                'itemFromJS': itemText //setting the content of the body to the the inner text of the list item and naming 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //refreshes the page to update what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) //logs the error to the console
    } //close the catch block
}