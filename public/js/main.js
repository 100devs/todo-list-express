// Constant that holds all elements with a class of 'fa-trash'
const deleteBtn = document.querySelectorAll('.fa-trash')
// Constant that holds all span elements within a parent which has a class of "item"
const item = document.querySelectorAll('.item span')
// Constant that holds all span elements with a class of completed inside a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed')

// Convert each element in the 'deleteBtn' constant into an array and add a click event listener to each element, which will also trigger a callback function of "deleteItem" upon 'hearing' a click
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Convert each element in the 'item' constant into an array and add a click event listener to each element, which will also trigger a callback function of "markComplete" upon 'hearing' a click
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// Convert each element in the 'itemCompleted' constant into an array and add a click event listener to each element, which will also trigger a callback function of "markUnComplete" upon 'hearing' a click
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Define the asynchronous function of 'deleteItem'
async function deleteItem(){
    // Grab the contents of the span within the list element and assign it to 'itemText'
    const itemText = this.parentNode.childNodes[1].innerText
    // Try and catch block
    try{
        // A fetch is sent to the server with the route of 'deleteItem' and its awaited result is assigned to the 'response' constant variable
        const response = await fetch('deleteItem', {
            // Set a CRUD method of 'delete' for the route
            method: 'delete',
            // Set an expected content type of JSON
            headers: {'Content-Type': 'application/json'},
            // Convert the content of the body into a JSON string
            body: JSON.stringify({
                // Setting the content of the body's text to 'itemFromJS'
                'itemFromJS': itemText
            })
        })
        // Convert the awaited response into JSON and assign it to the constant variable 'data'
        const data = await response.json()
        // Display the 'data' to the user in the console
        console.log(data)
        // Reload the page to display the page, now minus the deleted material
        location.reload()
    // Catch any error(s)
    }catch(err){
        // Console log any such error(s) to the user
        console.log(err)
    }
}
// Define the asynchronous function of 'markComplete'
async function markComplete(){
    // Grab the contents of the span within the list element and assign it to 'itemText'
    const itemText = this.parentNode.childNodes[1].innerText
    // Try and catch block
    try{
        // A fetch is sent to the server with the route of 'markComplete' and its awaited result is assigned to the 'response' constant variable
        const response = await fetch('markComplete', {
            // Set a CRUD method of 'put' (update) for the route
            method: 'put',
            // Set an expected content type of JSON
            headers: {'Content-Type': 'application/json'},
            // Convert the content of the body into a JSON string
            body: JSON.stringify({
                // Setting the content of the body's text to 'itemFromJS'
                'itemFromJS': itemText
            })
        })
        // Convert the awaited response into JSON and assign it to the constant variable 'data'
        const data = await response.json()
        // Display the 'data' to the user in the console
        console.log(data)
        // Reload the page to display the page, now with the updated material
        location.reload()
    // Catch any error(s)
    }catch(err){
        // Console log any such error(s) to the user
        console.log(err)
    }
}

// Define the asynchronous function of 'markUnComplete'
async function markUnComplete(){
    // Grab the contents of the span within the list element and assign it to 'itemText'
    const itemText = this.parentNode.childNodes[1].innerText
    // Try and catch block
    try{
        // A fetch is sent to the server with the route of 'markUnComplete' and its awaited result is assigned to the 'response' constant variable
        const response = await fetch('markUnComplete', {
            // Set a CRUD method of 'put' (update) for the route
            method: 'put',
            // Set an expected content type of JSON
            headers: {'Content-Type': 'application/json'},
            // Convert the content of the body into a JSON string
            body: JSON.stringify({
                // Setting the content of the body's text to 'itemFromJS'
                'itemFromJS': itemText
            })
        })
        // Convert the awaited response into JSON and assign it to the constant variable 'data'
        const data = await response.json()
        // Display the 'data' to the user in the console
        console.log(data)
        // Reload the page to display the page, now with the updated material
        location.reload()
     // Catch any error(s)
    }catch(err){
        // Console log any such error(s) to the user
        console.log(err)
    }
}
