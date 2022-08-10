//Looks for the classes and elements specified in parenthesis
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//Calls deleteItem() function on click
Array.from(deleteBtn).forEach((element)=>{
    //smurf to listen for click of trash can
    element.addEventListener('click', deleteItem)
})

//function to mark item as complete
Array.from(item).forEach((element)=>{
    //smurf to listen for click of 'todos' list item to mark as complete
    element.addEventListener('click', markComplete)
})

//function to mark item as incomplete
Array.from(itemCompleted).forEach((element)=>{
    //smurf to listen for click of 'todos' list item to remove completion mark
    element.addEventListener('click', markUnComplete)
})

//async for delete item
async function deleteItem(){
    //used to select specific item to delete
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //await response from server
        const response = await fetch('deleteItem', {
            //delete is the method used
            method: 'delete',
            //content type is application/json
            headers: {'Content-Type': 'application/json'},
            //convert to json string
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //if everything goes right..
        const data = await response.json()
        //console log data retrieved from the server
        console.log(data)
        //reload the page
        location.reload()
    
    //if item cannot be deleted display this error message
    }catch(err){
        console.log(err)
    }
}

//async function to mark task as complete
async function markComplete(){
    //select specific item to modify
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //wait for response from the server
        const response = await fetch('markComplete', {
            //method used is put/update
            method: 'put',
            //content type is application/json
            headers: {'Content-Type': 'application/json'},
            //convert to json string
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //if everything goes right..
        const data = await response.json()
        //console log data retrieved from the server
        console.log(data)
        //reload the page
        location.reload()

    //if item cannot be marked as complete display this error message
    }catch(err){
        console.log(err)
    }
}

//async function to mark completed tasks incomplete
async function markUnComplete(){
    //select specific item to modify
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //wait for response from the server
        const response = await fetch('markUnComplete', {
            //method used is put/update
            method: 'put',
            //content type is application/json
            headers: {'Content-Type': 'application/json'},
            //convert to json string
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //if everything goes right..
        const data = await response.json()
        //console log data retrieved from the server
        console.log(data)
        //reload the page
        location.reload()

    //if item cannot be marked as incomplete display this error message
    }catch(err){
        console.log(err)
    }
}