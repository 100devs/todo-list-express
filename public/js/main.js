// select all elemtns with class of fa-trash and assigne to deleteBtn variable.
const deleteBtn = document.querySelectorAll('.fa-trash')
// any spans inside elements with class of item are selected and assigned to variable item.
const item = document.querySelectorAll('.item span')
// any spans inside elements with class of item and those spans have class of completed are assigned to variable itemCompleted
const itemCompleted = document.querySelectorAll('.item span.completed')

// adding event listner to each/all elements from deleteBtn and on click running a deleteItem function on the particular element clicked. 
Array.from(deleteBtn).forEach((element)=>{
    // array.from above just makes an array from all things in deleteBtn and .forEach runs through array
    element.addEventListener('click', deleteItem)
})
// assigns event listeners to all spans inside elements with class of item. on click will run mark complete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// same as above but if those spans also had a class of completed will run markUncomplete function on click
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
// async functin good for letting other code run while waiting for response to continue this code.
async function deleteItem(){
    // when delete button is clicked; wherever the click occured it will try to send a fetch request to delete the item where click occured.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',  // will attempt to delete as opposed to POST
            headers: {'Content-Type': 'application/json'},     // specifies the type of content to be expected which is json
            body: JSON.stringify({  // declare the message content and convert from declared json to string. 
              'itemFromJS': itemText // setting content of message to send 'target to seek and delete' as innertext of the thing that was clicked on.
            }) 
          })
        const data = await response.json() // wait for json response from server to be converted
        console.log(data) // log result of response to console  
        location.reload() // reload page to update what is displayed.

    }catch(err){  // if an error occurs console log it. 
        console.log(err) 
    }
}
// declaring an async function
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText   
    try{
        const response = await fetch('markComplete', {
            method: 'put', // update the info on the server. 
            headers: {'Content-Type': 'application/json'}, // specifying this is json
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