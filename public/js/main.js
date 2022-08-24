const deleteBtn = document.querySelectorAll('.fa-trash') // trash cans. list of nodes, not an array, it's an iterable though
const item = document.querySelectorAll('.item span') // incomplete items. list of nodes
const itemCompleted = document.querySelectorAll('.item span.completed') // completed items. list of nodes

// add event listener to each trash can to be able to delete todo
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// add event listener to each incomplete item to be able to mark as completed
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// add event listener to each complete item to be able to mark as incomplete
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
// function that handles the deletion of items
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText // selects the text of the item
    try{
        const response = await fetch('deleteItem', { // makes a DELETE request to /deleteItem
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText // body of the request with the item to delete
            })
          })
        const data = await response.json() // awaits the json response from the server
        console.log(data)
        location.reload() // reload the page

    }catch(err){
        console.log(err) // console log error if there any
    }
}
// function that marks item as completed
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // get text of the item
    try{
        const response = await fetch('markComplete', { // make PUT request to /markComplete
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText // request body with the item to mark as complete
            })
          })
        const data = await response.json() // await json response form the server
        console.log(data)
        location.reload() // reload page

    }catch(err){
        console.log(err) // console log error if there any
    }
}
// function that marks item as incomplete
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // get item text
    try{
        const response = await fetch('markUnComplete', { // make PUT request to /markUnComplete
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText // request body with the item to mark as incomplete
            })
          })
        const data = await response.json() // await json response from the server
        console.log(data)
        location.reload() // reload the page

    }catch(err){
        console.log(err) // console log error if there any
    }
}