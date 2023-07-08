const deleteBtn = document.querySelectorAll('.fa-trash') //Delete button (span) from index.ejs is stored in a variable
const item = document.querySelectorAll('.item span') //Each item in the to-do list from index.ejs is stored in a variable
const itemCompleted = document.querySelectorAll('.item span.completed') //Each item that is marked as completed with the class of "completed" in the index.ejs file is stored in a variable

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) //For each delete button per item, the function deleteItem() is added to it on a click.
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) //For each item in the to-do list, the function markComplete() is added to it on a click
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) //For each item which has the class of "completed" (to show its completed), the markUncomplete() method is added to it on a click.
})

async function deleteItem(){ //this function is called on every delete button on the to-do list. It is asynchronous (runs independently)
    const itemText = this.parentNode.childNodes[1].innerText //The innerText (content) of the item at hand is stored in a variable.
    try{
        const response = await fetch('deleteItem', { // the endpoint of /deleteItem is sent to the server, in this case, the server will delete that to-do list item from the mongoDB collection.
                                                        // it is primarily looking for the body of itemFromJS to delete. In this case, it's the itemText above. This fetch also send's a DELETE request
                                                        // to the server for deletion of that to-do list item. 
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json() //Will return either an error (console.error(error) or a console.log of 'Todo Deleted' and a response.json of 'Todo Deleted'
        console.log(data) //shows above comment
        location.reload() //reloads the page to see the to-do list item removed

    }catch(err){
        console.log(err) //catch if itemText not found or the response failed.
    }
}

async function markComplete(){ 
    const itemText = this.parentNode.childNodes[1].innerText //same as deleteItem, gets text of to-do list item
    try{
        const response = await fetch('markComplete', { //same as deleteItem, except the endpoint is fetching /markComplete from the server, with a request of PUT (update) using the body of itemFromJS which 
                                                        // is itemText. Also updateOne instead of deleteOne. Adds class of "completed" to the item. 
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json() //Will return either 'Marked Complete' in the response.json and console OR console.error if it fails.
        console.log(data) // ^^^
        location.reload() // reloads page

    }catch(err){
        console.log(err) //same as deleteItem 
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //same as above
    try{
        const response = await fetch('markUnComplete', { //This method fetches the endpoint of /markUnComplete from the server, sends a put request using the body from itemFromJS, which is itemText.
                                                        // the class of "completed" is removed from the item. Uses updateOne for the mongo db collection
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json() //Will return either 'Marked Complete' in the response.json and console OR console.error if it fails.
        console.log(data) // ^^^^
        location.reload() //reloads page

    }catch(err){
        console.log(err) // same as deleteItem
    }
}
