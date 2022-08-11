const item = document.querySelectorAll('.item span') //creating a variable and assigning it to a selection of span tags inside of a parent that have a class of item
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assigning it to a selection of spans with a class of 'completed' inside a parent with a class of item

Array.from(deleteBtn).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) // adding an event listener to each element in the array. Each time listens for a click and calls the deleteItem function
}) //cloconst deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable and assigning it to a selection of all elements with a class of fa.trash
ses out loop

Array.from(item).forEach((element)=>{ //creates an array from our selection (item) and starts a loop
    element.addEventListener('click', markComplete) //adds an event listener to each element in the array and listens for a click which then calls a function called markComplete
}) //closes out loop

Array.from(itemCompleted).forEach((element)=>{ //creates an array from our selection and starts a loop
    element.addEventListener('click', markUnComplete) //adds an event listener to only completed items
}) //closes out loop

async function deleteItem(){ //declaring an asychronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try{ //declaring a try block to do something
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to retrieve data from the result of deleteItem route
            method: 'delete', //sets CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({  //declare the message content being passed and stringify that content
              'itemFromJS': itemText  //setting the content of the body to the innertext of the list item and naming it itemfromJS
            }) //closing out the body
          }) //closing object
        const data = await response.json() //waiting on JSON from the response to be converted and assigning it to a variable
        console.log(data) // log the data to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function

async function markComplete(){ //declare an ansychronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the innertext within the list span
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { //declaring a response and awaiting a fetch to get data fromthe result of the markComplete route
            method: 'put', //setting the CRUD method to  'update' for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the innertext of the list item, and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function

async function markUnComplete(){ //declare an ansychronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list and grabs only the innertext within the list span
    try{ //starting a try block to do something
        const response = await fetch('markUnComplete', { //declaring a response variable and waiting on a fetch to get data from the result of the markUncomplete route
            method: 'put', //setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body of the innertext of the list item, and naming it "itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function