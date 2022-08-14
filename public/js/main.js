const deleteBtn = document.querySelectorAll('.fa-trash') // selects all delte buttons
const item = document.querySelectorAll('.item span') // selects all "items" and saves them in an array
const itemCompleted = document.querySelectorAll('.item span.completed') //an array of all the completed items based on class complted

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})// use array constructor and loop thorugh each element in the array  and add event listener, and attach call back which deletes the item

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})// use array constructor and loop thorugh each element in the array  and add event listener, and attach call back which changes status completed

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})// use array constructor and loop thorugh each element in the array  and add event listener, and attach call back which changes status to uncomplete

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