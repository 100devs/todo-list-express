// select all trash icon elements for delete functionality
const deleteBtn = document.querySelectorAll('.fa-trash')
// select all todo item text spans
const item = document.querySelectorAll('.item span')
// select all completed todo item spans
const itemCompleted = document.querySelectorAll('.item span.completed')

// add click event listeners to all delete buttons
Array.from(deleteBtn).forEach((element)=>{
    // trigger deleteItem function when trash icon is clicked
    element.addEventListener('click', deleteItem)
})

// add click event listeners to all todo item spans
Array.from(item).forEach((element)=>{
    // trigger markComplete function when item text is clicked
    element.addEventListener('click', markComplete)
})

// add click event listeners to all completed item spans
Array.from(itemCompleted).forEach((element)=>{
    // trigger markUnComplete function when completed item is clicked
    element.addEventListener('click', markUnComplete)
})

// async function to delete todo item from database
async function deleteItem(){
    // get the todo item text from the clicked element's parent
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send DELETE request to server with item text
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // parse server response
        const data = await response.json()
        console.log(data)
        // reload page to show updated todo list
        location.reload()
    }catch(err){
        // log any errors that occur
        console.log(err)
    }
}

// async function to mark todo item as completed
async function markComplete(){
    // get the todo item text from the clicked element's parent
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send PUT request to server to mark item as complete
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // parse server response
        const data = await response.json()
        console.log(data)
        // reload page to show updated todo list
        location.reload()
    }catch(err){
        // log any errors that occur
        console.log(err)
    }
}

// async function to mark todo item as incomplete
async function markUnComplete(){
    // get the todo item text from the clicked element's parent
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send PUT request to server to mark item as incomplete
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // parse server response
        const data = await response.json()
        console.log(data)
        // reload page to show updated todo list
        location.reload()
    }catch(err){
        // log any errors that occur
        console.log(err)
    }
}