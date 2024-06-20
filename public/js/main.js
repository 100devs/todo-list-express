const deleteBtn = document.querySelectorAll('.fa-trash')  // grabs html elements for delete buttons
const item = document.querySelectorAll('.item span') // grabs html elements for todo items
const itemCompleted = document.querySelectorAll('.item span.completed') // grabs html elements for all completed todo items

Array.from(deleteBtn).forEach((element)=>{ // loop through delete buttons
    element.addEventListener('click', deleteItem) // add deleteItem as eventListener
})

Array.from(item).forEach((element)=>{ // loop through todo list items
    element.addEventListener('click', markComplete) // add markComplete eventListener
})

Array.from(itemCompleted).forEach((element)=>{ // loop through completed items
    element.addEventListener('click', markUnComplete) // add markUnComplete eventListener
})

async function deleteItem(){    // declare deleteItem function
    const itemText = this.parentNode.childNodes[1].innerText //grabs innertext of todo item name
    try{
        const response = await fetch('deleteItem', { // try to delete selected item
            method: 'delete',   // set method to delete
            headers: {'Content-Type': 'application/json'}, // set headers
            body: JSON.stringify({  // set body to a json string
              'itemFromJS': itemText // set to the text pulled from the item
            })
          })
        const data = await response.json() // create variable of response data, waiting for response to get fetched
        console.log(data) // log json response
        location.reload() // reload page

    }catch(err){
        console.log(err) // catch and log any errors
    }
}

async function markComplete(){  // declare markComplete function
    const itemText = this.parentNode.childNodes[1].innerText // grab the text from the todo item
    try{
        const response = await fetch('markComplete', {  // try to mark selected item complete
            method: 'put',  // set method to put
            headers: {'Content-Type': 'application/json'},  // set headers
            body: JSON.stringify({  // set body to a json string
                'itemFromJS': itemText  // set to text from todo item
            })
          })
        const data = await response.json()  // create a variable for response data, wait for response fetch
        console.log(data)   // log response data to console
        location.reload()   // reload page

    }catch(err){
        console.log(err)    // catch and log any errors
    }
}

async function markUnComplete(){    // declare markUnComplete function
    const itemText = this.parentNode.childNodes[1].innerText    // grab text from todo item
    try{
        const response = await fetch('markUnComplete', {    // try to mark uncomplete
            method: 'put',  // set method to put
            headers: {'Content-Type': 'application/json'},  // set headers
            body: JSON.stringify({  // set body to a json string
                'itemFromJS': itemText  // set to text from todo item
            })
          })
        const data = await response.json()  // declare variable for response data, waiting for response fetch
        console.log(data)   // log response to console
        location.reload()   // reload page

    }catch(err){
        console.log(err)    // catch and log any errors
    }
}