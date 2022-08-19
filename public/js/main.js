
//declare a variable to store the array of selected font awesome icon class
const deleteBtn = document.querySelectorAll('.fa-trash')
// declare a variable to store the array of selected span class
const item = document.querySelectorAll('.item span')
// declare a variable to store the array of selected span completed class
const itemCompleted = document.querySelectorAll('.item span.completed')

//loop through the array of delete buttons and listen for an event listener on each item, if clicked delete the item 
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//loop through array of items and listen for an event listener on each item, if clicked mark completed
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//loop through array of items completed and listen for an event listener on each item, if clicked mark uncompleted
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})


// async/await function to delete item 
async function deleteItem(){
    //store the innerText of the item to a variable for which the delete button is clicked by getting its second childNode
    //from its parentNode
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //fetch the response to the 'deleteItem' route on the server by requesting the delete method 
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            //stringify object containing itemText
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //response from server saying 'Todo Deleted'
        const data = await response.json()
        //console log the response
        console.log(data)
        //refresh page 
        location.reload()
    //if there's some error catch and console log it
    }catch(err){
        console.log(err)
    }
}

//async/await function to mark item complete
async function markComplete(){
    //store the innerText of the item to a variable for which the text is clicked by getting second childNode
    //from its parentNode 
    const itemText = this.parentNode.childNodes[1].innerText
    try{
         //fetch the response to the 'markComplete' route on the server by requesting the put method 
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            //stringify object containing itemText
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //response from server saying 'Marked Complete'
        const data = await response.json()
        //console log the response
        console.log(data)
        //refresh page
        location.reload()
    //if there's some error catch and console log it
    }catch(err){
        console.log(err)
    }
}
//async/await function to mark item uncomplete
async function markUnComplete(){
    //store the innerText of the item to a variable for which the text is clicked by getting second childNode
    //from its parentNode 
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //fetch the response to the 'markComplete' route on the server by requesting the put method 
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            //stringify object containing itemText
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //response from server saying 'Marked Complete'
        const data = await response.json()
        //console log the response
        console.log(data)
        //refresh page
        location.reload()
     //if there's some error catch and console log it
    }catch(err){
        console.log(err)
    }
}