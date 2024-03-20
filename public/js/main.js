const deleteBtn = document.querySelectorAll('.fa-trash') //selecting all delete button
const item = document.querySelectorAll('.item span') // selecting all tasks
const itemCompleted = document.querySelectorAll('.item span.completed') // selecting only completed tasks

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) //loop through all delete btn and addEvenListener to run deleteItem fun on click
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) //loop through all tasks and addEvenListener to run markComplete fun on click
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) //loop through all completed tasks and addEvenListener to run markUnComplete fun on click
})

// this async function is responsible to delete Item
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText // extracting the text from the item to delete from its parent node
    try{
        // sending the delete request to server with item text in json payload
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // Parsed the json response received from the server
        const data = await response.json()
        // logging the data in console
        console.log(data)
        // reload the page to reflect update data after deletation
        location.reload()

    }catch(err){
        // catching the error and log in console
        console.log(err)
    }
}

// this async function make item as completed
async function markComplete(){
    // extracting the text from the item to mark complete
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // sending PUT request to the server to mark item complete
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // parsing the json data received from the server
        const data = await response.json()
        // logging the response data in console
        console.log(data)
        // reloading the page to reflect updates after deletation
        location.reload()

    }catch(err){
        console.log(err)
    }
}
// this async function unmark the completed tasks 
async function markUnComplete(){
    // extracting the text from the item to mark uncomplete
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // sending a PUT request to unmark the item
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // parsed the json response receive from the server
        const data = await response.json()
        // logging the response data in console
        console.log(data)
        // reloading the page to reflect updates after deletation
        location.reload()

    }catch(err){
        // catching the errors to log in console
        console.log(err)
    }
}
