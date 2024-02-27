// add event listener to trash bin icon
const deleteBtn = document.querySelectorAll('.fa-trash')
//set item equal to all objects on page with a class of item and tag of span
const item = document.querySelectorAll('.item span')
//select all objects that have .item tag and a span with completed class
const itemCompleted = document.querySelectorAll('.item span.completed')

//add event listener to all trash icons by creating and looping through array
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//add event listener to all items (on click will mark completed)
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//add event listener to all completed items
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//when the deleteItem function is called, this points to the target object that was clicked
//this sends a delete request to the node server
//page reloads on delete
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

//find the li that is connected through the DOM tree at the specified node
//send a delete request along with the li text
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
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

//send a PUT request to update the database as not completed
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