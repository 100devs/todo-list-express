//define variables to select trash can, tasks, and completed tasks
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//event listener on the delete button
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//event listener on the task
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//event listener on completed tasks
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//function to trigger delete of task
async function deleteItem(){
    //selects the task that is being deleted
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sends delete request to backend
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //waits for response and then reloads the page
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//function to trigger change when task completed
async function markComplete(){
    //selects the task in question
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sends put request to back end
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //waits for response and then reloads
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//function to mark task uncomplete when already complete
async function markUnComplete(){
    //selects the task at hand
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //send put request to backend
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //trigger reload when response received
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}