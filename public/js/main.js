const deleteBtn = document.querySelectorAll('.fa-trash') // creating a variable and assigning it to a selection of all elements with a class of the .fa-trash
const item = document.querySelectorAll('.item span') // creating a variable and assigning it to a selection of span tag elements inside of a parent that has a class of 'item' 
const itemCompleted = document.querySelectorAll('.item span.completed') // creating a variable and assigning it to a selection of spans with a class of 'completed' inside of a parent with a class of 'item'

Array.from(deleteBtn).forEach((element)=>{ // creating an array from the selection(variable) and starting a loop (forEach) that...
    element.addEventListener('click', deleteItem) // adds an event listener to the current item that waits for a click and then calls a function called deleteItem
}) //close the loop

Array.from(item).forEach((element)=>{ // create an array from the item variables and start a loop
    element.addEventListener('click', markComplete) // add an event listener to the current item that waits for a click and then calls the function markComplete
}) // close the loop

Array.from(itemCompleted).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) // adds an event listener to ONLY completed items. 
}) // close the loop

//using async function to give more flexibility
async function deleteItem(){ //declaring an asychronous function called deleteItem()
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span. 
    try{ //declaring a try block to do something
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from the results of deleteItem route. 
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed and stringify that content
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'. 
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) // log the result to the console. 
        location.reload() // reloads the page to update what is displayed.

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error into the console. 
    } //close the catch block
} //end the function

async function markComplete(){ //declare an asynchronous function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch to get data from the results of markComplete route. 
            method: 'put', //setthing the CRUD method to 'update' for the route. 
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message  content being passed and stringy that content. 
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'. 
            }) //closes the body
          }) //closes the object
        const data = await response.json() //wait on JSON from the reponse to be converted. 
        console.log(data) //log the result to the console. 
        location.reload() //reloads the page to update what is displayed. 

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error into the console. 
    } //close the catch block
} //end the function

async function markUnComplete(){ //declare an asynchronous function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try{ //starting a try block to do something
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch to get data from the results of markUnComplete route. 
            method: 'put', //setthing the CRUD method to 'update' for the route. 
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected, which is JSON
            body: JSON.stringify({//declare the message  content being passed and stringy that content. 
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'. 
            })
          })
        const data = await response.json() //wait on JSON from the reponse to be converted. 
        console.log(data) //log the error into the console. 
        location.reload() //reloads the page to update what is displayed. 

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) //log the error into the console. 
    } //close the catch block
} //end the function