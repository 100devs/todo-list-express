const deleteBtn = document.querySelectorAll('.fa-trash')//Storing all elements in the dom with class '.fa-trash' in node list
const item = document.querySelectorAll('.item p')//Storing all elemets 
const itemCompleted = document.querySelectorAll('.item p.completed')//Storing all paragrapg elements inside '.item' class
//Creating an array from the node list 'deleteBtn',then assinging an event listenter that goes to function 'deleteitem'
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//Creating an array form the node list 'item', then asgning each an event listener that goes to funcion 'markCompelte'
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//Creating an array form the node list 'item', then asgning each an event listener that goes to funcion 'markUnCompelte'
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//An asysnc function to delete the todo item associated with the delete icon we clicked
async function deleteItem(){
    //We'ew getting the text of the todo-item and saving it in variable'itemText'
    const itemText = this.parentNode.children[0].innerText
    try{
        //Sending a delete request to the server with the following parameters
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            //Defining the key 'itemFromJS' as the text from the todo item
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //Waiting for a respose from the server
        const data = await response.json()
        //Console logging the servers resonse
        console.log(data)
        //Reloading the page
        location.reload()
          //Basic error catch
    }catch(err){
        console.log(err)
    }
}
//Async function to mark a todo item as complete
async function markComplete(){
    //Getting the text of the todo item and storing it in itemText
    const itemText = this.parentNode.children[0].innerText
    try{
        //Sending a put request to the server
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            //Defining the ket 'itemsFromJs' as the text from the todo item
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //Waiting for a respose from the server
        const data = await response.json()
        //console loggin the server's response
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}
//Async function to ark a complete todo item as incomplete
async function markUnComplete(){
    const itemText = this.parentNode.children[0].innerText
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