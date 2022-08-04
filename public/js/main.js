const deleteBtn = document.querySelectorAll('.fa-trash')                // the const variable for storing items that will be marked for deletion 
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{                              // looping through the array of elements to check if any of them are marked for deletion 
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{                                   // looping through the array of elements to check if any of them are to be marked completed
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{                          // looping through the array of items marked completed to check if any of them are to be reversed as uncomplete
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){                                   // looping through the array of elements to check if any of them are to be marked for deletion
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
