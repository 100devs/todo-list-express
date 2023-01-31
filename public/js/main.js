const deleteBtn = document.querySelectorAll('.fa-trash')// Collect all trash bins
const item = document.querySelectorAll('.item span') // collect all item spans
const itemCompleted = document.querySelectorAll('.item span.completed') // collect all item spans that are completed

Array.from(deleteBtn).forEach((element)=>{ // add event listeners to all trash bins
    element.addEventListener('click', markDeleted) // on click run markDelted function
})

Array.from(item).forEach((element)=>{ //add event listeners to all item spans
    element.addEventListener('click', markComplete) // on click run markComplete function
})

Array.from(itemCompleted).forEach((element)=>{ //all event listeners to all completed items
    element.addEventListener('click', markUnComplete) // on click run markUnComplete function 
})

async function markDeleted(){
    const itemText = this.parentNode.childNodes[1].innerText // Holds the item that the user entered. 
    try{
        const response = await fetch('deleteItem', { // send response to markDeleted
            method: 'delete',                            // it is a put request
            headers: {'Content-Type': 'application/json'}, // should be in JSON
            body: JSON.stringify({                          // send itemFromJS: itemText
              'itemFromJS': itemText
            })
          })
        const data = await response.json() // in the variable data we put the response in json
        console.log(data)                   //console.log the data
        location.reload()                   // trigger reload

    }catch(err){
        console.log(err)
    }
}
// This is a client side "delete" it is actually a put request that deletes client side, but stay in the data base. 
/*
async function markDeleted(){
    const itemText = this.parentNode.childNodes[1].innerText // Holds the item that the user entered. 
    try{
        const response = await fetch('markDeleted', { // send response to markDeleted
            method: 'put',                            // it is a put request
            headers: {'Content-Type': 'application/json'}, // should be in JSON
            body: JSON.stringify({                          // send itemFromJS: itemText
              'itemFromJS': itemText
            })
          })
        const data = await response.json() // in the variable data we put the response in json
        console.log(data)                   //console.log the data
        location.reload()                   // trigger reload

    }catch(err){
        console.log(err)
    }
}
*/
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // Holds the item that the user entered. 
    try{
        const response = await fetch('markComplete', { // make fetch request to /markComplete on backend.
            method: 'put',  // it is a put request
            headers: {'Content-Type': 'application/json'}, // in json
            body: JSON.stringify({ // send in JSON the property itemFromJS: with the itemText
                'itemFromJS': itemText
            })
          })
        const data = await response.json() // in the variable data we put the response in json
        console.log(data) // console.log the data. 
        location.reload() // trigger a reload. 

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // Holds the item that the user entered. 
    try{
        const response = await fetch('markUnComplete', { //make fetch request to markUnComplete
            method: 'put',                               // it is a put request
            headers: {'Content-Type': 'application/json'}, //should be in JSON
            body: JSON.stringify({
                'itemFromJS': itemText                      // send json object with property itemFromJS: itemText
            })
          })
        const data = await response.json()  // in the variable data we put the response in json
        console.log(data)                   // console.log the data.
        location.reload()                   // trigger a reload.

    }catch(err){
        console.log(err)
    }
}