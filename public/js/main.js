//declaring variables for DOM elements 
const deleteBtn = document.querySelectorAll('.fa-trash') //delete button
const item = document.querySelectorAll('.item span') //todo Items
const itemCompleted = document.querySelectorAll('.item span.completed') //completed item

//creating array of delete buttons and adding event listeners for each 
Array.from(deleteBtn).forEach((element)=>{ 
    element.addEventListener('click', deleteItem)
})

//creating array from todo items in the DOM and adding event listeners for each 
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//creating array from completed items in the DOM and adding event listeners for each 
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})


//function to handle deleting items
async function deleteItem(){ 
    const itemText = this.parentNode.childNodes[1].innerText  //grabbing todo item text
    //sending request with fetch API
    try{
        const response = await fetch('deleteItem', { //assigning fetch (returns promise) result to response variable 
            method: 'delete', //delete request
            headers: {'Content-Type': 'application/json'}, //assigning content type of header to json
            body: JSON.stringify({ //set request body and setting it to json 
              'itemFromJS': itemText //setting itemFromJS property to itemText
            })
          })
        const data = await response.json() //reading response and setting to data variable
        console.log(data) //confirmation
        location.reload() //refreshing page

    }catch(err){ 
        console.log(err) //print error if error 
    }
}
//function to handle markComplete items
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //grabbing todo item text
    try{
        const response = await fetch('markComplete', { //assigning fetch (returns promise) result to response variable
            method: 'put', //put request
            headers: {'Content-Type': 'application/json'}, //assigning content type of header to json
            body: JSON.stringify({ //set request body and setting it to json
                'itemFromJS': itemText //setting itemFromJS property to itemText
            })
          })
        const data = await response.json() //reading response and setting to data variable
        console.log(data) //confirmation
        location.reload() //refreshing page

    }catch(err){
        console.log(err) //print error if error 
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //grabbing todo item text
    try{
        const response = await fetch('markUnComplete', { //assigning fetch (returns promise) result to response variable
            method: 'put', //put request
            headers: {'Content-Type': 'application/json'}, //assigning content type of header to json
            body: JSON.stringify({  //set request body and setting it to json
                'itemFromJS': itemText //setting itemFromJS property to itemText
            })
          })
        const data = await response.json() //reading response and setting to data variable
        console.log(data)  //confirmation
        location.reload() //refreshing page

    }catch(err){
        console.log(err) //print error if error 
    }
}