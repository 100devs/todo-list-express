const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// create an array from the delete btns on each todo item and add an event listener to each one
Array.from(deleteBtn).forEach((element)=>{
    // call deleteItem on click event
    element.addEventListener('click', deleteItem)
})

// create an array from the todo items and add an event listener to each one
Array.from(item).forEach((element)=>{
    // call markComplete on click event
    element.addEventListener('click', markComplete)
})

// create an array from the completed items and add an event listener to each one
Array.from(itemCompleted).forEach((element)=>{
    // call markUnComplete on click event
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    // the corresponding todo item --> these are represented as childNodes
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send fetch request to the server sending the text of the corresponding todo item as a query param to the server
        const response = await fetch('deleteItem', {
            // set method to delete
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            // send text query param as JSON in the http req body
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // await response from server
        const data = await response.json()
        console.log(data)
        // refresh the page
        location.reload()

    }catch(err){
        // catch any errors
        console.log(err)
    }
}

async function markComplete(){
    // the corresponding todo item --> these are represented as childNodes
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send fetch request to the server sending the text of the corresponding todo item as a query param to the server
        const response = await fetch('markComplete', {
            // set method to put, indicating an update
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            // send text query param as JSON in the http req body
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          // await response from server
        const data = await response.json()
        console.log(data)
        // refresh the page
        location.reload()

    }catch(err){
        // catch any errors
        console.log(err)
    }
}

async function markUnComplete(){
    // the corresponding todo item --> these are represented as childNodes
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send fetch request to the server sending the text of the corresponding todo item as a query param to the server
        const response = await fetch('markUnComplete', {
            // set method to put, indicating an update to a db document
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            // send text query param as JSON in the http req body
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          // await response from server
        const data = await response.json()
        console.log(data)
        // refresh the page
        location.reload()

    }catch(err){
        // catch any errors
        console.log(err)
    }
}
