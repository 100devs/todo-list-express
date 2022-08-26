//Places a delete button on the document that has the class of fa-trash
const deleteBtn = document.querySelectorAll('.fa-trash')
//Assigns variable item for all spans with the item class
const item = document.querySelectorAll('.item span')
//Assigns variable for all spans with item class with completed property
const itemCompleted = document.querySelectorAll('.item span.completed')


//Places a event listener on each delete button by making an array and using forEach loop, on click will initiate the delete item function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//Places a event listener on each item by making an array and using forEach loop, on click will initiate the markComplete function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//Places a event listener on each item by making an array and using forEach loop, on click will initiate the markUncomplete function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//Function to delte an item
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //takes the text from the li tag and the child node is the span. 
    try{ //request to api to delete the document from the data base that matches the inner text, sends a request body to server
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload() //after complete reloads to initiate a get request

    }catch(err){
        console.log(err)
    }
}
// function to mark complete
async function markComplete(){ 
    const itemText = this.parentNode.childNodes[1].innerText //takes the text from the li tag and the child node is the span. 
    try{ //initiates a put request, sends the inner text with the req so the api can find the matching document in the database
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload() //after update is complete, the data is console logged and the page is refreshed to initiate a get request

    }catch(err){
        console.log(err)
    }
}
//Function to mark incomplete
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText  //takes the text from the li tag and the child node is the span. 
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText //takes the inner text from req body and sends it to api to find the document to change the complete property to incomplete
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload() //after update is complete, the data is console logged and the page is refreshed to initiate a get request

    }catch(err){
        console.log(err)
    }
}