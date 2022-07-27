
///* declare variables for DOM elements *///

const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')




//////* BASIC TO-DO APP FUNCTIONS *//////


///*Create array with given class, add eventlistener, and initiate action when clicked*///

// DELETE BUTTON//
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//COMPLETE BUTTON//
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//UNCOMPLETE BUTTON//
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})



//DELETE ITEM ASYNC FUNCTION//
async function deleteItem(){

    // define list item to access
    const itemText = this.parentNode.childNodes[1].innerText

    //build-out delete fetch for list-item data to delete
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })

        //access data from fetch and delete
        const data = await response.json()
        console.log(data)
        location.reload()

    // error catch
    }catch(err){
        console.log(err)
    }
}



//COMPLETE ITEM ASYNC FUNCTION//
async function markComplete(){

    // define list item to access
    const itemText = this.parentNode.childNodes[1].innerText

    //build-out markComplete fetch to access list-item data to mark as complete
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })

        //access returned data from fetch and mark as complete
        const data = await response.json()
        console.log(data)
        location.reload()

    // error catch
    }catch(err){
        console.log(err)
    }
}



//MARK UNCOMPLETE ASYNC FUNCTION//
async function markUnComplete(){

    // define list item to access
    const itemText = this.parentNode.childNodes[1].innerText

    //build-out markUnComplete fetch to access list-item data to mark as uncomplete
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })

        //access returned data from fetch and mark as uncomplete
        const data = await response.json()
        console.log(data)
        location.reload()

    // error catch    
    }catch(err){
        console.log(err)
    }
}