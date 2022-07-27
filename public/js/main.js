// grabs buttons/elements with the classes in paratheses from html and saves them as variables
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// Creates an array & calls deleteItem() function when element with deleteBtn class is clicked
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Creates an array & calls markComplete() function when element with item class is clicked
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// Creates an array & calls markUncomplete() function when element with itemCompleted class is clicked
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// async deleteItem function - runs asynchronously
async function deleteItem(){
    // this is the thing that was clicked, parentNode is a list item, childNodes are list item & trash can icon - childNodes[1] grabs second item in array - and grabs text from todo item next to trash can icon
    const itemText = this.parentNode.childNodes[1].innerText
    // try catch that attempts to do something else catch error
    try{
        // await is part of the async loop - fetch request - fetch in server.js
        const response = await fetch('deleteItem', {
            // calls delete method to delete stuff below it
            method: 'delete',
            // way of identifying specific item to be deleted
            headers: {'Content-Type': 'application/json'},
            // text from itemText variable above is passed in and tells which text to delete from database
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          // waits until it gets response from server and then reloads page
        const data = await response.json()
        console.log(data)
        location.reload()

    // if function cannot delete & try fails then it will return an error
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    // this is the thing that was clicked, parentNode is a list item, childNodes are list item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // fetch request for markComplete function 
        const response = await fetch('markComplete', {
            // calls put method 
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            // text from itemText variable above is passed in and tells which text to mark completed
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          // waits until it receives a response and reloads page
        const data = await response.json()
        console.log(data)
        location.reload()
          // if something goes wrong, then error is logged
    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    // this is the thing that was clicked, parentNode is a list item, childNodes are list item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // calls update function to mark a task as uncomplete
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            // text from itemText variable above is passed in and tells which text to mark uncomplete
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          // returns response and reloads page
        const data = await response.json()
        console.log(data)
        location.reload()
          // if something goes wrong then error is logged
    }catch(err){
        console.log(err)
    }
}