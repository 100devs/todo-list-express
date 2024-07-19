const deleteBtn = document.querySelectorAll('.fa-trash') // variable for elements with trash can
const item = document.querySelectorAll('.item span') // variable for items
const itemCompleted = document.querySelectorAll('.item span.completed') // variable for items marked as completed

// event listeners for delete requests
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// event listeners for PUT requests /markCompleted
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// event listeners for PUT requests /markUnComplete
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// delete request
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText // text from the span
    try{
        const response = await fetch('deleteItem', { // making a request to server, route is /deleteItem
            method: 'delete', // set method to delete
            headers: {'Content-Type': 'application/json'}, // tells server to expect JSON
            body: JSON.stringify({ // convert object into JSON string
              'itemFromJS': itemText // setting content of body to the variable declared above, naming it 'itemFromJS'
            })
          })
        const data = await response.json() // returns a promise resolved to a JSON object
        console.log(data)
        location.reload() // refreshes page

    }catch(err){
        console.log(err) // if there is an error it will be shown in the console
    }
}

// PUT request
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // text from the span
    try{
        const response = await fetch('markComplete', { // making a request to server, route /markComplete
            method: 'put', // method set to put (update)
            headers: {'Content-Type': 'application/json'}, // tells server to expect JSON
            body: JSON.stringify({ // convert object into JSON string
                'itemFromJS': itemText // setting content of body to the variable declared above, naming it 'itemFromJS'
            })
          })
        const data = await response.json() // returns a promise resolved to a JSON
        console.log(data)
        location.reload() // refreshes page

    }catch(err){
        console.log(err) // if there is an error it will be shown in the console
    }
}

// PUT request
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // text from the span
    try{
        const response = await fetch('markUnComplete', { // making a request to server, route /markUnComplete
            method: 'put', // method set to put (update)
            headers: {'Content-Type': 'application/json'}, // tells server to expect JSON
            body: JSON.stringify({ // convert object into JSON string
                'itemFromJS': itemText // setting content of body to the variable declared above, naming it 'itemFromJS'
            })
          })
        const data = await response.json() // returns a promise resolved to a JSON
        console.log(data)
        location.reload() // refreshes page

    }catch(err){
        console.log(err) // if there is an error it will be shown in the console
    }
}