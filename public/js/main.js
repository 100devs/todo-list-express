// set constants to access DOM elements
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// add event listeners to every delete button
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// add event listeners to every incomplete todo item
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// add event listeners to every completed todo item
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// deletes 1 item clicked on from database
async function deleteItem(){
    // grab name of todo item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send request to delete item by passing itemText into body of JSON request
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // log that request is finished and refresh page
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// updates 1 item clicked on as complete
async function markComplete(){
    // grab name of todo item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send request to update item by passing itemText into body of JSON request
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        // log that request is finished and refresh page
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// updates 1 item clicked on as uncomplete
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send request to update item by passing itemText into body of JSON request
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        // log that request is finished and refresh page
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}
