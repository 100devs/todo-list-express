//declaring a variable for delete button
const deleteBtn = document.querySelectorAll('.fa-trash')
//declaring a variable for list items
const item = document.querySelectorAll('.item span')
// declaring a variable for completed task items
const itemCompleted = document.querySelectorAll('.item span.completed')



//a loop to create event listeners for delete function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//a loop to create event listeners for mark complete function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//a loop to create event listeners for mark uncomplete function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//creating an async function...
async function deleteItem(){
    //declaring a variable to the list item in the DOM
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // declaring a variable to get a delete response from the server (deleteItem method)
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //declare a data variable to console log json
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
            // declaring a variable to get a markComplete response from the server (mark complete method)

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

async function markUnComplete(){
                // declaring a variable to get a markUncomplete response from the server (mark Uncomplete method)

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