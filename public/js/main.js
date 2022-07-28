const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable and assigning it to a selection of all elements with a class of trash can
const item = document.querySelectorAll('.item span') //creating variable and assigning it to a selection of all spans within a parent that has a class of item
const itemCompleted = document.querySelectorAll('.item span .completed') //creating a variable and assigning it to a collection of spans with a class of completed inside of a parent with a class of item

Array.from(deleteBtn).forEach((element)=>{ //creating an array from selection and starting a loop
    element.addEventListener('click', deleteItem) //add an event listener to the current item that waits for a click and then calls a function called deleteItem
}) //close loop

Array.from(item).forEach((element)=>{ //creating an array from selecition and starting a loop
    element.addEventListener('click', markComplete) //add event listener to the current item that waits for a click and then calls a function called markComplete
}) //close loop

Array.from(itemCompleted).forEach((element)=>{ //creating an array from selecition and starting a loop
    element.addEventListener('click', markUnComplete) //adds an event listener to only completed items
}) //close loop

async function deleteItem(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item  and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('deleteItem', { //creates response variable that waits on a fetch to get data from a result of deleteItem route
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is json
            body: JSON.stringify({ //declare message content being passed, and stringify that content
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it itemFromJS
            }) //close body
          }) //close object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log result to console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to console
    } //close catch block
} //end function 

async function markComplete(){ //declare an asynchronous
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item  and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is json
            body: JSON.stringify({ //declare message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it itemFromJS
            }) //close body
          }) //close object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log result to console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to console
    } //close catch block
} //end function

async function markUnComplete(){ //declare an asynchronous
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item  and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is json
            body: JSON.stringify({ //declare message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it itemFromJS
            }) //close body
          }) //close object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log result to console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to console
    } //close catch block
} //end function