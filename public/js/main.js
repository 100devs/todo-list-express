// Creating variables on ALL element nodes that are created
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// Itterating over EVERY deleteBtn element and adding an eventListener
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Itterating over EVERY item element and adding an eventListener
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// Itterating over EVERY itemCompleted element and adding an eventListener
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Creating a delete fetch request
async function deleteItem(){
    // This = the deleteItem clicked on, its immediate parent node, and TWO childnodes down, inneText value.
    const itemText = this.parentNode.childNodes[1].innerText
    // Try this:
    try{

        // Setting the response variable to a delete method fetch request response.
        const response = await fetch('deleteItem', {
            // Sets the type of request to delete
            method: 'delete',
            // Sets the headers being sent with the request, telling what type of information it is sending (and recieving?)
            headers: {'Content-Type': 'application/json'},
            // The json information being sent, in this case the itemText variable. The server will use this to find and delete the document in the database
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //   Sets data to the json response from the server?
        const data = await response.json()
        console.log(data)
        // Reloads
        location.reload()

        // Error message
    }catch(err){
        console.log(err)
    }
}


// Fetch Update request, marking items as complete
async function markComplete(){
    // Again finding the inner text of the parentnode, and TWO childnodes down of the current markcomplete element clicked.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Fetch request to the markComplete put method on the server
        const response = await fetch('markComplete', {
            // Sets the request type
            method: 'put',
            // Sets the headers, which announces the datatypes/information being sent
            headers: {'Content-Type': 'application/json'},
            // This is the information sent with the request, as a json object. The server will use itemText to match the todo item in the database and mark it complete.
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })

        //   Sets data to the json response from the server?
        const data = await response.json()
        console.log(data)
        // Reloads
        location.reload()

    // Error message
    }catch(err){
        console.log(err)
    }
}

// Fetch Update request, marking items as UNcomplete
async function markUnComplete(){
    // Again finding the inner text of the parentnode, and TWO childnodes down of the current markcomplete element clicked.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Fetch request to the markUnComplete put method on the server
        const response = await fetch('markUnComplete', {
            // Sets the request type
            method: 'put',
            // Sets the headers, which announces the datatypes/information being sent
            headers: {'Content-Type': 'application/json'},
            // This is the information sent with the request, as a json object. The server will use itemText to match the todo item in the database and mark it complete.
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })

        //   Sets data to the json response from the server?
        const data = await response.json()
        console.log(data)
        // Reloads
        location.reload()

    // Error message
    }catch(err){
        console.log(err)
    }
}