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
})
// Create an array from item and run a function on each element
Array.from(item).forEach((element)=>{
    // Add an event listener to the element that runs markComplete
    element.addEventListener('click', markComplete)
})
// Create an array from itemCompleted and run a function on each element
Array.from(itemCompleted).forEach((element)=>{
    // Add an event listener to the element that runs markUnComplete
    element.addEventListener('click', markUnComplete)
})
// Create async function deleteItem
async function deleteItem(){
    // Set itemText to the innertext of the second child of the same parent node of the clicked element
    const itemText = this.parentNode.childNodes[1].innerText
    // run this code
    try{
        // set response to the call to deleteItem
        const response = await fetch('deleteItem', {
            // set method to delete
            method: 'delete',
            // set a header to content-type of application/json
            headers: {'Content-Type': 'application/json'},
            // set itemFromJS to itemText and send in request body as json
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // set data to result of response, converted to object
        const data = await response.json()
        // log datqa
        console.log(data)
        // reload page
        location.reload()
    // if async function fails, log error
    }catch(err){
        console.log(err)
    }
}
// Create async function markComplete
async function markComplete(){
    // Create itemText, set to text of the second child node of the parent of the clicked element
    const itemText = this.parentNode.childNodes[1].innerText
    // run this code
    try{
        // Create response, set to the result of a call to markComplete path
        const response = await fetch('markComplete', {
            // Set method to put
            method: 'put',
            // Set content-type in header to application/json
            headers: {'Content-Type': 'application/json'},
            // Set itemFromJS to itemText, send in request body as JSON
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Set data to the response to the request, converted to object
        const data = await response.json()
        // Log the object
        console.log(data)
        // Reload the page
        location.reload()
        }
    // If the function fails, log the error
    catch(err){
        console.log(err)
    }
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
            // Add a json object to the body, setting itemFromJS to itemText
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Set data to the response converted into an object
        const data = await response.json()
        // log the object
        console.log(data)
        // reload the page
        location.reload()

    }
    // If the async function fails, log the error
    catch(err){
        console.log(err)
    }
}