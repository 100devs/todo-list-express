const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// add event listener for each delete button
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// add event listener for each item if completed
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// add event listener for each item if uncompleted
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// function to run each time the delete button is clicked
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send deleteItem URL request 
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

// function to run each time the text is clicked and the task is completed
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send markComplete URL request 
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

// function to run each time the text is clicked and the task is reverted back
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send markUncomplete URL request
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