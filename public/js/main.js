const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable that targets all elements with a class of fa-trash
const item = document.querySelectorAll('.item span')//creates a variable that targets any span elements with a parent class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed') //creates a variable that targets any span elements with a parent class of 'item' AND the span element has a class of 'completed'

Array.from(deleteBtn).forEach((element)=>{ //creates an array of all elements with a class of fa-trash, and then starting a loop through the array
    element.addEventListener('click', deleteItem) // on each iteration of the loop, an event listener is added to the current item that waits for a click and calls deleteItem function upon a click.
}) //close the loop

Array.from(item).forEach((element)=>{ //creates an array of all span elements with a parent class of 'item' and starts a loop through the items
    element.addEventListener('click', markComplete) //add an event listener to the current item, waits for a click and calls markComplete function upon click
}) //close the loop

Array.from(itemCompleted).forEach((element)=>{ //creates an array of all span elements with a class of 'completed' and a parent of 'item' and starts a loop through the items
    element.addEventListener('click', markUnComplete) //add an event listener to the current item, waits for a click and calls markUnComplete function upon click
}) //close the loop

async function deleteItem(){ //declares asynchronous function deleteItem. Async functions help us control the flow of execution - make it wait for tasks to complete before running.
    const itemText = this.parentNode.childNodes[1].innerText //creates a variable that extracts the text value ONLY of the span item associated with the trash can clicked. This = container in which the item is in. Parent Node = list item. Child note = span.
    try{ // starting a try block
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from the result of 'deleteItem' route. Starting an object for the route.
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifiying the type of content expected - JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on the JSON from the response to be converted
        console.log(data) //log the response result to console
        location.reload() //reloads the page to update what is displayed 

    }catch(err){ //close try block, start catch block which grabs and passes in an error
        console.log(err) //log error to the console
    } //close catch block
} //close async function

async function markComplete(){ //declare asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch to grab data from the result 'markComplete' route
            method: 'put', //sets the CRUD method (update) for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected - JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //wait on JSON from the response to be converted
        console.log(data) //log the result to console
        location.reload() //reloads the page to update what is displayed 

    }catch(err){ //close try block, start catch block which grabs and passes in an error
        console.log(err) //log error to the console
    } //close catch block
} //close async function

async function markUnComplete(){ //start asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list
    try{ //starting a try block to do something
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch to grab data from the result 'markUnComplete' route
            method: 'put', //declares the CRUD method (update) for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected - JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })
          })
        const data = await response.json() //wait on JSON from the response to be converted
        console.log(data) //log the result to console
        location.reload() //reloads the page to update what is displayed 

    }catch(err){ //close try block, start catch block which grabs and passes in an error
        console.log(err) //log error to console
    } //close catch block
} //close async function