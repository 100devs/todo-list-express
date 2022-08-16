// set deleteBtn variable to select html id of fa trash 
const deleteBtn = document.querySelectorAll('.fa-trash')

/// set item as a variable html class .item and element span 
const item = document.querySelectorAll('.item span')
/// set itemCompleted variable to element of span with class of completed within an element with class of item
const itemCompleted = document.querySelectorAll('.item span.completed')

// creates an array from all items within deleteBtn. for each creates event listener
// on click that runs the function deleteItem 
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// creates an array from all items within item. for each creates event listener
// on click that runs the function markComplete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// creates an array from all items within itemCompleted. for each creates event listener
// on click that runs the function markUnComplete
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// set up async function 
async function deleteItem(){
    // declare itemText to to parentNode second child's innertext
    const itemText = this.parentNode.childNodes[1].innerText
    //try catch block for error handling
    try{
      // set response to await fetch of deleteItem from server.js
        const response = await fetch('deleteItem', {
          // method set to delete
            method: 'delete',
            // headers to set to content type: application/json
            headers: {'Content-Type': 'application/json'},
            // body set to stringify json
            body: JSON.stringify({
              //grabs text from itemFromJs and sends it to server
              'itemFromJS': itemText
            })
          })
          // set data to await the vlaue of response.json()
        const data = await response.json()
        console.log(data)
        //refresh window
        location.reload()

    }catch(err){
      // console.log errors
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