const deleteBtn = document.querySelectorAll('.fa-trash') //creates a deleteBtn variable and sets it all buttons with the class .fa-trash button
const item = document.querySelectorAll('.item span') //creates a item variable and sets it to all span with the class .item span
const itemCompleted = document.querySelectorAll('.item span.completed') //creates a itemCompleted variable and sets it to all span with the class .completed span

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) //creates an array of deleteBtn and loops through each button
})

Array.from(item).forEach((element)=>{ //creates an array of item and loops through each item
    element.addEventListener('click', markComplete) //adds an EventListener to each item
})

Array.from(itemCompleted).forEach((element)=>{ //creates an array of itemCompleted and loops through each itemCompleted
    element.addEventListener('click', markUnComplete) //adds an EventListener to each item
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //creates a itemText and sets it equal to the span text 
    try{
        const response = await fetch('deleteItem', { //creates a variable function a waits for the server to get the data with a fetch request
            method: 'delete', //calls the delete methed to delete a item
            headers: {'Content-Type': 'application/json'}, //tells what type of content we're sending

            body: JSON.stringify({ //covents the JS object to JSON string data
              'itemFromJS': itemText
            })
          })
        const data = await response.json() //a data variable to get the response json that todo item is deleted
        console.log(data) //console log the data that it got from the delete method
        location.reload() //reload the page

    }catch(err){
        console.log(err) //notify an error if delete method fail
    }
}

async function markComplete(){ //set the todo item to true to mark task as complete
    const itemText = this.parentNode.childNodes[1].innerText //creats a variable and sets it equal to span text
    try{
        const response = await fetch('markComplete', { //creates a variable function a waits for the server to get the data with a fetch request
            method: 'put', //calls a put request to update todo item
            headers: {'Content-Type': 'application/json'}, //tell what type of content we're sending
            body: JSON.stringify({ //covents the JS object to JSON string data
                'itemFromJS': itemText //sends the itemText that contains text to the server side
            })
          })
        const data = await response.json() //a data variable to get the response json that todo item is updated to true
        console.log(data) //console log the data that it got from the put method
        location.reload()  //reload the page

    }catch(err){
        console.log(err) //notify error if method fail
    }
}

async function markUnComplete(){ //change the status todo item to false as uncomplete
    const itemText = this.parentNode.childNodes[1].innerText //creates a variable and sets it equal to span text
    try{
        const response = await fetch('markUnComplete', { //creates a variable function a waits for the server to get the data with a fetch request
            method: 'put', //calls a put request to update todo item
            headers: {'Content-Type': 'application/json'}, //tells what type of data we're sending
            body: JSON.stringify({ //covents the JS object to JSON string data
                'itemFromJS': itemText //sends the itemText that contains text to the server side
            })
          })
        const data = await response.json() //a data variable to get the response json that todo item is updated to false
        console.log(data) //console log the data that it got from the put method
        location.reload() //reload the page

    }catch(err){
        console.log(err) //notify an error if method fail
    }
}