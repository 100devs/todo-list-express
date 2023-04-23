//identifies .fa-trash as deleteBtn
const deleteBtn = document.querySelectorAll('.fa-trash')
//identifies .item span as item
const item = document.querySelectorAll('.item span')
// identifies .item span.completed as itemCompleted
const itemCompleted = document.querySelectorAll('.item span.completed')

//function that goes through each of the elements in order identify the choosen element for it to be deleted
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//function that on click calls the function markComplete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//function that on click calls the function markUnComplete
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//function deleteItem()
async function deleteItem(){
//goes to up tp thiss' parentNode then down to childNodes first childs' innertext
    const itemText = this.parentNode.childNodes[1].innerText
    try{
//waits for delete item
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