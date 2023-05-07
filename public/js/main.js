// Query selectors of our HTML element by class and type
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// Since we used querySelectorAll for multiple elements, we are returned a NodeList, which we'll have to transform into an array to operate. We use a forEach loop on the array to add event listeners to all the elements contaiend in the NodeList
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Since we are going to make fetch requests, which involve promises, we are going to use async functions, allowing us to wait for the promise to complete before operating on it.
async function deleteItem(){
    // 'this' references the element from which the event listener was fired, allowing us, in this case, to bind its text content
    const itemText = this.parentNode.childNodes[1].innerText
    // We use try to group the operations that will be done to the promise if it's fulfilled, and catch in case there is an error in any of the steps
    try{
        // Fetch request to the 'deleteItem' route allows us to delete items from the list
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // If the fetch is succesful, the response is logged
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// Same process, but for marking a task as completed
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // In this case, we use 'put' method to update the task
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

// Same as completed, but for marking uncompleted
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