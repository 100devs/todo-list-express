// grab these DOM elements:

const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')


// make an array out of the node list, then, create a click event listener on the delete
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// make an array out of the node list, then, create a click event listener on the marked complete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// make an array out of the node list, then, create a click event listener on the marked uncomplete
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

/**
    when run, take the [1] index of the child node, and grab the inner text. Then make a delete request
    to 'deleteItem' with the itemText attached to the body

    - remember to convert body to a string via JSON.stringify()
    - and remember to convert to JSON() when sending the response object
 */
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    
    try{
        // I NEVER USED 'deleteItem' BEFORE!! IS THIS A PLACEBOLDER?
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)

        // I NEVER USED LOCATION BEFORE!!
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// the next two functions are similar to above, but use put's
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