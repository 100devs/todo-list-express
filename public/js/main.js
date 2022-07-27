const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')


//adding event listener to all tasks for delete
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//adding event listener to mark complete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//adding event listener to mark un complete
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//sending data to server to delete item
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //getting text
    try{
        const response = await fetch('deleteItem', {
            method: 'delete', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ //parsing data as JSON
              'itemFromJS': itemText
            })
          })
        const data = await response.json()  //awaiting response and proceed further
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//sending data to server to mark complete
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

//sending data to mark uncomplete
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