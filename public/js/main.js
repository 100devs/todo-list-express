const deleteBtn = document.querySelectorAll('.fa-trash') // gets a list of all buttons that are marked as trash
const item = document.querySelectorAll('.item span') // gets the items from the webpage
const itemCompleted = document.querySelectorAll('.item span.completed') // gets the items that are marked complete

Array.from(deleteBtn).forEach((element)=>{ // adds a delete item event to all buttons of the deletebtn
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{ // adds a mark item complete event to all buttons of items
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{ // adds a mark item incomplete event to all buttons of items
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText // gets the inner text of the item that was clicked to be deleted
    try{
        const response = await fetch('deleteItem', { // attempts to send a delete item request to the server. 
            method: 'delete',
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

async function markComplete(){ 
    const itemText = this.parentNode.childNodes[1].innerText  // gets the inner text of the item that was clicked to be marked complete
    try{
        const response = await fetch('markComplete', { // attempts to update an item request to the server
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

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText  // gets the inner text of the item that was clicked to be
    try{
        const response = await fetch('markUnComplete', {  // attempts to update an item request to the server
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