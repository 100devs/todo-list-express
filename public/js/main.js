const deleteBtn = document.querySelectorAll('.fa-trash') //Declare variables so we can interact with the ejs/html later
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{ //Makes a event listener for each item to be deleted
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{ //Makes a event listener to mark as complete
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{ //Makes a event listener to mark as uncomplete
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){ //When changed on the ejs file, tells the server waht to delete, logs data, and then reloads the page once we get a response from the server
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', {
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

async function markComplete(){ //Sends the info from the innerText event listener to the server to update an item as completed and gets a response from the server
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
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){ //same thing as above, but for marking as not completed
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