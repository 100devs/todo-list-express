// select html element
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// call deleteItem function when each delete btn is clicked
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// call markComplete function when each html element is clicked
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// call markUncompleted when each html element is clicked
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// call functions when html elements is clicked
async function deleteItem(){
    // store todo item in a variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //send request to delete element click
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // js to return when the response returns
        const data = await response.json()
        // log response when request completes
        console.log(data)
        // reload page
        location.reload()

    }catch(err){
        // log any error
        console.log(err)
    }
}

async function markComplete(){
    // store todo item in a variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send request to server
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // js to return when the response returns 
        const data = await response.json()
        // log response to console
        console.log(data)
        // reload page
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// function to mark as uncomplete
async function markUnComplete(){
    // store todo item in variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send request to server
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // js to return when response is returned
        const data = await response.json()
        // log response to console  
        console.log(data)
        // reload page
        location.reload()

    }catch(err){ // catch and log any error
        console.log(err)
    }
}
