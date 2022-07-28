const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// Add an event listener with the function deleteItem for each
// item with the class of .fa-trash
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Add an event listener with the function markComplete for each
// item with the class of .item and the next element is a span.
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})


// Add an event listener with the function markUnComplete for each
// item with the class of .item and the next item is a span with a 
// class of completed.
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Function to get the text from the span with the class of .fa-trash.
// Assign the var response with the returned data from the API call to
// deleteItem with the DELETE method.
// Take the response variable, parse the body text as JSON, and assign it to 
// a variable called data.
// Reload the page.
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
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

// Function to get the text from the span with the class of .fa-trash.
// Assign the var response with the returned data from the API call to
// deleteItem with the DELETE method.
// Take the response variable, parse the body text as JSON, and assign it to 
// a variable called data.
// Reload the page.
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

/* Callback function that finds the second element's text in the childNodes array 
and makes an API call to /markUnComplete with 
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
