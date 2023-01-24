//variable for choosing the trashbin
const deleteBtn = document.querySelectorAll('.fa-trash')
//variable for choosing the task on the list
const item = document.querySelectorAll('.item span')
//variable for task/items that have the completed class
const itemCompleted = document.querySelectorAll('.item span.completed')


//smurf for clicking the deleted bin that links it to the corrisponding function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//smurf for clicking the task that links it to the corrisponding function to cross out the task
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//smurf for clicking the completed task that links it to the corrisponding function to unmark it
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    //removing the object from the DB
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
        //reloading so that app.get runs so the item does not show on the client side
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    //grabs the selected text
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
        //reloads the page (app.get)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //updating an completed task to uncompleted by connecting it to the server.js
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