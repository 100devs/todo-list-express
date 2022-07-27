// delcaring variables for all of the elements to interact with
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// adding event listeners to all of the delete buttons
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// adding eventing listeners to all of the incomplete items
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// adding eventing listeners to all of the completed items
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// sending a request to delete an item
async function deleteItem(){
    // specifies which item will be deleted
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // fetch request with item information for deletion
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // receives response from server
        const data = await response.json()
        console.log(data)
        // refreshes the page after receiving a response
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// make a put request for marking an item completed
async function markComplete(){
    // determines item to mark complete
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // sends request to server with the item selected for completion
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        // receives response from the server
        const data = await response.json()
        console.log(data)
        // refreshes the page after receiving a response
        location.reload()
        
    }catch(err){
        console.log(err)
    }
}

// make a put request for marking an item incomplete
async function markUnComplete(){
    // determines item to mark incomplete
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // sends request to server with the item selected for incompletion
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // receives response from the server
        const data = await response.json()
        console.log(data)
        // refreshes the page after receiving a response
        location.reload()

    }catch(err){
        console.log(err)
    }
}