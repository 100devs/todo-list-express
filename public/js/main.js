// declares a variable which holds the value of .fa-trash (which is an icon) for deleting todos
const deleteBtn = document.querySelectorAll('.fa-trash')
// selects incomplete todos
const item = document.querySelectorAll('.item span')
//selects completed todos
const itemCompleted = document.querySelectorAll('.item span.completed')

// adds an event listener to each deleteBtn
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//adds an event listener for each incomplete button
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//adds an event listener for each complete button
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// asynchronous function which sends a request to the server for deleting a todo
async function deleteItem(){
    // selects this object's childnode[1]'s innertext
    const itemText = this.parentNode.childNodes[1].innerText
    //uses fetch to send a 'delete' request to the server listening for the route 'deleteItem' in a JSON format.
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // waits for the response to complete
        const data = await response.json()
        // logs data returned from the response into the console
        console.log(data)
        // reloads the page
        location.reload()
    //error handler
    }catch(err){
        console.log(err)
    }
}

// asynchronous function which sends an update request to the server for marking an item as complete
async function markComplete(){
    // selects this object's childNode[1]'s innertext
    const itemText = this.parentNode.childNodes[1].innerText
    // sends a fetch request to /markComplete
    try{
        const response = await fetch('markComplete', {
            //update request
            method: 'put',
            //states the type of 'content'
            headers: {'Content-Type': 'application/json'},
            //sends as a JSON object
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //waits for the response to resolve
        const data = await response.json()
        //logs the result of the response
        console.log(data)
        //reloads the page
        location.reload()
    //error handler
    }catch(err){
        console.log(err)
    }
}

//another async function which is similar to the one above but updates the state of the 'item' to incomplete rather than complete
async function markUnComplete(){
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