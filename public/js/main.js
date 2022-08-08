// assigning the delete button with class 'fa-trash' to the variable deleteBtn
const deleteBtn = document.querySelectorAll('.fa-trash')
// assigning the span with class 'item' to the variable
const item = document.querySelectorAll('.item span')
// assigning the span with classes 'item' and 'completed' to the variable itemCompleted
const itemCompleted = document.querySelectorAll('.item span.completed')

//For all elements in deleteBtn array, trigger deleteItem on click
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//For all elements in item array, trigger markComplete on click
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//For all elements in the itemCompleted array, trigger markUnComplete on click
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// declaration of the asynchronous function for deleteItem
async function deleteItem(){
    //assigning itemText variable to the text content of the item that was clicked on 
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sending the delete method, with the body being the text of the item to the server
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // if that's successful assign it to data
        const data = await response.json()
        // print that response to the console
        console.log(data)
        // update the page
        location.reload()
    // if there's an error, stop the operation and print the error to the console
    }catch(err){
        console.log(err)
    }
}

// declaration of the asynchronous function for markComplete
async function markComplete(){
    //assigning itemText variable to the text content of the item that was clicked on 
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sending the put method, with the body being the text of the item to the server
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // if that's successful assign it to data
        const data = await response.json()
        // print that response to the console
        console.log(data)
        // update the page
        location.reload()
    // if there's an error, stop the operation and print the error to the console
    }catch(err){
        console.log(err)
    }
}

// declaration of the asynchronous function for markUnComplete
async function markUnComplete(){
    //assigning itemText variable to the text content of the item that was clicked on 
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sending the put method, with the body being the text of the item to the server
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // if that's successful assign it to data
        const data = await response.json()
        // print that response to the console
        console.log(data)
        // update the page
        location.reload()
    // if there's an error, stop the operation and print the error to the console
    }catch(err){
        console.log(err)
    }
}