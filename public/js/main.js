// Set a variable for the trash icon
const deleteBtn = document.querySelectorAll('.fa-trash')
// Set a variable for the span within the .item class item
const item = document.querySelectorAll('.item span')
// Set a variable that selects all spans within the .item class with the property of completed
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Async function for deleting item
async function deleteItem(){
    // Grab the todo text
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Fetch from the route deleteItem with the method delete with the body of what you'd like to delete
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //   Set the data variable to be the json response from the server
        const data = await response.json()
        // Console log the data
        console.log(data)
        // Refresh the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// Async function for marking item as complete
async function markComplete(){
    // Grab the todo text
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Make a fetch to the put method
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            // Send the itemText to the server side with the property itemFromJS
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //   Wait for the response from the server
        const data = await response.json()
        // Console log the data from the server
        console.log(data)
        // refresh the page and make another get request
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// Async function for marking item as not complete
async function markUnComplete(){
    // Grab the todo text
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Make a fetch to the put method
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            // Send the itemText to the server side with the property itemFromJS
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //   Wait for the response from the server
        const data = await response.json()
        // Console log the data from the server
        console.log(data)
        // refresh the page and make another get request
        location.reload()

    }catch(err){
        console.log(err)
    }
}