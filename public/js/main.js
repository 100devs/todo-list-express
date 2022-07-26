// setting up varibles for event listeners for deleting and marking complete/uncomplete
const deleteBtn = document.querySelectorAll('.fa-trash')  
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//Listening for click to delete Item 
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//Listening for click to mark complete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//Function to uncomplete task
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})


//event listener function for delete button 
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
//event listener funtion for mark complete button
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
//Function to mark as uncomplete task
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