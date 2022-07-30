//  declare variables 
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// set the event listener at all the delete buttons, when clicked, it triggers deleteItem function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// set the event listener at all the item buttons, when clicked, it triggers markComplete function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// set the event listener at all the itemCompleted buttons, when clicked, it triggers markUnComplete function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// making a function to deleteItem once trashcan is clicked
async function deleteItem(){
    //targets to do list item from html
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // trying to deleteItem via fetch request
        const response = await fetch('deleteItem', {
            // delete method to get rid of the item
            method: 'delete',
            // telling the app that it is using json data
            headers: {'Content-Type': 'application/json'},
            // taking the body of the request and stringifying it is in JSON format 
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // awaiting data aka the json being sent 
        const data = await response.json()
         //logging json data to the console
        console.log(data)
        //reloading the current document
        location.reload()

        // catching an error if there is one and logging it to the console
    }catch(err){
        console.log(err)
    }
}

// making a function to mark an item completed 
async function markComplete(){
    // identify the todo list item name from html
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // sent an update request to the server and waiting for its response
        const response = await fetch('markComplete', {
            // put method to update the item
            method: 'put',
            // telling the app that it is using json data
            headers: {'Content-Type': 'application/json'},
            // taking the body of the request and stringifying it is in JSON format
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
         //logging json data to the console
        console.log(data)
        // reloading the current document
        location.reload()

    // catching an error if there is one and logging it to the console
    }catch(err){
        console.log(err)
    }
}
// function to unmark completed item 
async function markUnComplete(){
     // identify the todo list item name from html
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            //put method to update the item
            method: 'put',
            // taking the body of the request and stringifying it is in JSON format 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // awaiting data aka the json being sent 
        const data = await response.json()
        //logging json data to the console
        console.log(data)
         //reloading the current document
        location.reload()

    // catching an error if there is one and logging it to the console
    }catch(err){
        console.log(err)
    }
}