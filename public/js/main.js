// Select all the DOM elements for the trash can icon and assign it to a variable
const deleteBtn = document.querySelectorAll('.fa-trash')
    // Select all the DOM elements of spans inside a parent with a class of ITEM and assign it to a variable (returns an array)
const item = document.querySelectorAll('.item span')
    // Select all the DOM elements of spans that have a class of COMPLETED, that are also inside a parent with a class of ITEM and assign it to a variable (returns an array)
const itemCompleted = document.querySelectorAll('.item span.completed')

//Create an array from our deleteBtn selection and start a loop.  
Array.from(deleteBtn).forEach((element) => {
    // Then add an event listener to the current item in the loop that waits for a click and then calls a function called deleteItem
    element.addEventListener('click', deleteItem)
        // Close the loop
})

//Create an array from our item selection and start a loop.  
Array.from(item).forEach((element) => {
    // Then add an event listener to the current item in the loop that waits for a click and then calls a function called markComplete
    element.addEventListener('click', markComplete)
        // Close the loop
})

//Create an array from our itemCompleted selection and start a loop.  
Array.from(itemCompleted).forEach((element) => {
    // Then add an event listener to the current item in the loop (only items that are completed) that waits for a click and then calls a function called markUnComplete
    element.addEventListener('click', markUnComplete)
        // Close the loop
})

// Declare an asynchronous function 
async function deleteItem() {
    // Looks inside the list item and grabs only the inner text within the list span
    const itemText = this.parentNode.childNodes[1].innerText
        // Start a try block to run some code 
    try {
        // creates a response variable that waits on a fetch to get data from the result of the deleteItem route
        const response = await fetch('deleteItem', {
                // sets the CRUD method for the route
                method: 'delete',
                // Specifying the type of content expected, which is JSON
                headers: { 'Content-Type': 'application/json' },
                // Declares the message content being passed, and turn it into a string
                body: JSON.stringify({
                    // Set the content of the body to the inner text of the list item, and namit it 'itemFromJS'
                    'itemFromJS': itemText

                })
            })
            // Waiting on JSON from the response
        const data = await response.json()
            // Log the result to the console
        console.log(data)
            // Reloads the page to update what is displayed
        location.reload()
            // If an error occurrs, pass the error into the catch block
    } catch (err) {
        // Log the error into the catch block
        console.log(err)
            // Close catch block
    }
    // Close the delete item function
}

// Declare an asynchronous function
async function markComplete() {
    // Looks inside the list item and grabs only the inner text within the list span
    const itemText = this.parentNode.childNodes[1].innerText;
    // Start a try block to run some code 
    try {
        // creates a response variable that waits on a fetch to get data from the result of the markComplete route
        const response = await fetch('markComplete', {
            // Set the CRUD method for the route to PUT
            method: 'put',
            // Set the content type to json
            headers: { 'Content-Type': 'application/json' },
            // Declares the message content being passed, and turn it into a string
            body: JSON.stringify({
                // Set the content of the body to the inner text of the list item, and namit it 'itemFromJS'
                'itemFromJS': itemText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()

    } catch (err) {
        console.log(err)
    }
}

// Declare and asynchronous function
async function markUnComplete() {
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()

    } catch (err) {
        console.log(err)
    }
}