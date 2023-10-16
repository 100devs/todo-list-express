//setting up the event listeners 
//this sets up the click event to make the trash can icon the deleteBt
const deleteBtn = document.querySelectorAll('.fa-trash')
//grab the spans
const item = document.querySelectorAll('.item span')
//this grabs the spans that have already been marked as completed and therefore have the class of completed 
const itemCompleted = document.querySelectorAll('.item span.completed')

//added an event listener to each trash can 
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//adds event listeners to the spans 
//this says to go to the markComplete function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})


//delete request 
async function deleteItem(){
    //went to the parent node of li to the child node that had the span with the class of fa-trash
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sets up the route of deleteItem
        const response = await fetch('deleteItem', {
            //specifies this is a delete request
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            //sends this info in the body of the delete request to the server side
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //waiting for response from the server side JS saying it worked
        const data = await response.json()
        //console logs on the client side that the item was deleted
        console.log(data)
        //tells the website to refresh which sends a GET request back to the server
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//uses a fetch 
async function markComplete(){
    //grabs the text and sends it with the request
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            //this fetch is set to be a put request
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            //here we are hard coding the request body which gets send with the PUT request 
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //waiting for the response from the server side js
        const data = await response.json()
        //console logging to the client side that it was marked complete 
        console.log(data)
        //once it responds with the json it triggers a refresh - this refresh sends a GET request to the server
        location.reload()

    }catch(err){
        console.log(err)
    }
}


//works the same as the markComplete function above which results in removing the completed class 
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