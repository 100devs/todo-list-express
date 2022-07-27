//query all buttons with class .fa-trash
const deleteBtn = document.querySelectorAll('.fa-trash')
//query all items with class .item of span
const item = document.querySelectorAll('.item span')
//query all spans with class complete that are inside .item
const itemCompleted = document.querySelectorAll('.item span.completed')

//loop through delete button and add evenet listener
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//loop through items button and add evenet listener
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})


//loop through item complete and add evenet listener
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//fetch method to deleteItem
//pulls text from item in dom
//makes fetch request to deleteitem route with method delete
//sends json object with itemText
//waits for reqsponse from server and logs the message. reloads page
//if promise fails logs error message
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

//async function mark todo item completed
//pulls item text from dom on todoitem
//makes fetch request to markcomplete route
//method: put
//forms a json body with itemtext with key 'itemsfromjs'
//awaits response from server and logs and reloads page
//logs error message
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

//async function mark todo item uncompleted
//pulls item text from dom on todoitem
//makes fetch request to markuncomplete route
//method: put
//forms a json body with itemtext with key 'itemsfromjs'
//awaits response from server and logs and reloads page
//logs error message
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