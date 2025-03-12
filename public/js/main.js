// variables for spans in the li 
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// 3 event listeners for each clickable span 
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

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

// these two functions link to the put update on server side
async function markComplete(){
    // parent node is li and span is the childNode (things that take up space makes this text 1 instead of 0)
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                // get task span 
                'itemFromJS': itemText
            })
          })
          // request body included in form data 
        const data = await response.json()
        // marked complete if successful
        console.log(data)
        // refresh page and trigger get request
        location.reload()

    }catch(err){
        // give error if there is one
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
                // get task span
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        // refresh page and trigger get request
        location.reload()

    }catch(err){
        // give error if there is one
        console.log(err)
    }
}