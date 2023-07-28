const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{ // Delete buttons call deleteItem
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{ // Incomplete list items call markComplete
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{ // Complete list items call markUncomplete
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText  // Obtain task name typed in
    try{
        const response = await fetch('deleteItem', { // Sends delete request to server
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText // Text (task name) added to req body sent to the server - Identifies doc to be deleted
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload() // Page refresh after update

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // Obtain task name typed in
    try{
        const response = await fetch('markComplete', { // sends /markComplete put request to server
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText  // Text (task name) added to req body sent to the server → Identifies doc to be updated
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()  // Page refresh after update

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // Obtain task name typed in
    try{
        const response = await fetch('markUnComplete', { // sends /markUncomplete put request to server
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText // Text (task name) added to req body sent to the server → Identifies doc to be updated
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload() // Page refresh after update

    }catch(err){
        console.log(err)
    }
}