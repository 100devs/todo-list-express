// variable for deleteBtn is everywhere where the trashcan icon appears
const deleteBtn = document.querySelectorAll('.fa-trash')
// all our todos were given a class of item when rendered 
const item = document.querySelectorAll('.item span')
// items with a property 'completed' in our db were given the class completed
const itemCompleted = document.querySelectorAll('.item span.completed')

// all the trash can icons put into an array and given an event listener
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// all the items  put into an array and given an event listener
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// all the items already completed put into an array and given an event listener
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// function given to the trash icon eventListener
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

// function given to evenListener on items not yet completed
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

// function given to evenListener on items already completed
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