//Go to the DOM and select everything with a class of fa-trash - the delete icon
const deleteBtn = document.querySelectorAll('.fa-trash')
//Go into any class item and select any paragraph inside of it
const item = document.querySelectorAll('.item p')
const itemCompleted = document.querySelectorAll('.item p.completed')

//Create an array of those items from the node list 'deleteBtn', then assigning each with an event listener that goes to the appropriate async function
Array.from(deleteBtn).forEach((element)=>{
    //Add an eventlistener and it'll go down to the async function at the bottom deleteItem
    element.addEventListener('click', deleteItem)
})

//creating an array from the node list 'item', then assigning each an event listener that goes to function 'markComplete'
Array.from(item).forEach((element)=>{
    //Add an eventlistener and it'll go down to the async function at the bottom markComplete
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    //Add an eventlistener and it'll go down to the async function at the bottom makeUncomplete
    element.addEventListener('click', markUnComplete)
})

//An async function to delete the todo item associated with the delete icon we clicked
async function deleteItem(){
    //We're getting the text of the toDo item and saving it in variable 'itemText'
    const itemText = this.parentNode.children[0].innerText
    try{
        //sending a delete request to the server with the following parameters
        const response = await fetch('deleteItem', {
            //specifying that this is a delete request
            method: 'delete', 
            headers: {'Content-Type': 'application/json'},
            //stringy = turn into a string. defining the key 'itemFromJS' as the text from the toDo item
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //Waiting for a response from the server
        const data = await response.json()
        //console logging the servers response
        console.log(data)
        //reloading the page
        location.reload()

    //basic error catch
    }catch(err){
        console.log(err)
    }
}

//Async function to mark a todo item as complete
async function markComplete(){
    //getting the text of the todo item and storing it in itemText
    const itemText = this.parentNode.children[0].innerText
    //Sending a put request to the server
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            //defining the key 'itemFromJS' as the text from the to-do item
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        //reload the page
        location.reload()

    //basic error catch
    }catch(err){
        console.log(err)
    }
}

// Async function to mark a complete todo item as incomplete
async function markUnComplete(){
    //getting the text of the todo item and storing it in itemText
    const itemText = this.parentNode.children[0].innerText
    try{
        //sending a put request to the server to mark a complete item as uncomplete
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //waiting for a response from the server
        const data = await response.json()
        //console logging the servers response
        console.log(data)
        //reload the page
        location.reload()

    //basic error catch
    }catch(err){
        console.log(err)
    }
}