//Select all the delete buttons
const deleteBtn = document.querySelectorAll('.fa-trash')
//select all list items with span class
const item = document.querySelectorAll('.item span')
//select all the completed items
const itemCompleted = document.querySelectorAll('.item span.completed')

//Add event listener to all delete buttons
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//Add eventlistener to each item so that it can turn "completed" on clicking
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//Add eventlistener to each item so that it can turn "Incompleted" on clicking
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//Define the function for deleting an item
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


//Define the function for marking an item as "complete"
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

//Define the function for marking an item as "Incomplete"
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

