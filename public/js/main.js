// Declare a variable of all selectors assigned with '.fa-trash' class
const deleteBtn = document.querySelectorAll('.fa-trash')
// Declare a variable of all span selectors inside of a parent assigned with '.item' class
const item = document.querySelectorAll('.item span')
// Declare a variable of all span selectors assigned with '.completed' class inside of a parent assigned with '.item' class
const itemCompleted = document.querySelectorAll('.item span.completed')

// Create an array from a selection and start a loop
Array.from(deleteBtn).forEach((element)=>{
    // Add an event listener to the current item that waits for a click before calling the 'deleteItem' function
    element.addEventListener('click', deleteItem)
// Close loop
})

// Create an array from a selection and start a loop
Array.from(item).forEach((element)=>{
    // Add an event listener to the current item that waits for a click before calling the 'markComplete' function
    element.addEventListener('click', markComplete)
// Close loop
})

// Create an array from a selection and start a loop
Array.from(itemCompleted).forEach((element)=>{
    // Add an event listener to the current item (whose 'completed' property is set to true) that waits for a click before calling the 'markUnComplete' function
    element.addEventListener('click', markUnComplete)
// Close loop
})

// Declare an asynchronous function
async function deleteItem(){
    // Declare a variable that looks inside the list item and captures the inner text within the list span
    const itemText = this.parentNode.childNodes[1].innerText
    // Declare try block to retrieve a response from the database
    try{
        // Declare a 'response' variable that waits for a fetch to get data from the result of the 'deleteItem' route
        const response = await fetch('deleteItem', {
            // Set CRUD method for route ('Delete')
            method: 'delete',
            // Specify JSON as the type of content expected
            headers: {'Content-Type': 'application/json'},
            // Declare message content being passed and stringify it
            body: JSON.stringify({
                // Set content of the body to the inner text of the list item, with the name 'itemFromJS'
                'itemFromJS': itemText
            // Close body
            })
        // Close object
        })
        // Declare a variable that contains the awaited parsing of the response as JSON
        const data = await response.json()
        // Console log the result
        console.log(data)
        // Reload page to update displayed data
        location.reload()
    // Pass any errors to the declared catch block
    }catch(err){
        // Console log the error
        console.log(err)
    // Close catch block
    }
// End function
}

// Declare an asynchronous function
async function markComplete(){
    // Declare a variable that looks inside the list item and captures the inner text within the list span
    const itemText = this.parentNode.childNodes[1].innerText
    // Declare try block to retrieve a response from the database
    try{
        // Declare a 'response' variable that waits for a fetch to get data from the result of the 'markComplete' route
        const response = await fetch('markComplete', {
            // Set CRUD method for route ('Update')
            method: 'put',
            // Specify JSON as the type of content expected
            headers: {'Content-Type': 'application/json'},
            // Declare message content being passed and stringify it
            body: JSON.stringify({
                // Set content of the body to the inner text of the list item, with the name 'itemFromJS'
                'itemFromJS': itemText
            // Close body
            })
        // Close object
        })
        // Declare a variable that contains the awaited parsing of the response as JSON
        const data = await response.json()
        // Console log the result
        console.log(data)
        // Reload page to update displayed data
        location.reload()
    // Pass any errors to the declared catch block
    }catch(err){
        // Console log the error
        console.log(err)
    // Close catch block
    }
// End function
}

// Declare an asynchronous function
async function markUnComplete(){
    // Declare a variable that looks inside the list item and captures the inner text within the list span
    const itemText = this.parentNode.childNodes[1].innerText
    // Declare try block to retrieve a response from the database
    try{
        // Declare a 'response' variable that waits for a fetch to get data from the result of the 'markUnComplete' route
        const response = await fetch('markUnComplete', {
            // Set CRUD method for route ('Update')
            method: 'put',
            // Specify JSON as the type of content expected
            headers: {'Content-Type': 'application/json'},
            // Declare message content being passed and stringify it
            body: JSON.stringify({
                // Set content of the body to the inner text of the list item, with the name 'itemFromJS'
                'itemFromJS': itemText
            // Close body
            })
        // Close object
        })
        // Declare a variable that contains the awaited parsing of the response as JSON
        const data = await response.json()
        // Console log the result
        console.log(data)
        // Reload page to update displayed data
        location.reload()
    // Pass any errors to the declared catch block
    }catch(err){
        // Console log the error
        console.log(err)
    // Close catch block
    }
// End function
}