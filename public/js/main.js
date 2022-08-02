const deleteBtn = document.querySelectorAll('.fa-trash') //creates a variable that holds all of the trash cans
const item = document.querySelectorAll('.item span') //creates a variable that holds all of the not completed to do list item spans
const itemCompleted = document.querySelectorAll('.item span.completed') //creates a variable that holds all of the completed to do list item spans

Array.from(deleteBtn).forEach((element)=>{ //creates an array of the trash cans and adds an event listener to each one that runs the deleteItem function when clicked
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{ //creates an array of each of the not completed items and adds an event listener that runs the markComplete function when clicked
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{ //creates an array of the completed items and adds an event listener that runs the markUncomplete function when clicked
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){ 
    const itemText = this.parentNode.childNodes[1].innerText //creates a variable that stores the text associated with the trash can 
    try{
        const response = await fetch('deleteItem', { //sends a delete request
            method: 'delete', 
            headers: {'Content-Type': 'application/json'}, //as a json object
            body: JSON.stringify({ //turns the item text into a json object that our server can send/the database can read
              'itemFromJS': itemText
            })
          })
        const data = await response.json() //if the request works we get the response stored as the data variable
        console.log(data) //console.logs the response 
        location.reload() //reloads the root path 

    }catch(err){
        console.log(err) //logs an error if the request doesn't work 
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //creates a variable that stores the text associated with whatever the user clicked
    try{
        const response = await fetch('markComplete', { 
            method: 'put', //sends a put (update) request 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload() //the rest of this code block functions the same as above 

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //this code block works the same as above except it sends a put (update) request to change the complete status from true to false 
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