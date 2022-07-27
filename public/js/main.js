const deleteBtn = document.querySelectorAll('.fa-trash') //Variable for fa-trash icon class
const item = document.querySelectorAll('.item span') //Variable for item and span class
const itemCompleted = document.querySelectorAll('.item span.completed') //Variable for item, span, completed class

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
}) ///returns an new array minus deleted item
Array.from(item).forEach((element)=>{ 
    element.addEventListener('click', markComplete)
}) //Marks selected item from array complete, and returns new array

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
}) //Marks selected item from array uncomplete, and returns new array

async function deleteItem(){ //deletes todo list item 
    const itemText = this.parentNode.childNodes[1].innerText //declaring itemText variable 
    try{
        const response = await fetch('deleteItem', { //fetches deleted todo list item
            method: 'delete', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({ //converts body to JSON
              'itemFromJS': itemText
            }) 
          })
        const data = await response.json() //responds with JSON data
        console.log(data)
        location.reload() //reload page after todo list item is deleted

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){ //marks complete todo list item
    const itemText = this.parentNode.childNodes[1].innerText //declaring itemText variable 
    try{
        const response = await fetch('markComplete', { //fetches completed todo item
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ //converts body to JSON
                'itemFromJS': itemText
            })
          })
        const data = await response.json() //responds with JSON data
        console.log(data)
        location.reload() //reload page after todo list item is marked completed

    }catch(err){
        console.log(err) //error if promise fails
    }
}

async function markUnComplete(){ //marks todo list uncompleted
    const itemText = this.parentNode.childNodes[1].innerText //declaring itemText variable 
    try{
        const response = await fetch('markUnComplete', { //fetches uncompleted todo item
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ //converts body to JSON
                'itemFromJS': itemText
            })
          })
        const data = await response.json() //responds with JSON data
        console.log(data)
        location.reload() //reload page after todo list item is marked uncompleted

    }catch(err){
        console.log(err) //error if promise fails
    }
}