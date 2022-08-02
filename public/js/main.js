//declare and initialize variables for interactive elements. 
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
//adding an eventlistener for each delete button. 
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//adding an eventlistener for each mark complete button.
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//adding an eventlistener for each mark uncomplete button.
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    //declaring a variable to hold the todo item.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            //convert item to JSON object, sending it to server.js to find in the collection and delete. 
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload() //reload page

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    //declaring a variable to hold the todo item.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            //convert item to JSON object, sending it to server.js to find in the collection to update
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
    //declaring a variable to hold the todo item.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            //convert item to JSON object, sending it to server.js to find in the collection to update
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