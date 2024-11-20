// store all element with fa-trash to deleteBtn variable
const deleteBtn = document.querySelectorAll('.fa-trash')
// store all element with .item span to item variable
const item = document.querySelectorAll('.item span')
// store all element with .item span.complete to itemCompleted  variable
const itemCompleted = document.querySelectorAll('.item span.completed')


// adding event listeners to each delete button
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// adding event listeners to each item span
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// adding event listeners to each itemCompleted
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// function to delete item
async function deleteItem() {
    //get the text of the item to be deleted
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        // send a delete request to the server with the text item
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload() // reload the page to update the list of items

    }catch(err){
        console.log(err)
    }
}

// function to mark an item complete
async function markComplete() {
    //get the text of the item to be marked as complete
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload() // Reload the page to update the list

    }catch(err){
        // console.log(err)
    }
}

// function to mark an item incomplete
async function markUnComplete() {
    // get the ext of item to be mark as incomplete
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
        location.reload() // reload the page to update the list

    }catch(err){
        console.log(err)
    }
}