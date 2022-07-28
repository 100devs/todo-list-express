//defining query selector for trash button
const deleteBtn = document.querySelectorAll('.fa-trash')
//define item as a span 
const item = document.querySelectorAll('.item span')
//define query selector for itemcomplete
const itemCompleted = document.querySelectorAll('.item span.completed')

//for each loop add event listener that fires on click for deleteItem
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//for each loop add event listener that fires on click for markComplete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//for each loop add event listener that fires on click for mark UnComplete
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//function for deleting item from todos
async function deleteItem(){
    //defining a todos item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //fetch request to delete item
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //define a variable for response from server.js
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//function to mark item as complete
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //fetch request to mark Complete 
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //define a variable for response from server.js
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//function to mark item as uncomplete
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //fetch request to mark uncomplete
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //define a variable for response from server.js
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}