//Select all delete buttons (trash icons)
const deleteBtn = document.querySelectorAll('.fa-trash')

//Select all to-do item spans (that are not completed)
const item = document.querySelectorAll('.item span')

//Select all to-do item spans that are marked as completed
const itemCompleted = document.querySelectorAll('.item span.completed')

//Add event listeners to all delete buttons
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) //When clicked, run deleteItem()
})

//Add event listeners to all completed items
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)//When clicked, run markComplete()
})

//Add event listeners to all incomplete items 
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)//When clicked, run markUnComplete()
})


//Async function to delete an item 
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText//Get the text of the to-do item
    try{
        const response = await fetch('deleteItem', {
            method: 'delete', //HTTP delete method
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText //Send the item text to the server 
            })
          })
        const data = await response.json() //wait for server response 
        console.log(data) //log the response
        location.reload() //reload the page to see changes 

    }catch(err){
        console.log(err) //log any error 
    }
}


//Async function to mark item as complete 
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

//Async function to mark item as incomplete 
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