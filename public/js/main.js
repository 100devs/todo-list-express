// find all delete icons
const deleteBtn = document.querySelectorAll('.fa-trash')
// find all instances of a span within any class="item" element
const item = document.querySelectorAll('.item span')
// find all instances of a completed span within any class="item" element
const itemCompleted = document.querySelectorAll('.item span.completed')

// for all instances of the delete icon, give it a click listener to call deleteItem
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// for all instances of spans within class="item" elements, give it a click listener to call markComplete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// for all instances of completed items within class="item" elements, give it a click listener to markUnComplete
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// create an async function to delete items
async function deleteItem(){
    // access the parent node of a clicked icon, find its second child's inner text
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // attempt to send request to server to delete the item, 'deleteItem' is the endpoint used in this case
        const response = await fetch('deleteItem', {
            // notify server which method is supposed to be used
            method: 'delete',
            // tell the server to type of content to expect
            headers: {'Content-Type': 'application/json'},
            // create an object whose property and value can be accessed by the server, and format it into json
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // take the data the server responded with and format is as an object
        const data = await response.json()
        // log the data so we can see what exactly is sent back in the console
        console.log(data)
        // reload the current location so the most up to date content is shown
        location.reload()

    // if the server is not accepting or properly returning the requested info, tell us why
    }catch(err){
        console.log(err)
    }
}

// create an async function to mark tasks as completed
async function markComplete(){
    // find the parent node of the content that was clicked, get the text content of its second child
    const itemText = this.parentNode.childNodes[1].innerText
    // attempt to send request to server to update the data
    try{
        // create a variable to ensure the request is properly received, 'markComplete' tells the server which endpoint to use
        const response = await fetch('markComplete', {
            // notify the server which method is supposed to be used
            method: 'put',
            // let the server know what type of content to expect
            headers: {'Content-Type': 'application/json'},
            // create an object and format as json it so the server can use it
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // convert the server's response into json format
        const data = await response.json()
        // log the data received
        console.log(data)
        // reload the location with the most up to date data
        location.reload()

    // if there was any error during this process, log the error
    }catch(err){
        console.log(err)
    }
}

// make an async function to mark completed tasks as incomplete
async function markUnComplete(){
    // find the parent node of the clicked content, get the inner text of its second child
    const itemText = this.parentNode.childNodes[1].innerText
    // attempt to send request to server to update data
    try{
        // set variable to make request, 'markUnComplete' tells the server which endpoint to use
        const response = await fetch('markUnComplete', {
            // tell the server which method to use
            method: 'put',
            // tell the server which type of content to expect
            headers: {'Content-Type': 'application/json'},
            // create an object with the text and format it with json so the server can use it
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // convert the server's response into json format
        const data = await response.json()
        // log the data received from the server
        console.log(data)
        // reload the location
        location.reload()

    // if there were any issues during the update process, log the issue
    }catch(err){
        console.log(err)
    }
}