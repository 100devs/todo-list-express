// selecting all trash can icons and item spans
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// looping through and adding smurf to each trash icon/span

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    // grabbing the text from the corresponding todo e.g. walk mickey
    //parentNode == li, childNode == span
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // making a fetch/request to the server with a route of /deleteItem
        const response = await fetch('deleteItem', {
            // making a delete request
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            //sending request body to tell our API which item to delete
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //waiting for response
        const data = await response.json()
        // console log response
        console.log(data)
        //getting the page to refresh and a new get request
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    // grabbing the text from the todo e.g. walk mickey
    //parentNode == li, childNode == span
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //making a fetch/request to the server with a route of /markComplete
        const response = await fetch('markComplete', {
            // making a put request to the server
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            //sends the item text within the request body to tell our API which item to update
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //await response from server.js
        const data = await response.json()
        // console log said response
        console.log(data)
        //refresh page and trigger get request
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    // grabbing text from the span to send with the request
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // sending request to server
        const response = await fetch('markUnComplete', {
            // making put request
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            //sending text within the request body
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //await response
        const data = await response.json()
        //console log response
        console.log(data)
        // reload page to send new get request
        location.reload()

    }catch(err){
        console.log(err)
    }
}