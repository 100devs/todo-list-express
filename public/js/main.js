//Select all element Nodes with the given class and assign to JS variables
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//Create an array from the NodeList 'deleteBtn'
//Attach an event listener to each item in the array; on click, call deleteItem function 
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//Create an array from the NodeList 'item'
//Attach an event listener to each item; on click, call markComplete function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//Create an array from the NodeList 'itemCompleted'
//Attach an event listener to each completed item; on click, call markUnComplete function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    //Get the text of the to-do item associated with this delete button
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //Make a fetch call to the /deleteItem route on the server and send the todo item text in the body of the request  
        const response = await fetch('deleteItem', {
            //use the delete HTTP method
            method: 'delete',
            //declare the content-type of the data to be sent
            headers: {'Content-Type': 'application/json'},
            //make a JSON object to send in the body 
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //await the response from the server
        const data = await response.json()
        //log the server response
        console.log(data)
        //reload the page
        location.reload()

    //catch and log any errors
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    //Get the text of the to-do item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //Make a fetch call to the /markComplete route on the server and send the todo item text in the body of the request  
        const response = await fetch('markComplete', {
            //use the PUT HTTP method
            method: 'put',
            //declare the content-type of the data to be sent
            headers: {'Content-Type': 'application/json'},
            //make a JSON object to send in the body 
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //await the response from the server
        const data = await response.json()
        //log the server response
        console.log(data)
        //reload the page
        location.reload()

    }catch(err){
        //catch and log any errors
        console.log(err)
    }
}

async function markUnComplete(){
    //Get the text of the to-do item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //Make a fetch call to the /markComplete route on the server and send the todo item text in the body of the request  
        const response = await fetch('markUnComplete', {
            //use the PUT HTTP method
            method: 'put',
            //declare the content-type of the data to be sent
            headers: {'Content-Type': 'application/json'},
            //make a JSON object to send in the body 
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //await the response from the server
        const data = await response.json()
        //log the server response
        console.log(data)
        //reload the page
        location.reload()

    }catch(err){
        //catch and log any errors
        console.log(err)
    }
}