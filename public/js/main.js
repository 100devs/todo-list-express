//constant variable for the trash button, to clear all of the tasks. Delete button
const deleteBtn = document.querySelectorAll('.fa-trash')

//the container for each task
const item = document.querySelectorAll('.item span')

//selects the item (or task) and mark it as completed.(followed with a strikethrough, from css)
const itemCompleted = document.querySelectorAll('.item span.completed')

//listens for the click from the delete button for each item
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//listens for the click for marking the completion of a task
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//listens for the click for to mark an incomplete task that was marked as complete by accident or a task that was previously marked as complete that isn't. Just undoing the mark of completion
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//code for the deleting items, with its on separate fetch
async function deleteItem(){
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

//code for placing a new task or 'putting' a new task or adding a new task to the to-do list
async function markComplete(){
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

//code for marking a task as incomplete, another put 
async function markUnComplete(){
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