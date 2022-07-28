//store all nodes that have the matching classes inside of a variable
//all .fa-trash classes
const deleteBtn = document.querySelectorAll('.fa-trash')
//all nodes that are spans inside of .item
const item = document.querySelectorAll('.item span')
//all nodes that are considered completed
const itemCompleted = document.querySelectorAll('.item span.completed')

//create a new Array, and add an event listener to each item.
Array.from(deleteBtn).forEach((element)=>{
    //event listener listens for clicks and then runs deleteItem callback fn
    element.addEventListener('click', deleteItem)
})
//create a new Array, and add an event listener to each item, takes in all uncompleted items
Array.from(item).forEach((element)=>{
    //event listener listens for clicks and then runs markComplete callback fn
    element.addEventListener('click', markComplete)
})
//create a new Array, and add an event listener to each item, takes in all completed items
Array.from(itemCompleted).forEach((element)=>{
    //event listener listens for clicks and then runs markUncomplete callback fn
    element.addEventListener('click', markUnComplete)
})

//async function that sends delete request to server
async function deleteItem(){
    //this refers to the element the function is being called on
    //select textcontent of the targeted node
    const itemText = this.parentNode.childNodes[1].innerText
    //try to delete item
    try{
        //make delete request using fetch
        const response = await fetch('deleteItem', {
            //specifies the method to be delete
            method: 'delete',
            //specifies data as json
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //converts response to json so that it can be console logged
        const data = await response.json()
        console.log(data)
        //reloads page
        location.reload()
    //error handler in case request fails
    }catch(err){
        console.log(err)
    }
}

//function makes request to the server that marks document as completed
async function markComplete(){
    //this refers to the element the function is being called on
    //select textcontent of the targeted node
    const itemText = this.parentNode.childNodes[1].innerText
    //try to update items completed property
    try{
        const response = await fetch('markComplete', {
            //specifies the method to be update
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()
    //error handler in case request fails
    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    //select textcontent of the targeted node
    const itemText = this.parentNode.childNodes[1].innerText
    //try to update items completed property
    try{
        const response = await fetch('markUnComplete', {
            //specifies the method to be update
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()
    //error handler in case request fails
    }catch(err){
        console.log(err)
    }
}