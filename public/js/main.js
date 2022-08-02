const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable and assigning it to a selection of all elements with a class of '.fa-trash'
const item = document.querySelectorAll('.item span') //creating a variable and assigning it to a selection of all span elements within an element with a class of '.item'
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assigning it to a selection of span tags with a class of '.completed' inside of a parent with a class of '.item'

Array.from(deleteBtn).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) //adding a 'click' event listener to the current item in the loop. on click it runs the deleteItem function
}) //close our loop

Array.from(item).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete) //adding a 'click' event listener to the current item in the loop. on click it runs the markComplete function
}) //close our loop

Array.from(itemCompleted).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) //adding a 'click' event listener to the current item in the loop. on click it runs the markUnComplete function
}) //close our loop

async function deleteItem(){ //declaring an asynchronous function called deleteItem
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content to expect, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function

async function markComplete(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content to expect, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify it
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //close the body
          }) //close the object 
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reload the page to update the display

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function

async function markUnComplete(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //start a try block to do something
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content to expect, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify it
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //close the body
          }) //close the object
          const data = await response.json() //waiting on JSON from the response to be converted
          console.log(data) //log the result to the console
          location.reload() //reload the page to update the display

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function