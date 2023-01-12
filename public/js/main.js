const deleteBtn = document.querySelectorAll('.fa-trash')       /// selects all delete buttons and stores it on the variable
const item = document.querySelectorAll('.item span') //selects all items with condition of incomplete
const itemCompleted = document.querySelectorAll('.item span.completed')   //selects all items with condition of class = completed

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)           //assigns eventlistener for delete button, incompleted and completed tasks
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){  //callback for delete button event listener, used to send delete request to server
    const itemText = this.parentNode.childNodes[1].innerText        //grabs the name of the task from the DOM
    try{
        const response = await fetch('deleteItem', {        //sends a delete request with the route /deleteItem with method DELETE
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText  //sends the name of task along with the request
            })
          })
        const data = await response.json() //awaits response back from the server
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){  //callback for incomplete task event listener (the text of the task itself), used to send delete update request to server
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',      //sends a update request with the route /markComplete with method UPDATE
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
    const itemText = this.parentNode.childNodes[1].innerText //The same request but done for changing complete tasks to incomplete, route is different 
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