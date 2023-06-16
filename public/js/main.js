const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})//

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //parentNode = li, childNode = span. From index.ejs. The innerText is whatever is added into the span. This function runs when the trash can (deleteBtn) is clicked. 
    try{
        const response = await fetch('deleteItem', {
            method: 'delete', //delete method is used to delete the item from the database.
            headers: {'Content-Type': 'application/json'}, //headers are used to tell the server what kind of data we are sending.
            body: JSON.stringify({// JSON.stringify() is used to convert the data into a string.
              'itemFromJS': itemText
            })
          })
        const data = await response.json() //await response.json waits from the response from the server
        console.log(data) //console.log(data) prints the data in the console
        location.reload() //reloads(refreshes) the page

    }catch(err){//if something goes wrong this code gives you an error message
        console.log(err)//the error message is logged to the console.
    }
}

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