//font awesome icon becomes deleteBtn
const deleteBtn = document.querySelectorAll('.fa-trash')
//adds .item class, span selector? to item array
const item = document.querySelectorAll('.item span')
//adds .item class, span.completed selector? to itemCompleted array
const itemCompleted = document.querySelectorAll('.item span.completed')

//every deleteBtn object has event listener, runs deleteItem on click
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//every item object has event listener, runs markComplete on click
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//every itemCompleted object has event listener, runs markUnComplete on click
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//start async function deleteItem
async function deleteItem(){
    //assigns found deleteBtn innerText to constant itemText 
    const itemText = this.parentNode.childNodes[1].innerText
    //attempts
    try{
        //fetch deleteItem, delete method
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //response stored in data
        const data = await response.json()
        //logs result
        console.log(data)
        //reloads page
        location.reload()
    //prints if error    
    }catch(err){
        console.log(err)
    }
}

//start async function markComplete
async function markComplete(){
    //assigns found item innerText to constant itemText 
    const itemText = this.parentNode.childNodes[1].innerText
    //attempts
    try{
        //fetch markComplete, put method on itemText
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
    //prints if error 
    }catch(err){
        console.log(err)
    }
}
//start async function markUnComplete
async function markUnComplete(){
    //assigns found itemCompleted innerText to constant itemText 
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //fetch markUncomplete, put method on itemText
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
    //prints if error 
    }catch(err){
        console.log(err)
    }
}