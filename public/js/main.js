const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

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
    // get the task associated with the button
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // an API request
        const response = await fetch('deleteItem', {
            // specify the DELETE method
            method: 'delete',
            // specify the type of content the request is sending
            headers: {'Content-Type': 'application/json'},
            // specifying the request body by giving it a value of the task as a JSON string
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          // the response from the server
        const data = await response.json()
        console.log(data)
        // refresh the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    // get the task
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // an API request
        const response = await fetch('markComplete', {
            // a PUT method
            method: 'put',
            // type of request sent
            headers: {'Content-Type': 'application/json'},
            // body that contains a task
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