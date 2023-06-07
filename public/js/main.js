const deleteBtn = document.querySelectorAll('.fa-trash') //Selecting all trash icons
const item = document.querySelectorAll('.item span') //Selecting all spans within the item parent
const itemCompleted = document.querySelectorAll('.item span.completed') //Selecting all the spans with completed class

Array.from(deleteBtn).forEach((element)=>{ 
    element.addEventListener('click', deleteItem) //Adding an event listener on each of the trashcan icons
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) //Adding an event listener to each of the spans
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) //Adding an event listener to each span with a completed
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //Selecting the item in the Todo list
    try{
        const response = await fetch('deleteItem', { //Submitting the delete request
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json() //Storing the server response in the variable data
        console.log(data) //Printing the response to the console
        location.reload() //Refreshing the page

    }catch(err){
        console.log(err) //If the request unsuccessful log the error to the console
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //Selecting the item in the Todo list
    try{
        const response = await fetch('markComplete', { //Submitting the PUT request to the server
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json() //Storing the server response to the variable data
        console.log(data) //Printing the response to the console
        location.reload() //Refreshing the page

    }catch(err){
        console.log(err) //If the request unsuccessful log the error to the console
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //Selecting the item in the Todo list
    try{
        const response = await fetch('markUnComplete', { //Submitting the PUT request to the server
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json() //Storing the server response to the variable data
        console.log(data) //Printing the response to the console
        location.reload() //Refreshing the page

    }catch(err){
        console.log(err) //If the request unsuccessful log the error to the console
    }
}