const deleteBtn = document.querySelectorAll('.fa-trash') // create deleteBtn variable for each item's trash can icon
const item = document.querySelectorAll('.item span') // create item variable that stores all spans with class of .item
const itemCompleted = document.querySelectorAll('.item span.completed') // variable that stores all spans with class of .item and span.completed

Array.from(deleteBtn).forEach((element)=>{ // create array from deleteBtn variable
    element.addEventListener('click', deleteItem) // add delete click event
})

Array.from(item).forEach((element)=>{ // create item array 
    element.addEventListener('click', markComplete) // add completion click event
})

Array.from(itemCompleted).forEach((element)=>{ // create item array 
    element.addEventListener('click', markUnComplete)// add incomplete click event
})

async function deleteItem(){ // create asyncronous delete function
    const itemText = this.parentNode.childNodes[1].innerText // declare variable that holds the text from the span that was clicked
    try{
        const response = await fetch('deleteItem', { // make fetch request and store in response 
            method: 'delete', // method type
            headers: {'Content-Type': 'application/json'}, // headers
            body: JSON.stringify({ // converts object to string
              'itemFromJS': itemText //  item being converted and sent via request to server
            })
          })
        const data = await response.json() // get response from server as json
        console.log(data) // logs data to console
        location.reload() // reload window to render all undeleted items

    }catch(err){
        console.log(err) // log any errors in console
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // get text from span and store as itemText
    try{
        const response = await fetch('markComplete', { // fetch request sent to markComplete route
            method: 'put', // update method
            headers: {'Content-Type': 'application/json'}, // define what type of content to show
            body: JSON.stringify({ // convert object to string
                'itemFromJS': itemText // item to be sent to markComplete route
            })
          })
        const data = await response.json() //response from server.js
        console.log(data) // log the item data to console
        location.reload() // reload updated page to show changes

    }catch(err){
        console.log(err) // log any errors if unsuccessful
    }
}

async function markUnComplete(){ // mark item as incomplete if already clicked complete
    const itemText = this.parentNode.childNodes[1].innerText // get text from span
    try{
        const response = await fetch('markUnComplete', { // send to markUnComplete route
            method: 'put', // update method
            headers: {'Content-Type': 'application/json'}, // headers of content to show
            body: JSON.stringify({ // convert object to string
                'itemFromJS': itemText // item to be sent to route
            })
          })
        const data = await response.json() // gets response from server as json 
        console.log(data) // log json data
        location.reload() // reload to update page

    }catch(err){
        console.log(err) // log error if failure
    }
}