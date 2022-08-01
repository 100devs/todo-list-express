//looks for the classes and elements specified in parantheses
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//iterate through every item in the element in deleteBtn array (any element with the class .fa-trash aka all trash can icons)
Array.from(deleteBtn).forEach((element)=>{ //for each element in the array, do this: 
    element.addEventListener('click', deleteItem) //add an event listener, when clicked on, call deleteItem function
})

//iterate through every item in the element in item array (any element with the class .item span aka all elements in the todo list)
Array.from(item).forEach((element)=>{ //for each element in the array, do this:
    element.addEventListener('click', markComplete) //add an event listener, when clicked on, call markComplete function
})

//iterate through every item in the itemCompleted array (any element with the class .item span.completed aka all elements in the completed list)
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) //add an event listener, when clicked on, call itemCompleted function 
})

//delete an item
//makes a call to the server to remove a document from the database
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //refers to the target item and store it in the itemText variable
    try{ //try these operations, if you can't, do what's in the catch
        const response = await fetch('deleteItem', {  //send fetch request to /deleteItem route, configure response from server
            method: 'delete', //specify http method
            headers: {'Content-Type': 'application/json'}, //type of file being returned
            body: JSON.stringify({ //converts the db collection object into json
              'itemFromJS': itemText //store target item from the client as the value to the itemFromJS key
            })
          })
        const data = await response.json() //wait for the json response from the server, store it into the data variable
        console.log(data) //log the response from the server
        location.reload() //reload the page on the client side

    }catch(err){ //catch error, if any
        console.log(err) //logs error
    }
}

//marks an item as completed
//makes a call to the server to set the "completed" value of a document in the database to "true"
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //grabs the li and its span child. Referring to target item. Stores it in the variable "itemText"
    try{ //try these operations, if you can't, do what's in the catch
        const response = await fetch('markComplete', { //fetch promise route is /markComplete on server.js, configure response from server.js
            method: 'put', //specify http method
            headers: {'Content-Type': 'application/json'}, //type of file being returned
            body: JSON.stringify({ //convert db collection object to json
                'itemFromJS': itemText //store the target item from the client as a value to the itemFromJS key
            })
          })
        const data = await response.json() //wait for json response from the server, store it into the data variable
        console.log(data) //log the response from the server 
        location.reload() //reload the page

    }catch(err){ //catch error, if any
        console.log(err) //logs error
    }
}

//marks an item as uncompleted aka unchecks the completed box
//makes a call to the server to set the "complete" property of a document in the database to "false"
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //grabs the li and its span child. Referring to target item. Stores the innerText in itemText
    try{ //try these operations, if you can't, do what's in the catch
        const response = await fetch('markUnComplete', { //send fetch request to the /markUncomplete route, configure response from server
            method: 'put', //specify http method
            headers: {'Content-Type': 'application/json'}, //specify type of reponse
            body: JSON.stringify({ //convert to json
                'itemFromJS': itemText //store the target item from the client as a value to the itemFromJS key
            })
          })
        const data = await response.json() //wait for the server response, store it in the data variable
        console.log(data) //log the server response
        location.reload() //reload the page

    }catch(err){ //catch error, if any
        console.log(err) //log error
    }
}