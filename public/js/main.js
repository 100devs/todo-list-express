
// Find all html elements with the class 'fa-trash' and save them as an array to the deleteBTN variable
const deleteBtn = document.querySelectorAll('.fa-trash')
// Find all html elements with the class '.item span' and save them as an array to the item variable
const item = document.querySelectorAll('.item span')

// Find all html elements with the class 'item span.completed' and save them as an array to the itemCompleted  variable
const itemCompleted = document.querySelectorAll('.item span.completed')


// creating an array from the node list 'deleteBN', then assigning each item an event listener
//that runs deleteItem on click.
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Add event listners to items from the selector above. 
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//Add event listeners to item completed span 
Array.from(itemCompleted).forEach((element)=>{ //creating an array and adding event listner to each item.
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){  //async function. 
    const itemText = this.parentNode.childNodes[1].innerText //look inside list item to get text content of the item specified. 
    try{ //set up try and catch block for error handling. 
        const response = await fetch('deleteItem', { //cerateds a response var that waits on fetch to get the
		//data from the result of the deleteMethod
            method: 'delete', //crud method for the route
            headers: {'Content-Type': 'application/json'}, //content expected which is json. 
            body: JSON.stringify({ //declare message content being passed, and make a string of the content.
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item.
            })
          })
        const data = await response.json() //waiting on json response 
        console.log(data) //log result.
        location.reload() //reloads page to update display. 

    }catch(err){
        console.log(err) //if error occurs, log err to console. 
    }
}

async function markComplete(){ //asynch function. 
    const itemText = this.parentNode.childNodes[1].innerText //sets item text to be the content in the item to marked complete. 
    try{ //try catch and error handling. 
        const response = await fetch('markComplete', { //response var that awaits result of the markComplete route. 
            method: 'put', //setting crud type to update. 
            headers: {'Content-Type': 'application/json'}, //content expected is JSON. 
            body: JSON.stringify({  //Turning content of the list item to a string. 
                'itemFromJS': itemText //Innertext of the element selected will be saved here. 
            })
          })
        const data = await response.json()  //waiting on JSON from the response to be converted. 
        console.log(data)  //log the result to the console. 
        location.reload() //Reload page to update view. 

    }catch(err){
        console.log(err)  //catch and log errors if nothing resolves. 
    }
}

async function markUnComplete(){ //asynch function. 
    const itemText = this.parentNode.childNodes[1].innerText //looks inside selected list item and grabs innerText. 
    try{  //try catch for error handling. 
        const response = await fetch('markUnComplete', {  //Resonse var awaits the results of  fetch / put operation.  
            method: 'put', //CRUD method/ update. 
            headers: {'Content-Type': 'application/json'}, //Type expected should be JSON. 
            body: JSON.stringify({  //turn content being passed into a string. 
                'itemFromJS': itemText //Content of the list item will be named itemFromJS. 
            })
          })
        const data = await response.json()  //waiting on the response 
        console.log(data) //console log the result. 
        location.reload() //reload page to show new content. 

    }catch(err){
        console.log(err)  //error handling. 
    }
}