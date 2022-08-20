// array of all the trash icons
const deleteBtn = document.querySelectorAll('.fa-trash')
// array of all the todos
const item = document.querySelectorAll('.item span')
// array of all the todos marked as completed
const itemCompleted = document.querySelectorAll('.item span.completed')

//Adding event listeners to all the arrays defined above with different functions
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    //getting text from the clicked trash can
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sending text to the backend and wait for response, to delete the clicked element
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

async function markComplete(){
    //getting text from the clicked element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sending text to the backend and wait for response, updating database
        const response = await fetch('markComplete', {
            //Hard coding the body sent
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

async function markUnComplete(){
    //getting text from the clicked element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sending text to the backend and wait for response, updating database
        const response = await fetch('markUnComplete', {
            //Hard coding the body sent
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