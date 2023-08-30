//Elements with class of 'fa-trash' will be stored in deleteBtn variable.
const deleteBtn = document.querySelectorAll('.fa-trash')
//Elements with class of 'item span' is stored in item variable.
const item = document.querySelectorAll('.item span')
//Elements with class of 'item span.completed' is stored in the itemCompleted variable.
const itemCompleted = document.querySelectorAll('.item span.completed')

//Loop through each delete button, click event listener triggers deleteItem function.
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// Loop through each item, click event listener triggers the markComplete function.
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// Loop through each completed item, click event listener triggers the markUnComplete function.
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//Function to asynchronously delete an item.
async function deleteItem(){
    // Get the text of the item from the second child node of the parent node of the clicked element.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Send a DELETE request to the 'deleteItem' endpoint with the itemText in the request body.
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //Parse the response data as JSON.
        const data = await response.json()
        console.log(data)
        // Reload the page to reflect the updated data.
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// Function to asynchronously mark an item as completed.
async function markComplete(){
    // Get the text of the item from the second child node of the parent node of the clicked element.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Send a PUT request to the 'markComplete' endpoint with the itemText in the request body.
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Parse the response data as JSON.
        const data = await response.json()
        console.log(data)
        // Reload the page to reflect the updated data.
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// Function to asynchronously mark an item as not completed.
async function markUnComplete(){
    // Get the text of the item from the second child node of the parent node of the clicked element.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Send a PUT request to the 'markUnComplete' endpoint with the itemText in the request body.
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Parse the response data as JSON.
        const data = await response.json()
        console.log(data)
        // Reload the page to reflect the updated data.
        location.reload()

    }catch(err){
        console.log(err)
    }
}
