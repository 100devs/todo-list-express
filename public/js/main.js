// delete button
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
// creates an array from delete buttons and for each of them adds even listener 
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// 
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
// deletes the item
async function deleteItem(){
    // 
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
// marks complete, takes list item, put - update, fetch req. to the server 
async function markComplete(){
    // locates the item and uses it's inner text saving it to a variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // we make a fetch request to the url /markComplete, we set method and headers and then we change the body to JSON this connects to what's on a server 
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        // refresh ejs
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