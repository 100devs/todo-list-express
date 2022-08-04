const deleteBtn = document.querySelectorAll('.fa-trash')
// The above creates the delete button, it is made to connect to the html fa-trash icon that is connected to each task
const item = document.querySelectorAll('.item span')
// The above creates an item for the todo list and assigns it an icon
const itemCompleted = document.querySelectorAll('.item span.completed')
// The above creates a completed item for the todo list and assigns it an icon that denotes a finished state

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// The above connects the deleteBtn to the act of deletion through a click event. 

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// The above takes the array that pertains to the item collection, and does a forEach function to it. The forEach selects every item that is clicked, and marks it complete.

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
// see line 16, except it takes completed items and switches them over to the collection for uncompleted items, or their original undone array

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
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
// the above async await function waits to (choose the item in the first list and inserts action from our api (utilizes delete method from our api to remove the clicked item from JS) in this case it will delete the item once the api knows which list item and html piece is deleted then publish the resulting data and refresh the page to show now a shorter list. If there is a problem publish that an error occured

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })45
            41

          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}
// the above async await function waits to (choose the item in the first list and change action from our api (utilizes put method from our api to add the clicked item from one array or collection to another) in this case it will change the item once the api knows which list item and html piece is completed then publish the resulting data aka crossed out task and refresh the page to show now a shorter list of to dos and longer of completed. If there is a problem publish that an error occured

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
// the above async await function waits to (choose the item in the first list and inserts action from our api (utilizes change method from our api to alter the clicked item from JS) in this case it will move the item from one array or collection to the other once the api knows which list item and html piece is affected and connected to which data page then publish the resulting data and refresh the page to show now a different list. If there is a problem publish that an error occured