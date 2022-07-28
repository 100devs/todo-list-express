const deleteBtn = document.querySelectorAll('.fa-trash') //Create a variable and assign it to elements with a class of "fa-trash"
const item = document.querySelectorAll('.item span') //Create a variable and assign it to span elements within a parent with a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') //Create a variable and assign it to span elements with a class of "completed" within a parent with a class of "item" 

Array.from(deleteBtn).forEach((element)=>{ //Create an array from the "deleteBtn" variable and start a loop
    element.addEventListener('click', deleteItem) //Add an event listener to the current element that waits for a click and then calls a function called "deleteItem"
}) //Close loop

Array.from(item).forEach((element)=>{ //Create an array from the "item" variable and start a loop
    element.addEventListener('click', markComplete) //Add an event listener to the current element that waits for a click and then calls a function called "markComplete"
}) //Close loop

Array.from(itemCompleted).forEach((element)=>{ //Create an array from the "itemCompleted" variable and start a loop
    element.addEventListener('click', markUnComplete) //Add an event listener to the current element that waits for a click and then calls a function called "markUnComplete"
}) //Close loop

async function deleteItem(){ //Create an asynchronous function called "deleteItem"
    const itemText = this.parentNode.childNodes[1].innerText //Create a variable and assign it to the inner text of the list item
    try{ //Start a try block
        const response = await fetch('deleteItem', { //Create a response variable that waits on a fetch to get data from the result of the "deleteItem" route
            method: 'delete', //Specify the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //Specify the type of content expected, which is JSON
            body: JSON.stringify({ //Declare the message content being passed, and stringify that content
              'itemFromJS': itemText //Set the content of the body to the inner text of the list item and name it "itemFromJS"
            }) //Close the body
          }) //Close the object
        const data = await response.json() // Wait for the JSON from the response to be converted
        console.log(data) //Log the result to the console
        location.reload() //Reload the page to update the content

    }catch(err){ //If an error occurs, pass the error into the catch block
        console.log(err) //Log the error to the console
    } //Close the catch block
} //Close the function

async function markComplete(){ //Create an asynchronous function called "markComplete"
    const itemText = this.parentNode.childNodes[1].innerText //Create a variable and assign it to the inner text of the list item
    try{ //Start a try block
        const response = await fetch('markComplete', { //Create a response variable that waits on a fetch to get data from the result of the "markComplete route"
            method: 'put', //Specify the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //Specify the type of content expected, which is JSON
            body: JSON.stringify({ //Declare the message content being passed, and stringify that content
                'itemFromJS': itemText //Set the content of the body to the inner text of the list item and name it "itemFromJS"
            }) //Close the body
          }) //Close the object
        const data = await response.json() //Wait for the JSON from the response to be converted
        console.log(data) //Log the result to the console
        location.reload() //Reload the page to update the content

    }catch(err){ //If an error occurs, pass the error into the catch block
        console.log(err) //Log the error to the console
    } //Close the catch block
} //Close the function

async function markUnComplete(){ //Create an asynchronous function called "markUnComplete"
    const itemText = this.parentNode.childNodes[1].innerText //Create a variable and assign it to the inner text of the list item
    try{ //Start a try block
        const response = await fetch('markUnComplete', { //Create a response variable that waits on a fetch to get data from the result of the "markUnComplete route"
            method: 'put', //Specify the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //Specify the type of content expected, which is JSON
            body: JSON.stringify({ //Declare the message content being passed, and stringify that content
                'itemFromJS': itemText //Set the content of the body to the inner text of the list item and name it "itemFromJS"
            }) //Close the body
          }) //Close the object
        const data = await response.json() //Wait for the JSON from the response to be converted
        console.log(data) //Log the result to the console
        location.reload() //Reload the page to update the content

    }catch(err){ //If an error occurs, pass the error into the catch block
        console.log(err) //Log the error to the console
    } //Close the catch block
} //Cose the function