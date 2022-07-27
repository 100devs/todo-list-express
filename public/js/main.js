// this variable is our trash can icon
const deleteBtn = document.querySelectorAll('.fa-trash')
// this variable will hold our item(s)
const item = document.querySelectorAll('.item span')
// this variable will hold our completed item(s)
const itemCompleted = document.querySelectorAll('.item span.completed')
// this will call the deleteItem function on click
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// this will call the markComplete function on click
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//this will call the markUncomplete function on click
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//this function will delete an item 
async function deleteItem(){
    //this variable wil hold the text of each item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //calls deleteItem on the following
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //this will wait for the response to the deleteItem request and parse it
        const data = await response.json()
        //this will console log the above data
        console.log(data)
        //this will reload the page with our new updates
        location.reload()
    //this will handle errors
    }catch(err){
        //this will console log the error
        console.log(err)
    }
}
//this function will update the todo item as completed
async function markComplete(){
    //this variable will hold the text that belongs to the item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //calls markComplete on the following
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //this variable will hold the response to the markComplete request and parse it
        const data = await response.json()
        //this will console log the data
        console.log(data)
        //this will reload the page with our new updates
        location.reload()
    //this will handle errors
    }catch(err){
        //this will console log the errors
        console.log(err)
    }
}
//this function will update the item as uncomplete
async function markUnComplete(){
    //this variable will hold the text that belongs to the item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //calls markUncomplete on the following
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //this variable will wait for the response to the markUncomplete request and parse it
        const data = await response.json()
        //this will console log the data
        console.log(data)
        //this will reload the page with our new updates
        location.reload()
    //this will handle errors
    }catch(err){
        //this will console log the errors
        console.log(err)
    }
}
