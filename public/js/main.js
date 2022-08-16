const deleteBtn = document.querySelectorAll('.fa-trash') // Assign all elements with trashcan class to a variable
const item = document.querySelectorAll('.item span') // Assign all span tags with the class of item to a variable
const itemCompleted = document.querySelectorAll('.item span.completed') // Assign all spans with the class of item and completed to a variable

// Iterate through all array items and create an event listener for:
// clicking the delete item
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// clicking the mark complete item
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// clicking item to mark it as uncompleted
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// it is in another loop that happens in another loop
// deleteItem is a asynchronous callback function that gets called when the element is clicked on the page
async function deleteItem(){
    // get the value from the list item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // assign a response variable await part which waits until it does the deleteItem delete method
        const response = await fetch('deleteItem', {
            method: 'delete', // de-le-te CRUD method
            headers: {'Content-Type': 'application/json'}, // Specify content type
            body: JSON.stringify({
              'itemFromJS': itemText  // Set content to text of item
            })
          })
        const data = await response.json() // wait for a response from JSON to convert the data
        console.log(data) // log the result
        location.reload() // relolad the page - and trigger the get request

    }catch(err){ // If something fails then catch the error and log it to the console
        console.log(err)
    }
}

// Does the same thing as the deleteItem function except the method is UPDATE
async function markComplete(){
    // here the parentNode is li and childNode is span
    const itemText = this.parentNode.childNodes[1].innerText // Gets the text from Learn HTML
    try{
        const response = await fetch('markComplete', {
            method: 'put', // CRUD: UPDATE method
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// same as markComplete but it occurs when the item was clicked already
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}