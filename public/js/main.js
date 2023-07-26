// declaring variables for DOM elements
const deleteBtn = document.querySelectorAll('.fa-trash') //delete button 
const item = document.querySelectorAll('.item span') //todo items 
const itemCompleted = document.querySelectorAll('.item span.completed') //todo items checked off/completed


//array of delete buttons with event listeners for each button.
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//an array of todo items in DOM with event listeners
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//an array of completed items with event listeners
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})


//function to delete the items / why: when items are completed, the items should be removed from the DOM. 
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //getting todo item text

    // sending request to fetch API
    try{
        const response = await fetch('deleteItem', { //assigning fetch (returns promise) result to response variable
            method: 'delete', //delete request
            headers: {'Content-Type': 'application/json'},//assigning contect type to header to json
            body: JSON.stringify({ //set request body and setting it to json
              'itemFromJS': itemText //setting itemsFromJs property to itemText
            })
          })
        const data = await response.json() //reading the response
        console.log(data) //data confirmation
        location.reload()//refreshing page

    }catch(err){
        console.log(err) //print error if there is an error
    }
}


//function handling mmarkComplete items
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // grabbing todo item text
    try{
        const response = await fetch('markComplete', { //assigning fetch(returns promise) result to response variable
            method: 'put', //put request
            headers: {'Content-Type': 'application/json'}, //assigning content type of header to json
            body: JSON.stringify({ //set request body and setting it to json
                'itemFromJS': itemText //setting itemFromJS propert to itemText
            })
          })
        const data = await response.json() //reading response
        console.log(data) //confirmation
        location.reload() //refresh page

    }catch(err){
        console.log(err)//print error if error
    }
}

//function handling markUnComplete items
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //grabb todo item text
    try{
        const response = await fetch('markUnComplete', { //assignign fetch (returns promise) result to response variable
            method: 'put', //put request
            headers: {'Content-Type': 'application/json'}, //assigning content type of header to json
            body: JSON.stringify({ //set request body and setting it to json
                'itemFromJS': itemText //set itemFromJS
            })
          })
        const data = await response.json() //reading response and setting to data variable
        console.log(data) //confirmation
        location.reload() //refreshing page

    }catch(err){
        console.log(err) //print error if error
    }
}