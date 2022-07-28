// Storing all elements i nthe DOM with class '.fa-trash'
const deleteBtn = document.querySelectorAll('.fa-trash')

// storing all pargraphs elements inside the '.item' class inside a node list
const item = document.querySelectorAll('.item p')

// storing all pargraphs elements inside the '.item' class that also have a 'completed class inside a node list
const itemCompleted = document.querySelectorAll('.item p.completed')

// Creating an array from the node list 'deleteBtn', then assigning each with an event listener that goes to function 'deleteItem'
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Creating an array from the node list 'item', then assigning each an event listener that goes to function 'markComplete'
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// Creating an array from the node list 'itemCompleted' , then each an assigning an event listener that goes to function 'markUnComplete'
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// A async function to delete the todo item associated with the delete ocon we clicked
async function deleteItem(){
    // get the text of the todo item and saving it in a var 'itemText'
    const itemText = this.parentNode.children[0].innerText
    try{
        // sending a delete request tot the server with the following parameters
        const response = await fetch('deleteItem', {
            //Specifying that this is a delete request
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            // define the key 'itemFromJS' as the text from the todo item
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // wait for a response from the server
        const data = await response.json()
        console.log(data) // display server response 
        location.reload() // reload the page

    }catch(err){
        console.log(err) // basic error catch
    }
}

//Async function to mark a todo item as complete
async function markComplete(){
    //Geting the text of the todo item and storing it in itemText
    const itemText = this.parentNode.children[0].innerText
    // Send a put request to the server
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            // Define the key 'itemFromJS' as the text from the todo item
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data) // display the server's response
        location.reload() // reload the page

    }catch(err){
        console.log(err) // basic error catch
    }
}

// Async function to mark a complete todo list
async function markUnComplete(){
    // Getting the text of the todo item and 
    const itemText = this.parentNode.children[0].innerText
    try{
        // Sending a  put request to the server
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
             // Define the key 'itemFromJS' as the text from the todo item
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data) // Display server response
        location.reload() // refresh the page

    }catch(err){
        console.log(err) // basic error catch
    }
}