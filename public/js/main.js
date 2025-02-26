const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{
<<<<<<< HEAD
    element.addEventListener('click', deleteItem) //smurf for delete
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) //smurf for update
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) //smurf for update
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //get current form value
=======
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
>>>>>>> 8247adf50f08bd10000a520d0c12dd01ccaa776b
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

async function markComplete(){
<<<<<<< HEAD
    const itemText = this.parentNode.childNodes[1].innerText //grab thing we just clicked on
    try{
        const response = await fetch('markComplete', { //convert itemText to JSON and send to server
=======
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
>>>>>>> 8247adf50f08bd10000a520d0c12dd01ccaa776b
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