const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable and assigning it to a selection of all elements with a class of the trash can
const item = document.querySelectorAll('.item span') //creating a variable and assigning it to a selection of span tags inside of a parent
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assigning it to a selection of spans with a class of "completed" inside of a parent with a class of "item"

Array.from(deleteBtn).forEach((element) => { //creating an array from selection and starting a loop
    element.addEventListener('click', deleteItem) //add an event listener to the current item that waits for a click and then calls a function called deleteItem
}) //close loop

Array.from(item).forEach((element) => { //creating an array from selection and starting a loop
    element.addEventListener('click', markComplete) //add event listener to current item that waits for a click and then calls a function called markComplete
}) //close loop

Array.from(itemCompleted).forEach((element) => { //creating an array from selection and starting a loop
    element.addEventListener('click', markUnComplete) //adds an event listener to ONLY completed items
}) //close loop

async function deleteItem() { //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try { //starting try block to do something
        const response = await fetch('deleteItem', { //creates response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', //sets the CRUD method for the route
            headers: { 'Content-Type': 'application/json' }, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed and stringify that content
                'itemFromJS': itemText //setting body content to the inner text of the list item and naming it 'itemFromJS'
            }) //closing body
        }) // closing object 
        const data = await response.json() //waiting on JSON response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads page to update what's displayed

    } catch (err) { //if an error occurs, pass error into catch block
        console.log(err) //log error into console
    } //close catch block
} //end the function

async function markComplete() { //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try { //starting try block to do something
        const response = await fetch('markComplete', { //creates response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', //setting the CRUD method to "update" the route
            headers: { 'Content-Type': 'application/json' }, //specifying expected content type, which is JSON
            body: JSON.stringify({ //declare message content being passed and stringify that content
                'itemFromJS': itemText //setting body content to the inner text of the list item and naming it 'itemFromJS'
            }) //closing body
        }) // closing object
        const data = await response.json() //waiting on JSON response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads page to update what's displayed

    } catch (err) { //if an error occurs, pass error into catch block
        console.log(err) //log error into console
    } //close catch block
} //end the function

async function markUnComplete() { //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try { //starting try block to do something
        const response = await fetch('markUnComplete', { //creates response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put', //setting the CRUD method to "update" the route
            headers: { 'Content-Type': 'application/json' }, //specifying expected content type, which is JSON
            body: JSON.stringify({ //declare message content being passed and stringify that content
                'itemFromJS': itemText //setting body content to the inner text of the list item and naming it 'itemFromJS'
            }) //closing body
        }) // closing object
        const data = await response.json() //waiting on JSON response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads page to update what's displayed

    } catch (err) { //if an error occurs, pass error into catch block
        console.log(err) //log error into console
    } //close catch block
} //end the function