// Set deleteBtn to all elements with class .fa-trash
const deleteBtn = document.querySelectorAll('.fa-trash')
// Set item to all elements with class item that are spans
const item = document.querySelectorAll('.item span')
// Set itemCompleted to all elements with class item, that are spans with class completed
const itemCompleted = document.querySelectorAll('.item span.completed')
// Create array from deleteBtn and run a function on each element
Array.from(deleteBtn).forEach((element)=>{
    // Add an event listener to the element that runs deleteItem
    element.addEventListener('click', deleteItem)
// Close function
})
// Create an array from item and run a function on each element
Array.from(item).forEach((element)=>{
    // Add an event listener to the element that runs markComplete
    element.addEventListener('click', markComplete)
// Close function
})
// Create an array from itemCompleted and run a function on each element
Array.from(itemCompleted).forEach((element)=>{
    // Add an event listener to the element that runs markUnComplete
    element.addEventListener('click', markUnComplete)
// Close function
})
// Declare async function deleteItem
async function deleteItem(){
    // Set itemText to the innertext of the second child of the same parent node of the clicked element
    const itemText = this.parentNode.childNodes[1].innerText
    // run this code
    try{
        // set response to a fetch call to deleteItem
        const response = await fetch('deleteItem', {
            // set method to delete
            method: 'delete',
            // set a header to content-type of application/json, this tells the api to know what kind of data to expect
            headers: {'Content-Type': 'application/json'},
            // set body of request to an object converted to json string
            body: JSON.stringify({
               // set itemFromJS to itemText
              'itemFromJS': itemText
            // Close object
            })
          // Close out fetch request  
          })
        // set data to result of response, converted to object
        const data = await response.json()
        // log data
        console.log(data)
        // reload page
        location.reload()
        // Close the try function
        }
    // if async function fails, run this code
    catch(err){
        // Log the error
        console.log(err)
    // Close the catch function
    }
// Close the async function
}
// Declare async function markComplete
async function markComplete(){
    // Create itemText, set to text of the second child node of the parent of the clicked element
    const itemText = this.parentNode.childNodes[1].innerText
    // run this code
    try{
        // Create response, set to the result of a fetch call to markComplete path
        const response = await fetch('markComplete', {
            // Set method to put
            method: 'put',
            // Set content-type in header to application/json
            headers: {'Content-Type': 'application/json'},
            // set body of request to an object converted to json string
            body: JSON.stringify({
                // Set itemFromJS to itemText
                'itemFromJS': itemText
            // Close object
            })
          // Close fetch call
          })
        // Set data to the response to the request, converted to object
        const data = await response.json()
        // Log the object
        console.log(data)
        // Reload the page
        location.reload()
        // Close try function
        }
    // If the function fails run this code
    catch(err){
        // Log the error
        console.log(err)
    // Close catch function
    }
// Close the async function
}
// Create async functionmarkUnComplete
async function markUnComplete(){
    // Set itemText to the text of the second child node of the parent node of the clicked element
    const itemText = this.parentNode.childNodes[1].innerText
    // Run this code
    try{
        // Set response equal to the result of a call to the markUnComplete path
        const response = await fetch('markUnComplete', {
            // Set the method to put
            method: 'put',
            // Set the content-type in the header to application/json
            headers: {'Content-Type': 'application/json'},
            // Set body of request to an object converted to json string
            body: JSON.stringify({
                // Set itemFromJS to itemText
                'itemFromJS': itemText
            // Close object
            })
          // Close fetch call  
          })
        // Set data to the response converted into an object
        const data = await response.json()
        // log the object
        console.log(data)
        // reload the page
        location.reload()
    // Close try function
    }
    // If the async function fails run this code
    catch(err){
        // Log the error
        console.log(err)
    // Close the catch function
    }
// Close the async function
}