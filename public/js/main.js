//creating a variable and assigning it to a selection all elements with a class of the trashcan
const deleteBtn = document.querySelectorAll('.fa-trash')
//creating a variable and assigning it to a selection of of span tags inside of a parent that has a class of "item"
const item = document.querySelectorAll('.item span')
//creating a variable and assigning it to a selection of of spans with a class of "completed" inside of a parent with a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) //add an event listener to the current item that waits for a click and then calls a function called deleteItem
}) //close our loop

Array.from(item).forEach((element)=>{ //creating an array from our selection and starting a loop 
    element.addEventListener('click', markComplete) //add an event listener to the current item that waits for a click and then calls a function called markComplete
})//close loop

Array.from(itemCompleted).forEach((element)=>{ //creating an array from our selection and starting a loop 
    element.addEventListener('click', markUnComplete) //add an event listener to ONLY completed items
}) //close loop

async function deleteItem(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{//starting a try block
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', //sets the CRUD method to "delete" for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it "itemFromJS"
            }) //closing body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log result to the console
        location.reload() //reloads the page to update what is displayed
    }catch(err){ //if an error occurs, pass the error to catch block
        console.log(err) //log error to the console
    } //close catch block
} //end function

async function markComplete(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //start try block to do something
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', //setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it "itemFromJS"
            }) //closing body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log result to the console
        location.reload() //reloads the page to update what is being displayed

    }catch(err){ //if an error occurs, pass the error to catch block
        console.log(err) //log error to the console
    } //close catch block
} //end the function

async function markUnComplete(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put', //setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it "itemFromJS"
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result into the console
        location.reload() //reloads the page to update what is being displayed

    }catch(err){ //if an error occurs, pass the error to catch block
        console.log(err) //log error to the console
    } //close catch block
} //end the function