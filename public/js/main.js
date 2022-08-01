const deleteBtn = document.querySelectorAll('.fa-trash') // storing the trash can button in the ejs file into the variable deleteBtn
const item = document.querySelectorAll('.item span') // storing the items in spans in the variable item
const itemCompleted = document.querySelectorAll('.item span.completed') // storing the items in the span that are also in completed classes inside the variable itemCompleted

Array.from(deleteBtn).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) //adding an event listener to the current item and if it gets clicked on then it runs the function deleteItem
})

Array.from(item).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete)//adding an event listener to the current item and if it gets clicked on then it runs the function markComplete
})

Array.from(itemCompleted).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) //adding an event listener to the current item and if it gets clicked on then it runs the function markUncomplete
})

async function deleteItem(){ //declaring asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('deleteItem', { // creates a response variable that waits on a fetch to get data from the result of deleteItem
            method: 'delete', // sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content that is expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed, and stringify that content
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })
          })
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log data to console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) // log error
    }
}

async function markComplete(){ //declaring asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { // creates a response variable that waits on a fetch to get data from the result of markComplete
            method: 'put', // sets the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content that is expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })
          })
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log data to console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) // log error
    }
}

async function markUnComplete(){ //declaring asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('markUnComplete', { // creates a response variable that waits on a fetch to get data from the result of markUnComplete
            method: 'put', // sets the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content that is expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })
          })
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // log data to console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) // log error
    }
}