const deleteBtn = document.querySelectorAll('.fa-trash') //selects the fa-trash class element and sets it to deletebtn
const item = document.querySelectorAll('.item span') //selects the item span class element and sets it to item
const itemCompleted = document.querySelectorAll('.item span.completed') //selects the item span.completed class element and sets it to itemCompleted

// add event listener to delete button, create an array of all delete buttons
Array.from(deleteBtn).forEach((element)=>{
    // event listener so any time a user clicks something with .fa-trash runs deleteItem (event listener to each delete button)
    element.addEventListener('click', deleteItem)
})

// array from anything with class .item span
Array.from(item).forEach((element)=>{
    // event listener for click, runs markComplete
    element.addEventListener('click', markComplete)
})

// array for anything with itemCompleted
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// deleteItem is the name of the function, async tells method to run in the background
async function deleteItem(){
    //reference to database? for the parent/child nodes. innerText references the content of the Node
    //this refers to the trash can icon. the parent is the list item the trash can belongs to. child nodes are all the child nodes under that list item, grabbing inner text from index 1   
    const itemText = this.parentNode.childNodes[1].innerText
    // try/catch
    // attempt to get this thing and if it doesn't work, throw the error
    try{
        // await tells it to wait until the fetch request has completed
        const response = await fetch('deleteItem', {
            // deleetay method (CRUD)
            method: 'delete',
            // delete the item text with this content type
            headers: {'Content-Type': 'application/json'},
            // converts into a json string
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // wait for the data to be gotten, then delete
        const data = await response.json()
        console.log(data)
        // reload the page
        location.reload()
    // if the above wasn't successful log error  
    }catch(err){
        console.log(err)
    }
}

//Mark task completed function, async so runs in background
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //creates a variable to hold the item text, assigns it the value of the text of the childNode of the element clicked? basically click the taskand it becomes 'this'
    //try/catch. like above attempts the method if it doesn't work throws back an error
    try{
        //await tells it to wait until the fetch is completed
        const response = await fetch('markComplete', {
            //put method (update)
            method: 'put',
            //looking for objects with this content type
            headers: {'Content-Type': 'application/json'},
            //converts into json string
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //   wait for data to return, expecting response in json
        const data = await response.json()
        //log the response
        console.log(data)
          //reload the page
        location.reload()
          //something went wrong, throws an error 
    }catch(err){
        //logs error
        console.log(err)
    }
}

//If task is marked complete, click again to return it to the list by showing uncomplete
async function markUnComplete(){
    //create variable to hold the task text from the list
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //awaiting fetch from the server
        const response = await fetch('markUnComplete', {
            method: 'put', //put method (update)
            headers: {'Content-Type': 'application/json'}, //set content type to json
            body: JSON.stringify({ //send item text to server in JSON encoded string
                'itemFromJS': itemText //send item text to server
            })
          })
        const data = await response.json() //get response from server, in json encoded string
        console.log(data) //log response from server
        location.reload() //reload page

    }catch(err){ //if error log error
        console.log(err) //log error
    }
}