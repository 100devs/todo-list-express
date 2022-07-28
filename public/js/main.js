const deleteBtn = document.querySelectorAll('.fa-trash') //Collect all the objects we'll make delete buttons,
const item = document.querySelectorAll('.item span') //items (complete and incomplete),
const itemCompleted = document.querySelectorAll('.item span.completed') //and items (completed only)

Array.from(deleteBtn).forEach((element)=>{ //And now, make each one clickable (that is, put down our smurfs)
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{ //Put down our markComplete smurfs on ALL items
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{ //Put down our markUnComplete smurfs on complete items.
    element.addEventListener('click', markUnComplete) //Does this kill the earlier markComplete smurf? This is going to be a bit hairy if it doesn't
})

async function deleteItem(){ //This function locates our item and sends a DELETE request to our server.js, which in turn talks to the database
    const itemText = this.parentNode.childNodes[1].innerText //Use some node relation jumping to get the name of our list item
    try{ //"Do, or do not, there is no try", Yoda was no web developer
        const response = await fetch('deleteItem', { //We can use await because of the earlier async keyword so this is non-blocking.
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            }) //This stuff is a request object we're defining inline here: DELETE {'itemFromJS': itemText} plus the needed headers.
          })
        const data = await response.json() //Wait around for our response (If we get one, the catch methods don't send a response)
        console.log(data) //If we get a response, put it in the log (so the user can see this in their in-browser console)
        location.reload() //And refresh the page, since only the Create request gets a redirect from the server

    }catch(err){ //If something breaks
        console.log(err) //Log the error (in the user's browser, we on the server end can't see it)
    }
}

async function markComplete(){ //This function locates our item and sends a PUT request to mark it as complete
    const itemText = this.parentNode.childNodes[1].innerText //This is almost the same as deleteItem, I'm almost tempted to sass Leon for this wet code
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            }) //Same as above, except we're using PUT instead of DELETE and going to /markComplete instead of /deleteItem
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
} //Yeh, this function has a total of three lines that are different from deleteItem(), and that's counting the line with the name of the function itself

async function markUnComplete(){ //This function is exactly the same as markComplete except it goes to a different URL. Would it be better to compact these or keep it separate? 
    const itemText = this.parentNode.childNodes[1].innerText
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