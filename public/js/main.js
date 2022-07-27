const deleteBtn = document.querySelectorAll('.fa-trash') // Grab all delete icons
const item = document.querySelectorAll('.item span') // Grab all items
const itemCompleted = document.querySelectorAll('.item span.completed') // Grab all completed items

//  Add event listeners to every delete button, item, and completed items
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Define function for deleting an item
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText // Grab the content of the item clicked
    try{
        const response = await fetch('deleteItem', { // Send a fetch request to server with deleteItem as the endpoint
            method: 'delete', // Define properties for the fetch
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json() //await response from server
        console.log(data) //log after deleting
        location.reload() // Reload the page to see updated data

    }catch(err){
        console.log(err) // Catch any errors
    }
}

// Function for marking an item as completed
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', { //Same as above but with different endpoint and method set to put
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

// Function for marking an item as uncompleted
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', { // Same as above, different endpoint
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