const deleteBtn = document.querySelectorAll('.fa-trash') //create list of deleteBtn 
const item = document.querySelectorAll('.item span') //create list of span items
const itemCompleted = document.querySelectorAll('.item span.completed') //create list of span items completed

Array.from(deleteBtn).forEach((element)=>{//create an array from the deleteBtn node list
    element.addEventListener('click', deleteItem) //add a listener on the delete icon 
})

Array.from(item).forEach((element)=>{//create an array from the item node list
    element.addEventListener('click', markComplete) //add a listener on the complete text
})

Array.from(itemCompleted).forEach((element)=>{ //create an array from the itemCompeleted node list
    element.addEventListener('click', markUnComplete) //add a listener on the uncomplete text
})

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