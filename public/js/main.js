// Sets the three interaction object types with query selectors.
const deleteBtn = document.querySelectorAll('.fa-trash') // Anything with the fa-trash class
const item = document.querySelectorAll('.item span') // spans that have the item class.
const itemCompleted = document.querySelectorAll('.item span.completed') // spans that have the 'item' and 'completed' classes.

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) // Adds an event listener to each delete button.
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) // adds an event listener to each 'item' span.
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) // adds an event listener to each completed item span.
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText // Selects the inner text of the specific task.
    try{
        // Send a delete request with json data, assigning the text from the triggering node to itemFromJS 
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json() // Reads the response as JSON data and logs it.
        console.log(data)
        location.reload() // Reloads the current location.

    }catch(err){
        console.log(err) // Logs ze error.
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
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