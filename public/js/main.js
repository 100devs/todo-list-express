const deleteBtn = document.querySelectorAll('.fa-trash') //Delete button (span) from index.ejs is stored in a variable
const item = document.querySelectorAll('.item span') //Each item in the to-do list from index.ejs is stored in a variable
const itemCompleted = document.querySelectorAll('.item span.completed') //Each item that is marked as completed with the class of "completed" in the index.ejs file is stored in a variable

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) //For each delete button per item, the function deleteItem() is added to it on a click.
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) //For each item in the to-do list, the function markComplete() is added to it on a click
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) //For each item which has the class of "completed" (to show its completed), the markUncomplete() method is added to it on a click.
})

async function deleteItem(){ //this function is called on every delete button on the to-do list.
    const itemText = this.parentNode.childNodes[1].innerText //The innerText (content) of the item at hand is stored in a variable.
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
