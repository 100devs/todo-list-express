const deleteBtn = document.querySelectorAll('.fa-trash') //assigns all elements with trash can class to a variable
const item = document.querySelectorAll('.item span') //assigns all span elements with parent that has 'item' class to a variable
const itemCompleted = document.querySelectorAll('.item span.completed') //assigns all span elements with 'completed' class and parent that has 'item' class to a variable

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
}) //creates array from all delete icons and adds click event to each item

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
}) //creates array from all html elements with item class (items on to do list) and adds click event to each item

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
}) //creates array from all html elements with 'completed' class and adds click event to each item

async function deleteItem(){ //asynchronous function for delete click event
    const itemText = this.parentNode.childNodes[1].innerText //sets text attached to delete icon to variable
    try{ //declaring try block
        const response = await fetch('deleteItem', { //creates response variable that awaits on a fetch to retrieve data from deleteItem route
            method: 'delete', //tells server to delete something
            headers: {'Content-Type': 'application/json'}, //tells server to expect JSON object in request
            body: JSON.stringify({ //declare message content being passed, stringify content
              'itemFromJS': itemText //setting content of body to the variable declared above, naming it 'itemFromJS'
            })
          })
        const data = await response.json() //setting JSON response from delete request to a variable
        console.log(data) //log result to console
        location.reload() //refresh page

    }catch(err){ //declaring catch block to display any errors thrown in try block
        console.log(err) //log error to console
    }
}

async function markComplete(){ //callback function for mark-complete click event
    const itemText = this.parentNode.childNodes[1].innerText //sets text value of click event to variable
    try{
        const response = await fetch('markComplete', { //fetching an update/put request
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText //sending above variable in body of request
            })
          })
        const data = await response.json() //setting JSON response from update/put request to a variable
        console.log(data)
        location.reload() //refresh page

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){ //callback function for mark-uncomplete click event
    const itemText = this.parentNode.childNodes[1].innerText //sets text value of click event to variable
    try{
        const response = await fetch('markUnComplete', { //fetching an update/put request
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText //sending above variable in body of request
            })
          })
        const data = await response.json() //setting JSON response from update/put request to a variable
        console.log(data)
        location.reload() //refresh page

    }catch(err){
        console.log(err)
    }
}