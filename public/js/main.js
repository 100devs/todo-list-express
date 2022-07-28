const deleteBtn = document.querySelectorAll('.fa-trash')
//sets the constant deleteBtn as font awesome trash can. 
const item = document.querySelectorAll('.item span')
//sets the constant item as any thing with the class .item or element span.
const itemCompleted = document.querySelectorAll('.item span.completed')
//sets the constant item as any thing with the class .item .completed or element span.

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//creates an array of all the items that have been clicked delete on, as a smurf is waiting to add it to the array once clicked. 

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
}) //creating an array from the item from the marked complete button. Will add items to array once the item is clicked and add it to the array 

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//creates an array of items after the item is clicked after it was already marked as complete. 

//async tells the server that it can wait before running this code, until it gets the response from the promise. 
async function deleteItem(){ 
    const itemText = this.parentNode.childNodes[1].innerText
    try{ //try means, atempth to do this thing and if you cannot, run the next thing. (catch)
        const response = await fetch('deleteItem', { //await 
            method: 'delete', //
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
//This async function markComplete, is async because it doesn't neeed to go in order.  it will  wait. 
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{//sets const itemText to the first element in thechildNode
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)//console logs data
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
        console.log(err)//if the function doesn't work it  console log's err
    }
}