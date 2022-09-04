//selects all trash can icons in the DOM by their shared class, and stores them in an array
const deleteBtn = document.querySelectorAll('.fa-trash')
//selects all item spans in the DOM by their shared class, and stores them in an array
const item = document.querySelectorAll('.item span')
//selects all item spans that have the class 'completed', and stores them in an array
const itemCompleted = document.querySelectorAll('.item span.completed')

//adds deleteItem method to each html element in deleteBtn array
//items can always be deleted no matter their state
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//adds markComplete method to each html element in item array
//if an item isn't complete, it can be marked as completed
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//adds markUnComplete method to each html element in itemCompleted array
//if an item is complete, it can be marked as not completed
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    //finds the text of the method's parent element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sends a request to the express server with URL '/deleteItem'
        const response = await fetch('deleteItem', {
            //lets the server know this is a 'delete' request
            method: 'delete',
            //lets the server know the request's data type
            headers: {'Content-Type': 'application/json'},
            //this data will be passed on by the server to the DB
            //the DB will use this as index to find out what item to delete
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //pausing the function while it waits for the response
        const data = await response.json()
        //display the response in the console
        console.log(data)
        //re-renders the 'index.ejs' view
        location.reload()

    }catch(err){
        //if there's an error, display it in the console
        console.log(err)
    }
}

async function markComplete(){
    //finds the text of the method's parent element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sends a request to the express server with URL '/markComplete'
        const response = await fetch('markComplete', {
            //lets the server know this is a 'put' request
            method: 'put',
            //lets the server know the request's data type
            headers: {'Content-Type': 'application/json'},
            //the DB will use this as index to find out what item to mark complete
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        //pausing the function while it waits for the response
        const data = await response.json()
        //display the response in the console
        console.log(data)
        //re-renders the 'index.ejs' view
        location.reload()

    }catch(err){
        //if there's an error, display it in the console
        console.log(err)
    }
}

async function markUnComplete(){
    //finds the text of the method's parent element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sends a request to the express server with URL '/markUnComplete'
        const response = await fetch('markUnComplete', {
            //lets the server know this is a 'put' request
            method: 'put',
            //lets the server know the request's data type
            headers: {'Content-Type': 'application/json'},
            //the DB will use this as index to find out what item to mark uncomplete
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        //pausing the function while it waits for the response
        const data = await response.json()
        //display the response in the console
        console.log(data)
        //re-renders the 'index.ejs' view
        location.reload()

    }catch(err){
        //if there's an error, display it in the console
        console.log(err)
    }
}