// setting up varibles for event listeners for deleting and marking complete/uncomplete
const deleteBtn = document.querySelectorAll('.fa-trash')   //Selects all the documents with the class .fa-trash which  is the trash bin image. 
const item = document.querySelectorAll('.item span') //Selects every item which has the class .item and is a span.
const itemCompleted = document.querySelectorAll('.item span.completed') //Selects every item, same as above, but only those which are completed (meaning they have the class completed).

//Listening for click to delete Item 
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) //For each element in the array of all the trash cans, it adds an event listener. When the element is clicked, it triggers the function deleteItem.
})
//Listening for click to mark complete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) //Same as above, but triggers the function markComplete
})
//Function to uncomplete task
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) //Same, but different, but same. The function is markUncomplete
})


//Function (asynchronous) for delete button. Triggered by an event listener. 
async function deleteItem(){
    //selecting the item text
    const itemText = this.parentNode.childNodes[1].innerText //Grabs the inner text of those elements
    try{
        //sending the item text to the server and marking it for deletion
        const response = await fetch('deleteItem', {  //creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', //Set the CRUD method for the route. 
            headers: {'Content-Type': 'application/json'}, //Expects for a JSON content.
            body: JSON.stringify({ //Declaring the message content being pased and converting to string the JSON.
              'itemFromJS': itemText  //Setting the content of the body 
            })
          })
          //getting the response from the server with item deleted from the database
        const data = await response.json()
        //logging the response
        console.log(data)
        //reloading the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}
//event listener funtion for mark complete button
async function markComplete(){
    //selecting the item text
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sending the item text to the server marking it completed
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //getting the response from the server
        const data = await response.json()
        //logging the response
        console.log(data)
        //reloading the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}
//Function to mark as uncomplete task
async function markUnComplete(){
    //selecting the item text
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sending the item text to the server
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //getting the response from the server
        const data = await response.json()
        //logging the response 
        console.log(data)
        //reloading the page
        location.reload()

        //catching the error
    }catch(err){
        //logging the error
        console.log(err)
    }
}
