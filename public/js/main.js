//MAKES DELETE BUTTON VAR THE ICON
const deleteBtn = document.querySelectorAll('.fa-trash')
//
const item = document.querySelectorAll('.item span')
// MAKES ITEMCOMP VAR
const itemCompleted = document.querySelectorAll('.item span.completed')

//LISTENS FOR CLICK AND TRIGGERS DELETEITEM FUNCTION WHEN CLICKED
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//LISTENS FOR CLICK AND TRIGGERS MARKCOMPLETE FUNCTION WHEN CLICKED
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//LISTENS FOR CLICK AND TRIGGERS MARKUNCOMPLETE FUNCTION WHEN CLICKED
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//FUNCTION DELETES ITEMS. LOOKS FOR ITEM TO DELETE, DELETES IF THERE, AND RELOADS PAGE. SENDS ERR IF NEEDED.
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

//FUNCTION MARKS ITEMS AS COMPLETE. LOOKS FOR ITEM TO UPDATE, UPDATES IF THERE, AND RELOADS PAGE. SENDS ERR IF NEEDED.
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

//FUNCTION MARKS ITEMS AS INCOMPLETE. LOOKS FOR ITEM TO MARK AS INCOMPLETE, UPDATES IF THERE, AND RELOADS PAGE. SENDS ERR IF NEEDED.
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