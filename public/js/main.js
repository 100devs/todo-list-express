//learned that document.querySelectors are not js but web APIs that grab the element and assigns it to a variable
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
//creates an array from each item deleteBtn and it iterates through each item to add an event listener to each item with the function of deleteItem
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//creates an array from each list item span and adds event listener to that item so that when clicked, it triggers markComplete function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//creates an array from each markCompleted item span and assigns eventlistener to it that runs markUncomplete func on click
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//
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