// set variable for the delete button
const deleteBtn = document.querySelectorAll('.fa-trash')
// set variable for the todo items
const item = document.querySelectorAll('.item span')
// set variable for the todo items that have the 'completed' class
const itemCompleted = document.querySelectorAll('.item span.completed')

// assign a 'click' event listener to all delete buttons and all todo items
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// when user clicks delete button, run async function
async function deleteItem(){

    // store the todo item string that the delete button corresponds to in a variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // when user accesses 'deleteItem' route,  run an await fetch request
        const response = await fetch('deleteItem', {
            // set delete as the request method
            method: 'delete',
            // specify the type of data in the request to be sent as a JSON
            headers: {'Content-Type': 'application/json'},
            // convert the todo item string into a JSON string
            // assign the string to a property
            // store the property key value pair in the request's 'body' object
            body: JSON.stringify({
              'itemFromJS': itemText
            })
        })
        // store the promise that the delete method in the backend responded with in a variable
        const data = await response.json()
        // print response to the console
        console.log(data)
        // reload page; this will trigger a new get request at the main page
        location.reload()
        
    // catch error, if any, during the executon of the try...catch statement
    }catch(err){
        console.log(err)
    }
}

// when user clicks a todo item that does not have the 'completed' class, run async function
async function markComplete(){

    // store the todo item string that received the click in a variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{

        // when user accesses 'markComplete' route,  run an await fetch request
        const response = await fetch('markComplete', {
            // set put as the request method
            method: 'put',
            // specify the type of data in the request to be sent as a JSON
            headers: {'Content-Type': 'application/json'},
            // convert the todo item string into a JSON string
            // assign the string to a property
            // store the property key value pair in the request's 'body' object
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        // store the promise that the put method in the backend responded with in a variable
        const data = await response.json()
        // print response to the console
        console.log(data)
        // reload page; this will trigger a new get request at the main page
        location.reload()

    // catch error, if any, during the executon of the try...catch statement
    }catch(err){
        console.log(err)
    }
}

// when user clicks a todo item that has the 'completed' class, run async function
async function markUnComplete(){

    // store the todo item string that received the click in a variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        
        // when user accesses 'markUncomplete' route,  run an await fetch request
        const response = await fetch('markUnComplete', {
            
            // set put as the request method
            method: 'put',
            // specify the type of data in the request to be sent as a JSON
            headers: {'Content-Type': 'application/json'},
            // convert the todo item string into a JSON string
            // assign the string to a property
            // store the property key value pair in the request's 'body' object
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        // store the promise that the put method in the backend responded with in a variable
        const data = await response.json()
        // print response to the console
        console.log(data)
        // reload page; this will trigger a new get request at the main page
        location.reload()

    // catch error, if any, during the executon of the try...catch statement
    }catch(err){
        console.log(err)
    }
}