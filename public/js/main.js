/* store elements with class name fa-trash in deleteBtn variable */
const deleteBtn = document.querySelectorAll('.fa-trash')
/* store elements with class name item span in item variable */
const item = document.querySelectorAll('.item span')
/* store elements with class name item span completed in itemCompleted variable */
const itemCompleted = document.querySelectorAll('.item span.completed')

/* loop thru all elements in deleteBtn list and add an event listener */
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

/* loop thru all elements in item list and add an event listener */
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

/* loop thru all elements in itemCompleted list and add an event listener */
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

/* asyn function to handle item deletion from todo list */
async function deleteItem(){
    /*Get text from the sibling span element within the same parent node  */
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        /* send DELETE request to endpoint with JSON data */
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        /* parse and console log response data */
        const data = await response.json()
        console.log(data)
        /* reflect changes by reloading page */
        location.reload()

    }catch(err){
        /* catch any errors that might happen */
        console.log(err)
    }
}

/* async function to mark item as complete */
async function markComplete(){
    /* get text of sibling span element */
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        /* send PUT request to API endpoint */
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        /* parse and console log response */
        const data = await response.json()
        console.log(data)
        /* refresh page to show changes */
        location.reload()

    }catch(err){
        /* catch and console log and errors */
        console.log(err)
    }
}

/* asycn function to mark items as complete */
async function markUnComplete(){
    /* get text of sibling span element */
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        /* send PUT request to API endpoint */
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        /* console log response */
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        /* catch any errors and console log them */
        console.log(err)
    }
}