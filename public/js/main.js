// Creating var and assign it to  a collection of all 
// elements with a class fo fa-trash
const deleteBtn = document.querySelectorAll('.fa-trash')

// Creating var and assigning it a collection of all span elements
// that are children of elements with the class of item
const item = document.querySelectorAll('.item span')

// Creating var and assigning it a collection of spans that have a class of completed
// but are also descendants of a element with a class of item
const itemCompleted = document.querySelectorAll('.item span.completed')

// Convert to array and start looping through deleteBtn list
Array.from(deleteBtn).forEach((element)=>{
    // Add event listener to each button which when clicked,
    // will trigger the deleteItem function
    element.addEventListener('click', deleteItem)
// close loop
})

// Convert to array and start loop through item list
Array.from(item).forEach((element)=>{
    // Add event listener to each span which when clicked,
    // will trigger the markComplete function
    element.addEventListener('click', markComplete)
// close the loop
})

// Convert to array and start loop through itemCompleted list
Array.from(itemCompleted).forEach((element)=>{
    // Add event listener to ONLY those items which are completed that
    // when clicked trigger the carkUnComplete function
    element.addEventListener('click', markUnComplete)
// Close the loop
})

// Declare an asynchronous function
async function deleteItem(){
    // Creating var and setting it to the inner text of the list span
    const itemText = this.parentNode.childNodes[1].innerText
    // Declaring a try block
    try{
        // Creates var response and assigns it to the result/data of 
        // the fetch function using the deleteItem route
        const response = await fetch('deleteItem', {
            // sets the CRUD method for the route as delete
            method: 'delete',
            // specifying the type of content expected which is JSON
            headers: {'Content-Type': 'application/json'},
            // Declare the message content being passed to server 
            // and stringify that content
            body: JSON.stringify({
                //Setting the conent of the body to the value of the 
                // itemText var and naming the key 'itemFromJS'
              'itemFromJS': itemText
            //  closing body
            })
        // Closing our object and fetch function
          })
        //  Creating var data and assigning it to the value of the response as JSON
        const data = await response.json()
        // Log data
        console.log(data)
        // Reloads the page to update what is displayed
        // so that the deleted element will disappear
        location.reload()
    // Starting error catch, if error occurs, pass error to catch block
    }catch(err){
        // log the error to the console
        console.log(err)
    // Close catch block
    }
// End deleteItem function
}

// Declaring async function 
async function markComplete(){
    // Creating var and setting it to the inner text of the list span
    const itemText = this.parentNode.childNodes[1].innerText
    // Declaring a try block
    try{
        // Creates var response and assigns it to the result/data of 
        // the fetch function using the markComplete route
        const response = await fetch('markComplete', {
            // sets the CRUD method for the route as update
            method: 'put',
            // specifying the type of content expected which is JSON
            headers: {'Content-Type': 'application/json'},
            // Declare the message content being passed to server 
            // and stringify that content
            body: JSON.stringify({
                //Setting the conent of the body to the value of the 
                // itemText var and naming the key 'itemFromJS'
                'itemFromJS': itemText
            // Close the body
            })
        // Close the object and fetch function
          })
        //  Creating var data and assigning it to the value of the response as JSON
        const data = await response.json()
        // Log data
        console.log(data)
        // Reload to show results
        location.reload()
    // Starting error catch, if error occurs, pass error to catch block
    }catch(err){
        // log the error to the console
        console.log(err)
    // Close catch block
    }
// End markComplete function
}

// Declaring asyn function
async function markUnComplete(){
    // Creating var and setting it to the inner text of the list span
    const itemText = this.parentNode.childNodes[1].innerText
    // Declaring a try block
    try{
        // Creates var response and assigns it to the result/data of 
        // the fetch function using the markUnComplete route
        const response = await fetch('markUnComplete', {
            // sets the CRUD method for the route as update
            method: 'put',
            // specifying the type of content expected which is JSON
            headers: {'Content-Type': 'application/json'},
            // Declare the message content being passed to server 
            // and stringify that content
            body: JSON.stringify({
                //Setting the conent of the body to the value of the 
                // itemText var and naming the key 'itemFromJS'
                'itemFromJS': itemText
            // Close the body
            })
        // Close the object and fetch function
          })
        //  Creating var data and assigning it to the value of the response as JSON
        const data = await response.json()
        // Log data
        console.log(data)
        // Reload to show results
        location.reload()
    // Starting error catch, if error occurs, pass error to catch block
    }catch(err){
        // log the error to the console
        console.log(err)
    // Close catch block
    }
// End markComplete function
}