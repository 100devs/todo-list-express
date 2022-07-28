//Short route that selects the trash cans next to each todo item.
const deleteBtn = document.querySelectorAll('.fa-trash')
//Short route to select all of the todo item spans that are children of the <li> with class "item"
const item = document.querySelectorAll('.item span')
//Adds an event listener to all of the todo item spans that are children of the <li> with class item that also has its own class of "completed"
const itemCompleted = document.querySelectorAll('.item span.completed')

//Adds an event listener to trash cans next to each todo task that executes the function deleteItem on click.
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//Adds an event listener on each uncompleted task that executes the function markComplete on click.
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//Adds an event listener on each completed task that executes the function markUnComplete on click.
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    //Targets the text of the <li> (parentNode's) child (span) of the trash can icon that was clicked.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //Triggers the app.delete method in server.js when trash can is clicked. Sends a fetch with a JSON body containing the item text targeted above.
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //Waits for a response, then console.logs it and reloads the page.
        const data = await response.json()
        console.log(data)
        location.reload()
    //Catches and console.logs any errors in the try block.
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    //Targets the innerText of the todo item when it is clicked on.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //Triggers the markComplete put method in server.js.  Sends the previously targeted text as 'itemFromJS' using a fetch request.
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //Awaits response from the database, console.logs the response, and reloads the page.
        const data = await response.json()
        console.log(data)
        location.reload()
    //Catches any errors from the try block.
    }catch(err){
        console.log(err)
    }
}

//See markComplete for line-by-line explanation, just inverts the operation.  Triggers markUnComplete in server.js for text that has already been marked as complete and toggles it back to uncompleted.
async function markUnComplete(){
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